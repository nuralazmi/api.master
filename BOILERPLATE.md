# NestJS Professional Boilerplate

> **Kullanım:** Bu dosya, **zaten oluşturulmuş** bir NestJS projesinin içine konur.
> Claude'a "bu dosyayı implement et" denildiğinde şu kurallar geçerlidir:
>
> - **`pnpm dlx @nestjs/cli new` YAPMA** — proje zaten kurulu.
> - **`package.json`'ı silme/replace etme** — eksik dependency'leri mevcut dosyaya `pnpm add` ile ekle.
> - **`tsconfig.json`'ı silme/replace etme** — sadece `compilerOptions.paths` bölümünü güncelle.
> - **`nest-cli.json`'ı silme/replace etme** — sadece `compilerOptions.assets` ekle.
> - **`src/main.ts` ve `src/app.module.ts`** — mevcut içeriği bu dosyadaki versiyonla **replace** et.
> - **Diğer tüm `src/` dosyaları** — yeni dosya olarak **oluştur** (mevcut değilse) veya **replace** et.
> - Tüm dosyalar oluşturulduktan sonra `pnpm install` çalıştır.
> - Sonra `pnpm build` — sıfır hata beklenir.

---

## Uygulama Sırası (Claude için)

1. **`package.json`** → Aşağıdaki "Eklenecek Dependencies" listesindeki paketleri `pnpm add` ile ekle
2. **`tsconfig.json`** → `paths` bölümünü güncelle
3. **`nest-cli.json`** → `compilerOptions.assets` ekle
4. **`ormconfig.ts`** → Oluştur (yoksa) veya replace et
5. **`.env.example`** → Oluştur
6. **`src/main.ts`** → Replace et
7. **`src/app.module.ts`** → Replace et
8. **`src/config/`** → Tüm dosyaları oluştur
9. **`src/common/`** → Tüm dosyaları oluştur
10. **`src/core/`** → Tüm dosyaları oluştur
11. **`src/modules/auth/`** → Oluştur
12. **`src/modules/test/`** → Oluştur
13. `pnpm install` çalıştır
14. `pnpm build` → sıfır hata beklenir

---

## Stack

- **Framework:** NestJS 10
- **ORM:** TypeORM + MySQL
- **Cache:** Redis (cache-manager-redis-yet)
- **Logging:** nestjs-pino + pino-pretty
- **Auth:** passport-jwt
- **Docs:** Swagger UI + Scalar
- **Package manager:** pnpm
- **Path aliases:** `@/` → `src/`, `@common/` → `src/common/`, `@core/` → `src/core/`, `@config/` → `src/config/`, `@modules/` → `src/modules/`

---

## Dizin Yapısı

```
my-project/
├── ormconfig.ts
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── config/
    │   ├── app.config.ts
    │   ├── database.config.ts
    │   ├── redis.config.ts
    │   ├── mail.config.ts
    │   ├── sms.config.ts
    │   ├── firebase.config.ts
    │   ├── storage.config.ts
    │   ├── swagger.config.ts
    │   ├── config.schema.ts
    │   └── index.ts
    ├── core/
    │   ├── database/
    │   │   └── database.module.ts
    │   ├── cache/
    │   │   ├── cache.module.ts
    │   │   └── cache.service.ts
    │   ├── mail/
    │   │   ├── mail.module.ts
    │   │   ├── mail.service.ts
    │   │   └── templates/
    │   │       ├── basic.hbs
    │   │       └── email-verification.hbs
    │   └── health/
    │       ├── health.module.ts
    │       └── health.controller.ts
    ├── common/
    │   ├── base/
    │   │   ├── base.entity.ts
    │   │   ├── base.repository.ts
    │   │   ├── base.dto.ts
    │   │   └── index.ts
    │   ├── loggers/
    │   │   └── typeorm-pino.logger.ts
    │   ├── dto/
    │   │   ├── api-response.dto.ts
    │   │   ├── error-response.dto.ts
    │   │   ├── cursor-pagination.dto.ts
    │   │   ├── cursor-pagination-response.dto.ts
    │   │   └── index.ts
    │   ├── interceptors/
    │   │   ├── transform.interceptor.ts
    │   │   ├── timeout.interceptor.ts
    │   │   └── index.ts
    │   ├── filters/
    │   │   ├── all-exceptions.filter.ts
    │   │   ├── http-exception.filter.ts
    │   │   └── index.ts
    │   ├── guards/
    │   │   ├── jwt-auth.guard.ts
    │   │   ├── roles.guard.ts
    │   │   └── index.ts
    │   ├── middleware/
    │   │   ├── correlation-id.middleware.ts
    │   │   └── index.ts
    │   ├── decorators/
    │   │   ├── current-user.decorator.ts
    │   │   ├── public.decorator.ts
    │   │   ├── roles.decorator.ts
    │   │   ├── api-wrapped-response.decorator.ts
    │   │   ├── api-paginated-response.decorator.ts
    │   │   ├── api-cursor-paginated-response.decorator.ts
    │   │   ├── swagger-response.utils.ts
    │   │   └── index.ts
    │   ├── constants/
    │   │   ├── user-roles.enum.ts
    │   │   ├── error-codes.enum.ts
    │   │   └── index.ts
    │   ├── exceptions/
    │   │   ├── base.exception.ts
    │   │   ├── business.exception.ts
    │   │   └── index.ts
    │   └── utils/
    │       ├── password.util.ts
    │       ├── string.util.ts
    │       ├── cursor.util.ts
    │       └── index.ts
    └── modules/
        ├── auth/
        │   ├── auth.module.ts
        │   ├── jwt.strategy.ts
        │   └── dto/
        │       └── jwt-payload.dto.ts
        └── test/
            ├── test.module.ts
            ├── test.controller.ts
            ├── test.service.ts
            └── dto/
                ├── test-response.dto.ts
                └── index.ts
```

