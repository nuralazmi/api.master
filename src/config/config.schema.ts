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
