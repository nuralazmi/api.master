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
