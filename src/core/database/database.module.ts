import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger, LoggerModule } from 'nestjs-pino';
import { TypeOrmPinoLogger } from '@common/loggers/typeorm-pino.logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      inject: [ConfigService, Logger],
      useFactory: (configService: ConfigService, pinoLogger: Logger) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        subscribers: [__dirname + '/subscribers/*{.ts,.js}'],
        synchronize: configService.get('database.synchronize'),
        logger: new TypeOrmPinoLogger(pinoLogger),
        charset: 'utf8mb4',
        timezone: 'Z',
        extra: {
          connectionLimit: 10,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