---

## Response Format

### Tekil Response
```json
{
  "success": true,
  "message": "Operation successful",
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/v1/test",
    "correlationId": "abc-123"
  },
  "data": { ... }
}
```

### Cursor Paginated Response
```json
{
  "success": true,
  "message": "Listed successfully",
  "pagination": {
    "nextCursor": "01234567-...",
    "hasNextPage": true,
    "limit": 10
  },
  "meta": { "timestamp": "...", "path": "..." },
  "data": [ ... ]
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "meta": { "timestamp": "...", "path": "...", "method": "POST" }
}
```

---

## Controller Dönüş Paterni

```typescript
// Tekil - TransformInterceptor data'yı alır
return { message: 'Created', data: result };

// Cursor paginated - TransformInterceptor nextCursor'u algılar
return { message: 'Listed', ...cursorResult };
// cursorResult = { data: [...], nextCursor: '...', hasNextPage: true, limit: 10 }
```

---

## Cursor Pagination Nasıl Çalışır

1. `CursorPaginationDto` → `limit`, `after` (UUID v7 id)
2. `BaseRepository.findWithCursorPagination()` → `limit + 1` kayıt çeker
3. `sliceCursorResults()` → son elemanı keser, `hasNextPage` belirler
4. `nextCursor` = son elemanın `id` (UUID v7, sıralı)
5. `TransformInterceptor` → `nextCursor` key'ini görünce `pagination` envelope'a dönüştürür
6. Sonraki sayfa için `?after=<nextCursor>` kullan

---

## Migration Komutları

```bash
pnpm migration:generate src/core/database/migrations/CreateUsersTable
pnpm migration:run
pnpm migration:revert
```

---

## Dosyalar

---

### `package.json` — Eklenecek Paketler

> **Mevcut `package.json`'ı silme.** Aşağıdaki komutları çalıştır:

```bash
# Runtime dependencies
pnpm add @nestjs/cache-manager @nestjs/config @nestjs/event-emitter @nestjs/jwt \
  @nestjs/passport @nestjs/schedule @nestjs/swagger @nestjs/terminus \
  @nestjs/throttler @nestjs/typeorm @scalar/express-api-reference \
  bcrypt cache-manager cache-manager-redis-yet class-transformer class-validator \
  compression handlebars helmet joi mysql2 nestjs-pino nodemailer \
  passport passport-jwt pino pino-http pino-pretty redis typeorm uuid

# Dev dependencies
pnpm add -D @types/bcrypt @types/compression @types/nodemailer \
  @types/passport-jwt tsconfig-paths
```

> Ayrıca `package.json`'daki `"scripts"` bölümüne şunları ekle (yoksa):

```json
"scripts": {
  "typeorm": "NODE_OPTIONS='-r tsconfig-paths/register' typeorm-ts-node-commonjs",
  "migration:generate": "npm run typeorm -- migration:generate -d ormconfig.ts",
  "migration:run": "npm run typeorm -- migration:run -d ormconfig.ts",
  "migration:revert": "npm run typeorm -- migration:revert -d ormconfig.ts"
}
```

> `jest.moduleNameMapper` bölümüne path alias'larını ekle:

```json
"jest": {
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/$1",
    "^@common/(.*)$": "<rootDir>/common/$1",
    "^@core/(.*)$": "<rootDir>/core/$1",
    "^@config/(.*)$": "<rootDir>/config/$1",
    "^@modules/(.*)$": "<rootDir>/modules/$1"
  }
}
```

---

### `tsconfig.json` — Güncellenecek Bölüm

> **Dosyayı silme.** Sadece `compilerOptions` içine aşağıdaki `paths` ve `baseUrl` değerlerini ekle/güncelle:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@common/*": ["src/common/*"],
      "@core/*": ["src/core/*"],
      "@modules/*": ["src/modules/*"]
    }
  }
}
```

---

### `tsconfig.build.json` — Kontrol Et

> Zaten varsa dokunma. Yoksa oluştur:

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
```

---

### `nest-cli.json` — Güncellenecek Bölüm

> **Dosyayı silme.** Sadece `compilerOptions.assets` ekle/güncelle:

```json
{
  "compilerOptions": {
    "assets": ["**/*.hbs"],
    "watchAssets": false
  }
}
```

---

### `ormconfig.ts`

```typescript
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
```

---

### `.env.example`

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api
TZ=UTC
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CORS_ORIGINS=*

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=myapp_dev
DB_SYNCHRONIZE=false
DB_LOGGING=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Mail (Mailtrap for dev)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USER=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM=noreply@myapp.com
MAIL_FROM_NAME=MyApp

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3001

# SMS (optional)
SMS_PROVIDER=netgsm
SMS_API_KEY=
SMS_SECRET=
SMS_SENDER=

# Firebase FCM (optional)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Storage
STORAGE_DRIVER=local
LOCAL_UPLOAD_PATH=./uploads
AWS_S3_REGION=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
MAX_FILE_SIZE=5242880
```

---

### `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '@common/dto';
import { AppModule } from './app.module';
import compression from 'compression';
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
```

---

### `src/app.module.ts`

```typescript
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

import configs from './config';
import { configValidationSchema } from '@config/config.schema';
import { DatabaseModule } from '@core/database/database.module';
import { CacheModule } from '@core/cache/cache.module';
import { HealthModule } from '@core/health/health.module';
import { MailModule } from '@core/mail/mail.module';

import { CorrelationIdMiddleware } from '@common/middleware';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';

