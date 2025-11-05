import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { BookingController } from './booking.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: path.resolve(__dirname, '../.env'),
  })],
  controllers: [EventsController, BookingController],
  providers: [AppService],
})
export class AppModule {}
