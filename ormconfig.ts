import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'myapp_dev',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/core/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: {
    connectionLimit: 10,
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
