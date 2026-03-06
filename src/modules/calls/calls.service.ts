import { ForbiddenException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { BusinessException } from '@common/exceptions';
import { ErrorCode } from '@common/constants';
import { CursorPaginationResponseDto } from '@common/dto/cursor-pagination-response.dto';
import { ListCallsDto } from './dto/list-calls.dto';
import { UserService } from '@modules/user/user.service';
import { Call, CallStatus } from './entities/call.entity';
import { CallsRepository } from './calls.repository';
import { CreateCallDto } from './dto/create-call.dto';

@Injectable()
export class CallsService {
  constructor(
    private readonly callsRepository: CallsRepository,
    private readonly userService: UserService,
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
}
