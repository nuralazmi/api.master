import { Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * TenantBaseEntity — extend this in all tenant-scoped entities.
 * Adds `clientId` column for row-level multi-tenancy.
 * Never pass clientId manually — it's injected by TenantBaseRepository from CLS.
 */
export abstract class TenantBaseEntity extends BaseEntity {
  @Index()
  @Column({ name: 'client_id', type: 'varchar', length: 36 })
  clientId!: string;
}
