import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../core/database/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/../core/database/subscribers/*{.ts,.js}'],
  migrationsRun: true,
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: {
    connectionLimit: 10,
  },
}));
