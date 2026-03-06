import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClsService } from 'nestjs-cls';
import { UserService } from '@modules/user/user.service';
import { Call, CallStatus } from './entities/call.entity';
import { CallsRepository } from './calls.repository';
import { TwilioService } from '@core/twilio/twilio.service';

@Injectable()
export class CallsScheduler {
  private readonly logger = new Logger(CallsScheduler.name);

  constructor(
    private readonly callsRepository: CallsRepository,
    private readonly userService: UserService,
    private readonly cls: ClsService,
    private readonly twilioService: TwilioService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async processDueCalls(): Promise<void> {
    const dueCalls = await this.callsRepository.findDueCalls();

    if (dueCalls.length === 0) return;

    this.logger.log(`Processing ${dueCalls.length} due call(s)`);

    for (const call of dueCalls) {
      await this.cls.run(async () => {
        this.cls.set('clientId', call.clientId);

        await this.callsRepository.rawUpdate(call.id, { status: CallStatus.IN_PROGRESS });

        try {
          const result = await this.twilioService.makeCall(call.phone, {
            notes: call.notes ?? undefined,
          });
          this.logger.log(`Call ${call.id} initiated — Twilio SID: ${result.sid}`);

          await this.callsRepository.rawUpdate(call.id, {
            status: CallStatus.COMPLETED,
            calledAt: new Date(),
            twilioSid: result.sid,
          } as Partial<Call>);
          await this.userService.decrementCredit(call.userId);
        } catch (err) {
          const failureReason = err instanceof Error ? err.message : 'Unknown error';

          this.logger.error(`Call ${call.id} failed: ${failureReason}`);

          await this.callsRepository.rawUpdate(call.id, {
            status: CallStatus.FAILED,
            failureReason,
          } as Partial<Call>);
        }
      });
    }
  }
}