import { AuthModule } from '@modules/auth/auth.module';
import { TestModule } from '@modules/test/test.module';

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
    DatabaseModule,
    CacheModule,
    HealthModule,
    MailModule,

    // Feature modules
    AuthModule,
    TestModule,
    // Add your modules here...
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
```

---

### `src/config/app.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  throttleTtl: parseInt(process.env.THROTTLE_TTL || '60', 10),
  throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
  timezone: process.env.TZ || 'UTC',
}));
```

---

### `src/config/database.config.ts`

```typescript
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
```

---

### `src/config/redis.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
}));
```

---

### `src/config/mail.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: parseInt(process.env.MAIL_PORT || '587', 10) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  from: {
    email: process.env.MAIL_FROM,
    name: process.env.MAIL_FROM_NAME || 'MyApp',
  },
  templatesDir: __dirname + '/../core/mail/templates',
}));
```

---

### `src/config/sms.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('sms', () => ({
  provider: process.env.SMS_PROVIDER,
  apiKey: process.env.SMS_API_KEY,
  secret: process.env.SMS_SECRET,
  sender: process.env.SMS_SENDER,
}));
```

---

### `src/config/firebase.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}));
```

---

### `src/config/storage.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  driver: process.env.STORAGE_DRIVER || 'local',
  local: {
    uploadPath: process.env.LOCAL_UPLOAD_PATH || './uploads',
  },
  s3: {
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
}));
```

---

### `src/config/swagger.config.ts`

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  enabled: process.env.NODE_ENV !== 'production',
  title: 'MyApp API',
  description: 'Professional NestJS REST API Documentation',
  version: '1.0',
  path: 'api/docs',
}));
```

---

### `src/config/config.schema.ts`

```typescript
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  TZ: Joi.string().default('UTC'),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').default(''),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional().allow(''),
  REDIS_TTL: Joi.number().default(3600),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Mail
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM: Joi.string().email().required(),
  MAIL_FROM_NAME: Joi.string().default('MyApp'),

  // Frontend URL
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),

  // SMS (optional)
  SMS_PROVIDER: Joi.string().optional().allow(''),
  SMS_API_KEY: Joi.string().optional().allow(''),
  SMS_SECRET: Joi.string().optional().allow(''),
  SMS_SENDER: Joi.string().optional().allow(''),

  // Firebase FCM (optional)
  FIREBASE_PROJECT_ID: Joi.string().optional().allow(''),
  FIREBASE_PRIVATE_KEY: Joi.string().optional().allow(''),
  FIREBASE_CLIENT_EMAIL: Joi.string().optional().allow(''),

  // Storage
  STORAGE_DRIVER: Joi.string().valid('local', 's3').default('local'),
  LOCAL_UPLOAD_PATH: Joi.string().default('./uploads'),
  AWS_S3_REGION: Joi.string().when('STORAGE_DRIVER', {
    is: 's3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  AWS_S3_BUCKET: Joi.string().when('STORAGE_DRIVER', {
    is: 's3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  AWS_ACCESS_KEY_ID: Joi.string().when('STORAGE_DRIVER', {
    is: 's3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  AWS_SECRET_ACCESS_KEY: Joi.string().when('STORAGE_DRIVER', {
    is: 's3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  MAX_FILE_SIZE: Joi.number().default(5242880),

  // Rate Limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),

  // CORS
  CORS_ORIGINS: Joi.string().default('*'),
});
```

---

### `src/config/index.ts`

```typescript
import appConfig from './app.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import mailConfig from './mail.config';
import smsConfig from './sms.config';
import firebaseConfig from './firebase.config';
import storageConfig from './storage.config';
import swaggerConfig from './swagger.config';

export default [
  appConfig,
  databaseConfig,
  redisConfig,
  mailConfig,
  smsConfig,
  firebaseConfig,
  storageConfig,
  swaggerConfig,
];

export {
  appConfig,
  databaseConfig,
  redisConfig,
  mailConfig,
  smsConfig,
  firebaseConfig,
  storageConfig,
  swaggerConfig,
};
```

---

### `src/common/loggers/typeorm-pino.logger.ts`

```typescript
import { Logger as TypeOrmLogger } from 'typeorm';
import { Logger } from 'nestjs-pino';

export class TypeOrmPinoLogger implements TypeOrmLogger {
  constructor(private readonly pinoLogger: Logger) {}

  logQuery(query: string, parameters?: any[]) {
    this.pinoLogger.log({ type: 'query', query, parameters }, 'Database Query');
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.pinoLogger.error(
      { type: 'query-error', error, query, parameters },
      'Database Query Failed',
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.pinoLogger.warn(
      { type: 'slow-query', duration: time, query },
      'Slow Query Detected',
    );
  }

  logSchemaBuild(message: string) {
    this.pinoLogger.log(message, 'Database Schema Build');
  }

  logMigration(message: string) {
    this.pinoLogger.log(message, 'Database Migration');
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    if (level === 'log') this.pinoLogger.log(message);
    if (level === 'info') this.pinoLogger.log(message);
    if (level === 'warn') this.pinoLogger.warn(message);
  }
}
```

---

### `src/core/database/database.module.ts`

```typescript
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
```

---

### `src/core/health/health.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
```

---

### `src/core/health/health.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorators';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Overall health check' })
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('db')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Database health check' })
  checkDb() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('ready')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe' })
  checkReady() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  checkLive() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```

---

### `src/core/cache/cache.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
          },
          password: configService.get('redis.password'),
          ttl: configService.get('redis.ttl') * 1000,
        }),
        isGlobal: true,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
```

---

### `src/core/cache/cache.service.ts`

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get<T>(key);
    return value ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }

  /**
   * Cache-aside pattern: get from cache or execute callback and store result
   * Usage: const data = await cacheService.remember('key', 300, () => db.find());
   */
  async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
    const fresh = await callback();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  private get redisClient() {
    return ((this.cacheManager as any).store as RedisStore).client;
  }

  // Example: track seen items per user (Redis Set, 7-day TTL)
  async addSeenItems(userId: string, itemIds: string[]): Promise<void> {
    const key = `user:seen:${userId}`;
    await this.redisClient.sAdd(key, itemIds);
    await this.redisClient.expire(key, 7 * 24 * 60 * 60);
  }

  async getSeenItemIds(userId: string): Promise<string[]> {
    return this.redisClient.sMembers(`user:seen:${userId}`);
  }
}
```

