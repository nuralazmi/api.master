import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { BusinessException } from '@common/exceptions';
import { ErrorCode } from '@common/constants';
import { getLanguageFromPhone } from '@common/utils';
import { getCallMessage } from './twiml-messages';

@Injectable()
export class TwilioService {
  private client: Twilio | null = null;
  private readonly logger = new Logger(TwilioService.name);

  constructor(private readonly configService: ConfigService) {
    const sid = this.configService.get<string>('twilio.accountSid');
    const token = this.configService.get<string>('twilio.authToken');

    if (sid && token) {
      this.client = new Twilio(sid, token);
      this.logger.log('Twilio client initialized');
    } else {
      this.logger.warn('Twilio credentials not configured — calls/SMS will be mocked');
    }
  }

  async makeCall(
    to: string,
    options?: { language?: string; notes?: string },
  ): Promise<{ sid: string }> {
    const { language: langOverride, notes } = options ?? {};
    const { language, voice } = langOverride
      ? { language: langOverride, voice: getLanguageFromPhone(to).voice }
      : getLanguageFromPhone(to);

    const message = getCallMessage(language);
    const fullMessage = notes ? `${message} ${notes}` : message;

    const twiml = [
      '<Response>',
      `<Say language="${language}" voice="${voice}">${this.escapeXml(fullMessage)}</Say>`,
      '<Pause length="1"/>',
      `<Say language="${language}" voice="${voice}">${this.escapeXml(fullMessage)}</Say>`,
      '<Hangup/>',
      '</Response>',
    ].join('');

    if (!this.client) {
      this.logger.log(`[MOCK] Would call ${to} — language=${language}, voice=${voice}`);
      return { sid: 'mock-sid' };
    }

    const from = this.configService.get<string>('twilio.phoneNumber');
    const statusCallbackUrl = this.configService.get<string>('twilio.statusCallbackUrl');

    const call = await this.client.calls.create({
      to,
      from: from!,
      twiml,
      timeout: 20,
      timeLimit: 10,
      ...(statusCallbackUrl && {
        statusCallback: statusCallbackUrl,
        statusCallbackEvent: ['completed', 'busy', 'no-answer', 'failed'],
      }),
    });

    return { sid: call.sid };
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  async sendSms(to: string, body: string): Promise<{ sid: string }> {
    if (!this.client) {
      this.logger.log(`[MOCK] SMS to ${to}: ${body}`);
      return { sid: 'mock-sms-sid' };
    }

    const from = this.configService.get<string>('twilio.phoneNumber');
    const message = await this.client.messages.create({ to, from: from!, body });
    return { sid: message.sid };
  }

  async sendOtp(to: string): Promise<{ sid: string }> {
    if (!this.client) {
      this.logger.log(`[MOCK] OTP verification to ${to}`);
      return { sid: 'mock-verify-sid' };
    }

    const serviceSid = this.configService.get<string>('twilio.verifyServiceSid');
    if (!serviceSid) {
      this.logger.warn('TWILIO_VERIFY_SERVICE_SID not configured, falling back to mock');
      return { sid: 'mock-verify-sid' };
    }

    const verification = await this.client.verify.v2
      .services(serviceSid)
      .verifications.create({ to, channel: 'sms' });
    return { sid: verification.sid };
  }

  async checkOtp(to: string, code: string): Promise<{ valid: boolean }> {
    if (!this.client) {
      this.logger.log(`[MOCK] OTP check for ${to}: ${code}`);
      return { valid: true };
    }

    const serviceSid = this.configService.get<string>('twilio.verifyServiceSid');
    if (!serviceSid) {
      this.logger.warn('TWILIO_VERIFY_SERVICE_SID not configured, falling back to mock');
      return { valid: true };
    }

    try {
      const check = await this.client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to, code });
      return { valid: check.status === 'approved' };
    } catch (error: unknown) {
      const statusCode = (error as { status?: number }).status;
      if (statusCode === 404) {
        throw new BusinessException('OTP expired or not sent', ErrorCode.INVALID_CODE);
      }
      throw error;
    }
  }
}
