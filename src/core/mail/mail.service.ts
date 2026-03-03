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
