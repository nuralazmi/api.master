import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

import configs from './config';
import { configValidationSchema } from '@config/config.schema';
import { DatabaseModule } from '@core/database/database.module';
import { CacheModule } from '@core/cache/cache.module';
import { HealthModule } from '@core/health/health.module';
import { MailModule } from '@core/mail/mail.module';
import { TwilioModule } from '@core/twilio/twilio.module';

import { CorrelationIdMiddleware, TenantMiddleware } from '@common/middleware';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { ClientOnlyGuard } from '@common/guards/client-only.guard';

import { ClsModule } from '@core/cls/cls.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ClientModule } from '@modules/clients/client.module';
import { UserModule } from '@modules/user/user.module';
import { CallsModule } from '@modules/calls/calls.module';
import { SystemSettingsModule } from '@modules/system-settings/system-settings.module';
import { PackagesModule } from '@modules/packages/packages.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'info',
              options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'req,res,headers,remoteAddress,remotePort',
              },
            },
            {
              target: 'pino/file',
              options: { destination: './app.log' },
            },
          ],
        },
        genReqId: (req) =>
          req.headers['x-correlation-id'] || crypto.randomUUID(),
        customProps: (req) => ({
          correlationId: req['id'],
        }),
        customSuccessMessage: (req, res) =>
          `Request completed with status ${res.statusCode}`,
        customErrorMessage: (req, res, err) =>
          `Request failed: ${err.message}`,
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      validationSchema: configValidationSchema,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),

    // Core modules
    ClsModule,
    DatabaseModule,
    CacheModule,
    HealthModule,
    MailModule,
    TwilioModule,

    // Feature modules
    ClientModule,
    UserModule,
    AuthModule,
    CallsModule,
    SystemSettingsModule,
    PackagesModule,
    // Add your modules here...
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ClientOnlyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware, TenantMiddleware).forRoutes('*');
  }
}