---

### `src/core/mail/mail.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
```

---

### `src/core/mail/mail.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<number>('MAIL_PORT') === 465,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });

    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';

    this.logger.log('Mail service initialized');
  }

  async send(email: string, title: string, message: string): Promise<void> {
    try {
      const template = this.loadTemplate('basic');
      const html = template({ title, message });

      await this.transporter.sendMail({
        from: `${this.configService.get<string>('MAIL_FROM_NAME')} <${this.configService.get<string>('MAIL_FROM')}>`,
        to: email,
        subject: title,
        html,
      });

      this.logger.log(`Email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
    }
  }

  async sendEmailVerification(
    email: string,
    name: string,
    token: string,
    code?: string,
  ): Promise<void> {
    try {
      const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;
      const template = this.loadTemplate('email-verification');
      const html = template({
        name: name || 'User',
        verificationUrl,
        expiresIn: '24 hours',
        code,
        hasCode: !!code,
      });

      await this.transporter.sendMail({
        from: `${this.configService.get<string>('MAIL_FROM_NAME')} <${this.configService.get<string>('MAIL_FROM')}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html,
      });

      this.logger.log(`Email verification sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email verification to ${email}`, error);
    }
  }

  async sendPasswordReset(email: string, name: string, token: string): Promise<void> {
    try {
      const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
      const template = this.loadTemplate('password-reset');
      const html = template({ name: name || 'User', resetUrl, expiresIn: '1 hour' });

      await this.transporter.sendMail({
        from: `${this.configService.get<string>('MAIL_FROM_NAME')} <${this.configService.get<string>('MAIL_FROM')}>`,
        to: email,
        subject: 'Reset Your Password',
        html,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
    }
  }

  private loadTemplate(templateName: string): HandlebarsTemplateDelegate {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    return handlebars.compile(templateSource);
  }
}
```

---

### `src/core/mail/templates/basic.hbs`

```handlebars
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header"><h1>{{title}}</h1></div>
  <div class="content"><p>{{message}}</p></div>
  <div class="footer"><p>This is an automated message. Please do not reply.</p></div>
</body>
</html>
```

---

### `src/core/mail/templates/email-verification.hbs`

```handlebars
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .btn { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
    .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header"><h1>Verify Your Email</h1></div>
  <div class="content">
    <p>Hello {{name}},</p>
    <p>Please verify your email address. This link expires in {{expiresIn}}.</p>
    {{#if hasCode}}
    <p>Your verification code:</p>
    <div class="code">{{code}}</div>
    {{/if}}
    <a href="{{verificationUrl}}" class="btn">Verify Email</a>
    <p>Or copy this link: {{verificationUrl}}</p>
  </div>
  <div class="footer"><p>If you didn't request this, please ignore this email.</p></div>
</body>
</html>
```

---

### `src/core/mail/templates/password-reset.hbs`

```handlebars
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #DC2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .btn { display: inline-block; background: #DC2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header"><h1>Reset Your Password</h1></div>
  <div class="content">
    <p>Hello {{name}},</p>
    <p>You requested to reset your password. Click the button below. This link expires in {{expiresIn}}.</p>
    <a href="{{resetUrl}}" class="btn">Reset Password</a>
    <p>Or copy this link: {{resetUrl}}</p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
  <div class="footer"><p>This is an automated message.</p></div>
</body>
</html>
```

---

### `src/common/base/base.entity.ts`

```typescript
import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BeforeInsert,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

/**
 * Base Entity — extend this in all entities.
 * Provides: UUID v7 id, createdAt, updatedAt, deletedAt (soft delete), audit fields.
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 6,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: 6,
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  deletedAt?: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;
}
```

---

### `src/common/base/base.repository.ts`

```typescript
import { DeepPartial, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import { CursorPaginationDto } from '@common/dto/cursor-pagination.dto';
import { CursorPaginationResponseDto } from '@common/dto/cursor-pagination-response.dto';
import { sliceCursorResults } from '@common/utils/cursor.util';

/**
 * Base Repository — extend this in all repositories.
 *
 * Usage:
 *   @Injectable()
 *   export class UserRepository extends BaseRepository<UserEntity> {
 *     constructor(@InjectRepository(UserEntity) repo: Repository<UserEntity>) {
 *       super(repo);
 *     }
 *   }
 */
export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations,
    });
  }

  async findByIdOrFail(id: string, relations?: string[]): Promise<T> {
    const entity = await this.findById(id, relations);
    if (!entity) {
      throw new NotFoundException(
        `${this.repository.metadata.name} with id ${id} not found`,
      );
    }
    return entity;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  /**
   * Cursor-based pagination (id DESC — UUID v7 ensures chronological order)
   */
  async findWithCursorPagination(
    cursorDto: CursorPaginationDto,
    options?: { where?: FindOptionsWhere<T>; relations?: string[] },
  ): Promise<CursorPaginationResponseDto<T>> {
    const { limit = 10, after } = cursorDto;
    const alias = 'entity';

    const qb = this.repository.createQueryBuilder(alias);

    // Relations
    if (options?.relations) {
      const addedAliases = new Set<string>();
      for (const relation of options.relations) {
        const parts = relation.split('.');
        if (parts.length === 1) {
          if (!addedAliases.has(parts[0])) {
            qb.leftJoinAndSelect(`${alias}.${parts[0]}`, parts[0]);
            addedAliases.add(parts[0]);
          }
        } else if (parts.length === 2) {
          const [parent, child] = parts;
          if (!addedAliases.has(parent)) {
            qb.leftJoinAndSelect(`${alias}.${parent}`, parent);
            addedAliases.add(parent);
          }
          const childAlias = `${parent}_${child}`;
          if (!addedAliases.has(childAlias)) {
            qb.leftJoinAndSelect(`${parent}.${child}`, child);
            addedAliases.add(childAlias);
          }
        }
      }
    }

    // Where conditions
    if (options?.where) {
      const params: Record<string, any> = {};
      const conditions: string[] = [];
      Object.entries(options.where as Record<string, any>).forEach(([key, value]) => {
        conditions.push(`${alias}.${key} = :where_${key}`);
        params[`where_${key}`] = value;
      });
      if (conditions.length > 0) {
        qb.andWhere(conditions.join(' AND '), params);
      }
    }

    // Cursor
    if (after) {
      qb.andWhere(`${alias}.id < :afterId`, { afterId: after });
    }

    qb.orderBy(`${alias}.id`, 'DESC').take(limit + 1);

    const rows = await qb.getMany();
    const { items, hasNextPage } = sliceCursorResults(rows, limit);

    return {
      data: items,
      nextCursor: hasNextPage && items.length > 0 ? items[items.length - 1].id : null,
      hasNextPage,
      limit,
    };
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data);
    return this.repository.save(entities);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return this.findByIdOrFail(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }

  async findOne(where: FindOptionsWhere<T>, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({ where, relations });
  }

  async findOneOrFail(where: FindOptionsWhere<T>, relations?: string[]): Promise<T> {
    const entity = await this.findOne(where, relations);
    if (!entity) {
      throw new NotFoundException(`${this.repository.metadata.name} not found`);
    }
    return entity;
  }

  async findRandom(limit = 1, options?: FindManyOptions<T>): Promise<T[]> {
    const total = await this.repository.count();
    if (total === 0) return [];
    const safeLimit = Math.min(limit, total);
    const randomOffset = Math.floor(Math.random() * Math.max(total - safeLimit, 0));
    return this.repository.find({ ...options, skip: randomOffset, take: safeLimit });
  }
}
```

---

### `src/common/base/base.dto.ts`

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BaseQueryDto {
  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;
}
```

---

### `src/common/base/index.ts`

```typescript
export * from './base.entity';
export * from './base.repository';
export * from './base.dto';
```

---

### `src/common/dto/api-response.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseMetaDto {
  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/v1/users' })
  path!: string;

  @ApiPropertyOptional({ example: 'abc-123-def-456' })
  correlationId?: string;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;

  @ApiProperty({ example: true })
  hasNext!: boolean;

  @ApiProperty({ example: false })
  hasPrev!: boolean;
}

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message!: string;

  @ApiProperty({ type: ResponseMetaDto })
  meta!: ResponseMetaDto;

  @ApiProperty()
  data!: T;
}

