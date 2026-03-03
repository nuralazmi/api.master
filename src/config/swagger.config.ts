import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  enabled: process.env.NODE_ENV !== 'production',
  title: 'MyApp API',
  description: 'Professional NestJS REST API Documentation',
  version: '1.0',
  path: 'api/docs',
}));
