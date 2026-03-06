import { registerAs } from '@nestjs/config';

export default registerAs('twilio', () => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  statusCallbackUrl: process.env.TWILIO_STATUS_CALLBACK_URL,
  verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
}));
