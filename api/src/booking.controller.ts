import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBookingDto } from 'shared/src/dtos/createBooking.dto';
import { CreateEventDto } from 'shared/src/dtos/createEvent.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createBooking(@Body() dto: CreateBookingDto) {
    const { event_id, user_id } = dto;
    return await this.appService.createBooking(event_id, user_id);
  }

  @Get()
  async getBookings() {
    return await this.appService.getBookings();
  }


}