export class PaginatedApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message!: string;

  @ApiProperty({ type: PaginationMetaDto })
  pagination!: PaginationMetaDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta!: ResponseMetaDto;

  @ApiProperty({ isArray: true })
  data!: T[];
}

export class CursorPaginationMetaDto {
  @ApiPropertyOptional({ example: '01234567-...', nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ example: 10 })
  limit!: number;
}

export class CursorPaginatedApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message!: string;

  @ApiProperty({ type: CursorPaginationMetaDto })
  pagination!: CursorPaginationMetaDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta!: ResponseMetaDto;

  @ApiProperty({ isArray: true })
  data!: T[];
}
```

---

### `src/common/dto/error-response.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorMetaDto {
  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/v1/auth/register' })
  path!: string;

  @ApiProperty({ example: 'POST' })
  method!: string;

  @ApiPropertyOptional({ example: 'abc-123-def-456' })
  correlationId?: string;
}

export class ValidationErrorDto {
  @ApiProperty({ example: 'email' })
  field!: string;

  @ApiProperty({ example: 'must be a valid email' })
  message!: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Validation failed' })
  message!: string | string[];

  @ApiProperty({ example: 'VALIDATION_ERROR' })
  errorCode!: string;

  @ApiPropertyOptional({ type: [ValidationErrorDto] })
  errors?: ValidationErrorDto[];

  @ApiPropertyOptional()
  details?: any;

  @ApiProperty({ type: ErrorMetaDto })
  meta!: ErrorMetaDto;
}
```

---

### `src/common/dto/cursor-pagination.dto.ts`

```typescript
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CursorPaginationDto {
  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'UUID v7 id of the last item from previous page' })
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({ description: 'UUID v7 id; returns items NEWER than this cursor' })
  @IsOptional()
  @IsString()
  before?: string;
}
```

---

### `src/common/dto/cursor-pagination-response.dto.ts`

```typescript
export class CursorPaginationResponseDto<T> {
  data!: T[];
  nextCursor!: string | null;
  hasNextPage!: boolean;
  limit!: number;
}
```

---

### `src/common/dto/index.ts`

```typescript
export * from './cursor-pagination.dto';
export * from './cursor-pagination-response.dto';
export * from './api-response.dto';
export * from './error-response.dto';
```

---

### `src/common/interceptors/transform.interceptor.ts`

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponseDto, PaginatedApiResponseDto, ResponseMetaDto } from '@common/dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T> | PaginatedApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T> | PaginatedApiResponseDto<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const meta: ResponseMetaDto = {
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: (request as any).correlationId,
    };

    return next.handle().pipe(
      map((data) => {
        // Cursor pagination detection — response contains nextCursor key
        const isCursorResult =
          data !== null && typeof data === 'object' && 'nextCursor' in data;

        return {
          success: true,
          message: data?.message || 'Operation successful',
          ...(isCursorResult
            ? {
                pagination: {
                  nextCursor: data.nextCursor,
                  hasNextPage: data.hasNextPage,
                  limit: data.limit,
                },
              }
            : data?.pagination !== undefined
              ? { pagination: data.pagination }
              : {}),
          meta,
          data: data?.data !== undefined ? data.data : data,
        };
      }),
    );
  }
}
```

