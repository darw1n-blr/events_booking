import { IsString, IsNumber, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  declare name: string;

  @IsNumber()
  @Min(1)
  declare total_seats: number;
}