"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: path_1.default.join(__dirname, '../../database.sqlite'),
    logging: false,
});
class Booking extends sequelize_1.Model {
}
exports.Booking = Booking;
Booking.init({
    restaurant: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    datetime: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    guests: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    status: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'CREATED' },
}, { sequelize: exports.sequelize, modelName: 'booking' });
