import { Injectable } from '@nestjs/common';
import { BusinessException } from '@common/exceptions';
import { ErrorCode } from '@common/constants';
import { UserRole } from '@common/constants/user-roles.enum';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

export interface CreateUserData {
  phone?: string;
  email?: string;
  passwordHash: string;
  role?: UserRole;
  isVerified?: boolean;
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findByPhone(phone);
  }

  async create(data: CreateUserData): Promise<User> {
    return this.userRepository.create({
      ...data,
      role: data.role ?? UserRole.USER,
      isVerified: data.isVerified ?? false,
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.userRepository.update(id, { passwordHash });
  }

  async checkCreditOrFail(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.credit <= 0) {
      throw new BusinessException(
        'You have no credits left. Please purchase more to schedule calls.',
        ErrorCode.INSUFFICIENT_CREDITS,
      );
    }
  }

  async getCredit(userId: string): Promise<{ credit: number }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessException('User not found', ErrorCode.NOT_FOUND);
    }
    return { credit: user.credit };
  }

  async decrementCredit(userId: string): Promise<void> {
    await this.userRepository.rawDecrementCredit(userId);
  }
}