---

### `src/common/interceptors/timeout.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs: number = 200000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('Request timeout'));
        }
        return throwError(() => err);
      }),
    );
  }
}
```

---

### `src/common/interceptors/index.ts`

```typescript
export * from './transform.interceptor';
export * from './timeout.interceptor';
```

---

### `src/common/filters/all-exceptions.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
      errorCode = (exceptionResponse as any).errorCode || 'HTTP_EXCEPTION';
    }

    this.logger.error({
      message,
      statusCode: status,
      path: request.url,
      method: request.method,
      stack: exception instanceof Error ? exception.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errorCode,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        correlationId: (request as any).correlationId,
      },
    });
  }
}
```

---

### `src/common/filters/http-exception.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      success: false,
      statusCode: status,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'An error occurred',
      errorCode: (exceptionResponse as any).errorCode || 'HTTP_EXCEPTION',
      errors: (exceptionResponse as any).errors || undefined,
      details: (exceptionResponse as any).details || undefined,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        correlationId: (request as any).correlationId,
      },
    });
  }
}
```

---

### `src/common/filters/index.ts`

```typescript
export * from './http-exception.filter';
export * from './all-exceptions.filter';
```

---

### `src/common/guards/jwt-auth.guard.ts`

```typescript
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
```

---

### `src/common/guards/roles.guard.ts`

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { UserRole } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

---

### `src/common/guards/index.ts`

```typescript
export * from './jwt-auth.guard';
export * from './roles.guard';
```

---

### `src/common/middleware/correlation-id.middleware.ts`

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
    (req as any).correlationId = correlationId;
    res.setHeader('X-Correlation-Id', correlationId);
    next();
  }
}
```

---

### `src/common/middleware/index.ts`

```typescript
export * from './correlation-id.middleware';
```

---

### `src/common/decorators/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  id: string;
  email: string;
  role: string;
}

/**
 * Extracts the authenticated user from the JWT-verified request.
 * Usage: @CurrentUser() user: CurrentUserData
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as CurrentUserData;
  },
);
```

---

### `src/common/decorators/public.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route as public — bypasses JwtAuthGuard.
 * Usage: @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

---

### `src/common/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../constants';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to specific roles.
 * Usage: @Roles(UserRole.ADMIN)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

---

### `src/common/decorators/swagger-response.utils.ts`

```typescript
import { Type } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';

export const getMetaSchema = () => ({
  type: 'object',
  properties: {
    timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
    path: { type: 'string', example: '/api/v1/users' },
    correlationId: { type: 'string', example: 'abc-123-def-456' },
  },
  required: ['timestamp', 'path'],
});

export const getPaginationSchema = () => ({
  type: 'object',
  properties: {
    page: { type: 'number', example: 1 },
    limit: { type: 'number', example: 10 },
    total: { type: 'number', example: 100 },
    totalPages: { type: 'number', example: 10 },
    hasNext: { type: 'boolean', example: true },
    hasPrev: { type: 'boolean', example: false },
  },
  required: ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrev'],
});

export const getCursorPaginationSchema = () => ({
  type: 'object',
  properties: {
    nextCursor: { type: 'string', nullable: true, example: '01234567-...' },
    hasNextPage: { type: 'boolean', example: true },
    limit: { type: 'number', example: 10 },
  },
  required: ['nextCursor', 'hasNextPage', 'limit'],
});

export const buildWrappedSchema = <TModel extends Type<any>>(
  model: TModel,
  options?: { isArray?: boolean; message?: string },
) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: options?.message || 'Operation successful' },
    meta: getMetaSchema(),
    data: options?.isArray
      ? { type: 'array', items: { $ref: getSchemaPath(model) } }
      : { $ref: getSchemaPath(model) },
  },
  required: ['success', 'message', 'meta', 'data'],
});

export const buildPaginatedSchema = <TModel extends Type<any>>(
  model: TModel,
  options?: { message?: string },
) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: options?.message || 'Data retrieved successfully' },
    pagination: getPaginationSchema(),
    meta: getMetaSchema(),
    data: { type: 'array', items: { $ref: getSchemaPath(model) } },
  },
  required: ['success', 'message', 'pagination', 'meta', 'data'],
});

export const buildCursorPaginatedSchema = <TModel extends Type<any>>(
  model: TModel,
  options?: { message?: string },
) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: options?.message || 'Data retrieved successfully' },
    pagination: getCursorPaginationSchema(),
    meta: getMetaSchema(),
    data: { type: 'array', items: { $ref: getSchemaPath(model) } },
  },
  required: ['success', 'message', 'pagination', 'meta', 'data'],
});
```

---

### `src/common/decorators/api-wrapped-response.decorator.ts`

```typescript
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { buildWrappedSchema } from './swagger-response.utils';

export interface ApiWrappedResponseOptions {
  status?: number;
  description?: string;
  message?: string;
  isArray?: boolean;
}

/**
 * Swagger decorator for single/array wrapped response.
 * Matches TransformInterceptor output.
 *
 * @example @ApiWrappedResponse(UserResponseDto)
 * @example @ApiWrappedResponse(UserResponseDto, { status: 201, isArray: true })
 */
export const ApiWrappedResponse = <TModel extends Type<any>>(
  model: TModel,
  options: ApiWrappedResponseOptions = {},
) => {
  const {
    status = HttpStatus.OK,
    description = 'Operation successful',
    message,
    isArray = false,
  } = options;

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [buildWrappedSchema(model, { isArray, message: message || description })],
      },
    }),
  );
};

