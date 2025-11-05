import { Sequelize, Model } from 'sequelize';
export declare const sequelize: Sequelize;
export declare class Booking extends Model {
    id: number;
    restaurant: string;
    datetime: Date;
    guests: number;
    status: 'CREATED' | 'CHECKING_AVAILABILITY' | 'CONFIRMED' | 'REJECTED';
}
