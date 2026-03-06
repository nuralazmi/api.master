import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TenantBaseRepository } from '@common/base';
import { ClientContextService } from '@core/cls/client-context.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends TenantBaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    clientContext: ClientContextService,
  ) {
    super(userRepo, clientContext);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.findOne({ phone } as never);
  }

  async rawDecrementCredit(userId: string): Promise<void> {
    await this.userRepo.decrement(
      { id: userId, clientId: this.clientId } as FindOptionsWhere<User>,
      'credit',
      1,
    );
  }
}
