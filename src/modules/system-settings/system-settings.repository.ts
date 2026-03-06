import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/base/base.repository';
import { ClientContextService } from '@core/cls/client-context.service';
import { SystemSetting } from './entities/system-setting.entity';

@Injectable()
export class SystemSettingsRepository extends BaseRepository<SystemSetting> {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingRepo: Repository<SystemSetting>,
    private readonly clientContext: ClientContextService,
  ) {
    super(settingRepo);
  }

  private get clientId(): string {
    return this.clientContext.getClientId();
  }

  async findAllForClient(): Promise<SystemSetting[]> {
    const rows = await this.settingRepo.find({
      where: [
        { clientId: this.clientId },
        { clientId: null as unknown as string },
      ],
      order: { key: 'ASC' },
    });

    // Deduplicate: client-specific overrides global
    const map = new Map<string, SystemSetting>();
    for (const row of rows) {
      const existing = map.get(row.key);
      if (!existing || (existing.clientId === null && row.clientId !== null)) {
        map.set(row.key, row);
      }
    }

    return Array.from(map.values());
  }

  async findByKeyForClient(key: string): Promise<SystemSetting | null> {
    // Try client-specific first
    const clientSetting = await this.settingRepo.findOne({
      where: { clientId: this.clientId, key },
    });
    if (clientSetting) return clientSetting;

    // Fallback to global
    return this.settingRepo.findOne({
      where: { clientId: null as unknown as string, key },
    });
  }

  async upsertForClient(key: string, value: string): Promise<SystemSetting> {
    const existing = await this.settingRepo.findOne({
      where: { clientId: this.clientId, key },
    });

    if (existing) {
      existing.value = value;
      return this.settingRepo.save(existing);
    }

    return this.create({ clientId: this.clientId, key, value });
  }
}
