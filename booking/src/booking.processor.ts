import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { Booking, Event, sequelize } from 'shared/models';

const kafka = new Kafka({ clientId: 'booking', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'booking-group' });

@Injectable()
export class BookingProcessor {
  constructor() {
    this.init();
  }

  async init() {
    await sequelize.sync();
    await consumer.connect();
    await consumer.subscribe({ topic: 'booking_created' });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        try {
          const bookingData = JSON.parse(message.value.toString());
          const { event_id, user_id } = bookingData;

          const existing = await Booking.findOne({
            where: { event_id, user_id },
          });

          if (existing) {
            console.error(`Duplicate booking attempt: user_id=${user_id}, event_id=${event_id}`);
            return;
          }

          const event = await Event.findByPk(event_id);
          if (!event) {
            console.error(`Event not found: event_id=${event_id}`);
            return;
          }

          const totalBookings = await Booking.count({ where: { event_id } });
          if (totalBookings >= event.total_seats) {
            console.error(`Event is full: event_id=${event_id}`);
            return;
          }

          await Booking.create({ event_id, user_id });
          console.log(`Booking created for user_id=${user_id}, event_id=${event_id}`);
        } catch (error) {
          console.error('Error processing booking:', error);
        }
      },
    });
  }
}