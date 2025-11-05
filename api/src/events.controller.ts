import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBookingDto } from 'shared/src/dtos/createBooking.dto';
import { CreateEventDto } from 'shared/src/dtos/createEvent.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly appService: AppService) {}


  @Get()
  async getEvents() {
    return await this.appService.getEvents();
  }

  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    const { name, total_seats } = dto;
    return await this.appService.createEvent(name, total_seats);
  }
}

