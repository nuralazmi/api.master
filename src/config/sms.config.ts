import { registerAs } from '@nestjs/config';

export default registerAs('sms', () => ({
  provider: process.env.SMS_PROVIDER,
  apiKey: process.env.SMS_API_KEY,
  secret: process.env.SMS_SECRET,
  sender: process.env.SMS_SENDER,
}));
