import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@common/base/base.entity';

@Entity('system_settings')
@Index('UQ_system_settings_client_key', ['clientId', 'key'], { unique: true })
export class SystemSetting extends BaseEntity {
  @Column({ name: 'client_id', type: 'varchar', length: 36, nullable: true })
  clientId!: string | null;

  @Column({ name: 'key', type: 'varchar', length: 100 })
  key!: string;

  @Column({ name: 'value', type: 'text' })
  value!: string;
}
