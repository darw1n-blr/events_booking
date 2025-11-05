import { Sequelize, DataTypes, Model } from 'sequelize';
import path from 'path';


export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});


export class Event extends Model {
  declare id: number;
  declare name: string;
  declare total_seats: number;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'event',
    tableName: 'events',
    timestamps: false,
  }
);

export class Booking extends Model {
  declare id: number;
  declare event_id: number;
  declare user_id: string;
  declare created_at: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'events', key: 'id' },
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'booking',
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);


Event.hasMany(Booking, {
  foreignKey: 'event_id',
  as: 'bookings',
});

Booking.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event',
});