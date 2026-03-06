import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import { BusinessException } from '@common/exceptions';
import { ErrorCode } from '@common/constants';
import { CursorPaginationResponseDto } from '@common/dto/cursor-pagination-response.dto';
import { TwilioService } from '@core/twilio/twilio.service';
import { ListCallsDto } from './dto/list-calls.dto';
import { UserService } from '@modules/user/user.service';
import { Call, CallStatus } from './entities/call.entity';
import { CallsRepository } from './calls.repository';
import { CreateCallDto } from './dto/create-call.dto';

@Injectable()
export class CallsService {
  private readonly logger = new Logger(CallsService.name);

  constructor(
    private readonly callsRepository: CallsRepository,
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
  ) {}

  async schedule(userId: string, dto: CreateCallDto): Promise<Call> {
    const dt = DateTime.fromISO(dto.scheduledAt, { zone: dto.timezone });

    if (!dt.isValid) {
      throw new BusinessException(
        `Invalid scheduledAt/timezone combination: ${dt.invalidReason}`,
        ErrorCode.INVALID_SCHEDULED_TIME,
      );
    }

    const scheduledAtUtc = dt.toUTC().toJSDate();
    if (scheduledAtUtc <= new Date()) {
      throw new BusinessException(
        'Scheduled time must be in the future',
        ErrorCode.INVALID_SCHEDULED_TIME,
      );
    }

    await this.userService.checkCreditOrFail(userId);

    const user = await this.userService.findById(userId);
    if (!user?.phone) {
      throw new BusinessException(
        'Your profile does not have a phone number. Please add one before scheduling a call.',
        ErrorCode.USER_PHONE_MISSING,
      );
    }

    return this.callsRepository.create({
      userId,
      phone: user.phone,
      scheduledAt: scheduledAtUtc,
      timezone: dto.timezone,
      notes: dto.notes,
      status: CallStatus.PENDING,
    });
  }

  async list(
    userId: string,
    dto: ListCallsDto,
  ): Promise<CursorPaginationResponseDto<Call>> {
    const where: Record<string, unknown> = { userId };
    if (dto.status) where.status = dto.status;
    return this.callsRepository.findWithCursorPagination(dto, {
      where: where as never,
    });
  }

  async cancel(userId: string, callId: string): Promise<void> {
    const call = await this.callsRepository.findByIdOrFail(callId);

    if (call.userId !== userId) {
      throw new ForbiddenException('You are not allowed to cancel this call');
    }

    if (call.status !== CallStatus.PENDING) {
      throw new BusinessException(
        'Only pending calls can be cancelled',
        ErrorCode.CALL_ALREADY_PROCESSED,
      );
    }

    await this.callsRepository.update(callId, { status: CallStatus.CANCELLED });
  }

  async triggerTestCall(phone: string): Promise<{ sid: string }> {
    this.logger.log(`Triggering test call to ${phone}`);
    return this.twilioService.makeCall(phone);
  }

  handleTwilioWebhook(callSid: string, twilioStatus: string): void {
    this.callsRepository
      .findByTwilioSid(callSid)
      .then((call) => {
        if (!call) {
          this.logger.warn(`Twilio webhook: no call found for SID ${callSid}`);
          return;
        }

        const statusMap: Record<string, CallStatus> = {
          completed: CallStatus.COMPLETED,
          busy: CallStatus.FAILED,
          'no-answer': CallStatus.FAILED,
          failed: CallStatus.FAILED,
        };

        const mappedStatus = statusMap[twilioStatus];
        if (!mappedStatus) return;

        const updateData: Partial<Call> = { status: mappedStatus };
        if (mappedStatus === CallStatus.FAILED) {
          updateData.failureReason = `Twilio status: ${twilioStatus}`;
        }

        return this.callsRepository.rawUpdateUnscoped(call.id, call.clientId, updateData);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        this.logger.error(`Twilio webhook processing failed: ${msg}`);
      });
  }
}
