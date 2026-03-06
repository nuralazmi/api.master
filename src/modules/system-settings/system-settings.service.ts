import { Injectable } from '@nestjs/common';
import { BusinessException } from '@common/exceptions';
import { ErrorCode } from '@common/constants/error-codes.enum';
import { SystemSettingsRepository } from './system-settings.repository';
import { SystemSetting } from './entities/system-setting.entity';

@Injectable()
export class SystemSettingsService {
  constructor(private readonly repository: SystemSettingsRepository) {}

  async findAll(): Promise<SystemSetting[]> {
    return this.repository.findAllForClient();
  }

  async findByKey(key: string): Promise<SystemSetting> {
    const setting = await this.repository.findByKeyForClient(key);
    if (!setting) {
      throw new BusinessException('Setting not found', ErrorCode.SETTING_NOT_FOUND);
    }
    return setting;
  }

  async upsert(key: string, value: string): Promise<SystemSetting> {
    return this.repository.upsertForClient(key, value);
  }
}
