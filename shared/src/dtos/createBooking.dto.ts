import { IsNumber, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @Min(1)
  declare event_id: number;

  @IsString()
  declare user_id: string;
}