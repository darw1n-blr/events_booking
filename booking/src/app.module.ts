import { Module } from '@nestjs/common';
import { BookingProcessor } from './booking.processor';

@Module({
  providers: [BookingProcessor],
})
export class AppModule {}
