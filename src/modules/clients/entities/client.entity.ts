import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/base/base.entity';

/**
 * Client entity — represents a tenant/client application.
 * This table is the global registry and does NOT extend TenantBaseEntity.
 */
@Entity('clients')
export class Client extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'feature_flags', type: 'json', nullable: true })
  featureFlags?: Record<string, unknown>;

  @Column({ name: 'api_key_hash', type: 'varchar', length: 255, nullable: true })
  apiKeyHash?: string;
}
