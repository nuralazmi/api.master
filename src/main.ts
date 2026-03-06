import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '@common/dto';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';
import { AllExceptionsFilter, HttpExceptionFilter } from '@common/filters';
import { TransformInterceptor, TimeoutInterceptor } from '@common/interceptors';
import { apiReference } from '@scalar/express-api-reference';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  // Security
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:'],
          fontSrc: ["'self'", 'https:', 'data:'],
        },
      },
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Compression
  app.use(compression());

  // Global prefix
  app.setGlobalPrefix(configService.get('app.apiPrefix') || 'api');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor(), new TimeoutInterceptor());

  // Swagger & Scalar documentation (non-prod only)
  if (configService.get('app.nodeEnv') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('MyApp API')
      .setDescription('Professional NestJS REST API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('health', 'Health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ErrorResponseDto],
    });

    // Add global error responses to all operations
    const globalResponses = {
      '400': {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: { $ref: getSchemaPath(ErrorResponseDto) },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: getSchemaPath(ErrorResponseDto) },
          },
        },
      },
      '403': {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: getSchemaPath(ErrorResponseDto) },
          },
        },
      },
      '500': {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: { $ref: getSchemaPath(ErrorResponseDto) },
          },
        },
      },
    };

    Object.values(document.paths).forEach((path: any) => {
      Object.values(path).forEach((operation: any) => {
        operation.responses = {
          ...operation.responses,
          ...Object.fromEntries(
            Object.entries(globalResponses).filter(
              ([code]) => !operation.responses[code],
            ),
          ),
        };
        if (!operation.parameters) operation.parameters = [];
        const alreadyHasClientId = operation.parameters.some(
          (p: { in: string; name: string }) => p.in === 'header' && p.name === 'X-Client-ID',
        );
        if (!alreadyHasClientId) {
          operation.parameters.push({
            in: 'header',
            name: 'X-Client-ID',
            required: true,
            schema: { type: 'string' },
            description: 'Tenant client identifier',
          });
        }
      });
    });

    SwaggerModule.setup('api/docs/swagger', app, document, {
      customSiteTitle: 'MyApp API Docs',
      swaggerOptions: { persistAuthorization: true },
    });

    app.use(
      '/api/docs/scalar',
      apiReference({
        spec: { content: document },
        theme: 'purple',
        layout: 'modern',
      }),
    );
  }

  const port = configService.get('app.port');
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs/swagger`);
  console.log(`💎 Scalar docs:  http://localhost:${port}/api/docs/scalar`);
  console.log(`💚 Health check: http://localhost:${port}/health`);
}

bootstrap();