export const ApiWrappedCreatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options: Omit<ApiWrappedResponseOptions, 'status'> = {},
) => ApiWrappedResponse(model, { ...options, status: HttpStatus.CREATED });

export const ApiWrappedArrayResponse = <TModel extends Type<any>>(
  model: TModel,
  options: Omit<ApiWrappedResponseOptions, 'isArray'> = {},
) => ApiWrappedResponse(model, { ...options, isArray: true });
```

---

### `src/common/decorators/api-paginated-response.decorator.ts`

```typescript
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { buildPaginatedSchema } from './swagger-response.utils';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options: { status?: number; description?: string; message?: string } = {},
) => {
  const { status = HttpStatus.OK, description = 'Data retrieved successfully', message } = options;

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [buildPaginatedSchema(model, { message: message || description })],
      },
    }),
  );
};
```

---

### `src/common/decorators/api-cursor-paginated-response.decorator.ts`

```typescript
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { buildCursorPaginatedSchema } from './swagger-response.utils';

/**
 * Swagger decorator for cursor-paginated endpoints.
 *
 * @example @ApiCursorPaginatedResponse(UserResponseDto)
 */
export const ApiCursorPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options: { status?: number; description?: string; message?: string } = {},
) => {
  const { status = HttpStatus.OK, description = 'Data retrieved successfully', message } = options;

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [buildCursorPaginatedSchema(model, { message: message || description })],
      },
    }),
  );
};
```

---

### `src/common/decorators/index.ts`

```typescript
export * from './current-user.decorator';
export * from './roles.decorator';
export * from './public.decorator';
export * from './api-paginated-response.decorator';
export * from './api-cursor-paginated-response.decorator';
export * from './api-wrapped-response.decorator';
```

---

### `src/common/constants/user-roles.enum.ts`

```typescript
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
```

---

### `src/common/constants/error-codes.enum.ts`

```typescript
export enum ErrorCode {
  // General
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',

  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  INVALID_VERIFICATION_TOKEN = 'INVALID_VERIFICATION_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  INVALID_RESET_TOKEN = 'INVALID_RESET_TOKEN',
  INVALID_CURRENT_PASSWORD = 'INVALID_CURRENT_PASSWORD',
  INVALID_CODE = 'INVALID_CODE',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',

  // User
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_INACTIVE = 'USER_INACTIVE',
  USER_BANNED = 'USER_BANNED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED',

  // File
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED = 'FILE_TYPE_NOT_ALLOWED',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',

  // External Services
  SMS_SERVICE_ERROR = 'SMS_SERVICE_ERROR',
  MAIL_SERVICE_ERROR = 'MAIL_SERVICE_ERROR',
  STORAGE_SERVICE_ERROR = 'STORAGE_SERVICE_ERROR',
  PUSH_NOTIFICATION_ERROR = 'PUSH_NOTIFICATION_ERROR',

  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  QUERY_FAILED = 'QUERY_FAILED',
}
```

---

### `src/common/constants/index.ts`

```typescript
export * from './user-roles.enum';
export * from './error-codes.enum';
```

---

### `src/common/exceptions/base.exception.ts`

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export interface ExceptionResponse {
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  path?: string;
  details?: any;
}

/**
 * Base Exception — all custom exceptions should extend this.
 * Provides consistent { statusCode, message, errorCode, timestamp, details } format.
 */
export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly errorCode: string,
    public readonly details?: any,
  ) {
    super(
      {
        statusCode,
        message,
        errorCode,
        timestamp: new Date().toISOString(),
        details,
      },
      statusCode,
    );
  }
}
```

---

### `src/common/exceptions/business.exception.ts`

```typescript
import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * Business logic error (400)
 * Usage: throw new BusinessException('User already exists', ErrorCode.USER_ALREADY_EXISTS);
 */
export class BusinessException extends BaseException {
  constructor(message: string, errorCode: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, errorCode, details);
  }
}

/**
 * Conflict error (409)
 */
export class ConflictException extends BaseException {
  constructor(message: string, errorCode: string = 'CONFLICT_ERROR', details?: any) {
    super(message, HttpStatus.CONFLICT, errorCode, details);
  }
}
```

---

### `src/common/exceptions/index.ts`

```typescript
export * from './base.exception';
export * from './business.exception';
```

---

### `src/common/utils/password.util.ts`

