import { Column, Entity, Index } from 'typeorm';
import { TenantBaseEntity } from '@common/base';

export enum CallStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Index(['clientId', 'userId'])
@Entity('calls')
export class Call extends TenantBaseEntity {
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ name: 'scheduled_at', type: 'datetime' })
  scheduledAt!: Date;

  @Column({ type: 'varchar', length: 100 })
  timezone!: string;

  @Column({
    type: 'enum',
    enum: CallStatus,
    default: CallStatus.PENDING,
  })
  status!: CallStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'called_at', type: 'datetime', nullable: true })
  calledAt?: Date;

  @Column({ name: 'failure_reason', type: 'varchar', length: 500, nullable: true })
  failureReason?: string;

  @Column({ name: 'twilio_sid', type: 'varchar', length: 50, nullable: true })
  twilioSid?: string;
}
