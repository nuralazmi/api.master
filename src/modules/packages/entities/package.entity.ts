import { Entity, Column } from 'typeorm';
import { TenantBaseEntity } from '@common/base/tenant-base.entity';

@Entity('packages')
export class Package extends TenantBaseEntity {
  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;
}
