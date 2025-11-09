import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { QueryTypes } from 'sequelize';
import { Booking, Event, sequelize } from 'shared/models';

const kafka = new Kafka({ clientId: 'api', brokers: ['localhost:9092'] });
const producer = kafka.producer();

@Injectable()
export class AppService {
  constructor() {
    this.init();
  }

  async init() {
    await producer.connect();
    await sequelize.sync();
  }

  async createBooking(event_id: number, user_id: string) {
    const existing = await Booking.findOne({ where: { event_id, user_id } });
    if (existing) {
      throw new ConflictException('Booking already exists for this user and event');
    }

    const event = await Event.findByPk(event_id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const bookedSeats = await Booking.count({ where: { event_id } });
    if (bookedSeats >= event.total_seats) {
      throw new ConflictException('Event is full');
    }

    const bookingData = { event_id, user_id };
    await producer.send({
      topic: 'booking_created',
      messages: [{ value: JSON.stringify(bookingData) }],
    });

    return bookingData;
  }

  async getBookings() {
    return Booking.findAll();
  }

  async getEvents() {
    return Event.findAll();
  }

  async createEvent(name: string, total_seats: number) {
    const event = await Event.create({ name, total_seats });
    return event;
  }

  async getTopUsers() {
    const topUsers = await sequelize.query<{ user_id: number; total_bookings: number }>(
      `SELECT user_id, COUNT(*) AS total_bookings
       FROM bookings
       GROUP BY user_id
       ORDER BY total_bookings DESC
       LIMIT 10`,
      { type: QueryTypes.SELECT }
    );
  
    const res = [];
    let place = 1;
  
    for (let i = 0; i < topUsers.length; i++) {
      if (res.length && topUsers[i].total_bookings !== topUsers[i - 1].total_bookings) {
        place++;
      }
      res.push({
        user_id: topUsers[i].user_id,
        place,
        total_bookings: topUsers[i].total_bookings,
      });
    }
  
    return res;
  }
}