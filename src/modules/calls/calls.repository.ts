import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThanOrEqual, Repository } from 'typeorm';
import { TenantBaseRepository } from '@common/base';
import { ClientContextService } from '@core/cls/client-context.service';
import { Call, CallStatus } from './entities/call.entity';

@Injectable()
export class CallsRepository extends TenantBaseRepository<Call> {
  constructor(
    @InjectRepository(Call)
    private readonly callRepo: Repository<Call>,
    clientContext: ClientContextService,
  ) {
    super(callRepo, clientContext);
  }

  /**
   * Finds all PENDING calls whose scheduledAt has passed.
   * Uses raw repository to bypass CLS (scheduler has no HTTP context).
   * Intentionally unscoped — scheduler must process all tenants' calls.
   */
  async findDueCalls(): Promise<Call[]> {
    return this.callRepo.find({
      where: {
        status: CallStatus.PENDING,
        scheduledAt: LessThanOrEqual(new Date()),
      },
    });
  }

  /**
   * Update by id — scoped to current tenant via CLS context.
   * Scheduler sets CLS context per-call before invoking this.
   */
  async rawUpdate(id: string, data: Partial<Call>): Promise<void> {
    await this.callRepo.update(
      { id, clientId: this.clientId } as FindOptionsWhere<Call>,
      data as never,
    );
  }
}