```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

---

### `src/common/utils/string.util.ts`

```typescript
export function generateRandomString(length = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/** Generate 6-digit verification code */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return email;
  return `${localPart.substring(0, 2)}***@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  return `***${phone.substring(phone.length - 4)}`;
}
```

---

### `src/common/utils/cursor.util.ts`

```typescript
export function sliceCursorResults<T>(
  rows: T[],
  limit: number,
): { items: T[]; hasNextPage: boolean } {
  const hasNextPage = rows.length > limit;
  const items = hasNextPage ? rows.slice(0, limit) : rows;
  return { items, hasNextPage };
}
```

---

### `src/common/utils/index.ts`

```typescript
export * from './password.util';
export * from './string.util';
export * from './cursor.util';
```

---

### `src/modules/auth/dto/jwt-payload.dto.ts`

```typescript
export interface JwtPayload {
  sub: string;   // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
```

---

### `src/modules/auth/jwt.strategy.ts`

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Return value is set as req.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

---

### `src/modules/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

/**
 * AuthModule — registers JwtStrategy for passport.
 * Add your AuthController, AuthService, register/login endpoints here.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
        },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
```

---

### `src/modules/test/dto/test-response.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class TestResponseDto {
  @ApiProperty({ example: 'Hello World' })
  message!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp!: string;
}
```

---

### `src/modules/test/dto/index.ts`

```typescript
export * from './test-response.dto';
```

---

### `src/modules/test/test.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { TestResponseDto } from './dto';

@Injectable()
export class TestService {
  getHello(): TestResponseDto {
    return {
      message: 'Hello World',
      timestamp: new Date().toISOString(),
    };
  }

  getProtectedMessage(userId: string): TestResponseDto {
    return {
      message: `Hello, authenticated user ${userId}!`,
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

### `src/modules/test/test.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TestService } from './test.service';
import { TestResponseDto } from './dto';
import { Public, CurrentUser, ApiWrappedResponse } from '@common/decorators';
import { CurrentUserData } from '@common/decorators/current-user.decorator';

@ApiTags('test')
@Controller({ path: 'test', version: '1' })
export class TestController {
  constructor(private readonly testService: TestService) {}

  /**
   * Public endpoint — no auth required
   * Response: { success: true, message: '...', meta: {...}, data: TestResponseDto }
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Public hello world' })
  @ApiWrappedResponse(TestResponseDto)
  getHello() {
    const result = this.testService.getHello();
    return { message: 'Hello World', data: result };
  }

  /**
   * Protected endpoint — requires Bearer token
   */
  @Get('protected')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected endpoint (requires JWT)' })
  @ApiWrappedResponse(TestResponseDto)
  getProtected(@CurrentUser() user: CurrentUserData) {
    const result = this.testService.getProtectedMessage(user.id);
    return { message: 'Authenticated successfully', data: result };
  }
}
```

---

### `src/modules/test/test.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
```

---

## Yeni Modül Ekleme Pattern

Aşağıdaki adımları izle (DB işlemi olan modül örneği):

### 1. Entity

```typescript
// src/modules/posts/entities/post.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/base';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId!: string;
}
```

### 2. Repository

```typescript
// src/modules/posts/post.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/base';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostRepository extends BaseRepository<PostEntity> {
  constructor(@InjectRepository(PostEntity) repo: Repository<PostEntity>) {
    super(repo);
  }
  // Add custom query methods here
}
```

### 3. Service

```typescript
// src/modules/posts/post.service.ts
import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CursorPaginationDto } from '@common/dto';
import { CursorPaginationResponseDto } from '@common/dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async list(dto: CursorPaginationDto): Promise<CursorPaginationResponseDto<PostEntity>> {
    return this.postRepository.findWithCursorPagination(dto);
  }

  async create(userId: string, title: string, content: string): Promise<PostEntity> {
    return this.postRepository.create({ userId, title, content, createdBy: userId });
  }

  async findById(id: string): Promise<PostEntity> {
    return this.postRepository.findByIdOrFail(id);
  }
}
```

### 4. Controller

```typescript
// src/modules/posts/post.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CurrentUser, ApiCursorPaginatedResponse, ApiWrappedCreatedResponse } from '@common/decorators';
import { CurrentUserData } from '@common/decorators/current-user.decorator';
import { CursorPaginationDto } from '@common/dto';
import { PostResponseDto } from './dto/post-response.dto';

@ApiTags('posts')
@ApiBearerAuth()
@Controller({ path: 'posts', version: '1' })
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiCursorPaginatedResponse(PostResponseDto)
  async list(@Query() dto: CursorPaginationDto) {
    const result = await this.postService.list(dto);
    return { message: 'Posts listed', ...result };
  }

  @Post()
  @ApiWrappedCreatedResponse(PostResponseDto)
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() body: { title: string; content: string },
  ) {
    const post = await this.postService.create(user.id, body.title, body.content);
    return { message: 'Post created', data: post };
  }
}
```

### 5. Module

```typescript
// src/modules/posts/post.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  providers: [PostRepository, PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
```

### 6. app.module.ts'e ekle

```typescript
import { PostModule } from '@modules/posts/post.module';
// imports dizisine ekle:
PostModule,
```

---

## Doğrulama (Verification)

```bash
# 1. Tüm dosyalar oluşturulduktan sonra
pnpm install

# 2. .env dosyasını oluştur (.env.example'dan)
cp .env.example .env
# DB_HOST, DB_USERNAME, DB_DATABASE, REDIS_HOST, JWT_SECRET,
# JWT_REFRESH_SECRET, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, MAIL_FROM
# değerlerini doldur. Diğerleri default değerle çalışır.

# 3. Build — sıfır hata beklenir
pnpm build

# 4. Başlat
pnpm start:dev

# 5. Test et
curl http://localhost:3000/health
# → { "status": "ok", "info": { "database": { "status": "up" } } }

curl http://localhost:3000/api/v1/test
# → { "success": true, "message": "Hello World", "meta": {...}, "data": { "message": "Hello World", "timestamp": "..." } }

# 6. Docs
open http://localhost:3000/api/docs/swagger
open http://localhost:3000/api/docs/scalar
```

---

## Önemli Notlar

1. **uuid paketi v9**: `v7 as uuidv7` — `uuid@9` veya üstü gerekli
2. **TypeOrmPinoLogger path**: `src/common/loggers/typeorm-pino.logger.ts` — `@common/loggers/typeorm-pino.logger` olarak import et
3. **pino-pretty**: dev'de güzel log, prod'da `pino/file` hedefine yaz
4. **Cursor pagination cursor'u**: UUID v7 id'dir — string karşılaştırma (`<`) ile sıralı çalışır çünkü UUID v7 lexicographically sıralıdır
5. **TransformInterceptor**: Controller `{ message, data }` döndürürse tekil; `{ message, ...cursorResult }` döndürürse paginated olarak sarar
6. **Global guards**: JwtAuthGuard + RolesGuard her route'u kapsar; `@Public()` ile bypass et
7. **Migration**: `synchronize: false` prod'da — migration kullan
8. **Config schema**: Joi validation — yanlış env değeri uygulamayı başlatmaz
