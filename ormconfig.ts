import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { Users } from './src/user/entities/user.entity'; // <-- o importa todos desde algún índice

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'], // O usa directamente [Users] para pruebas
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});