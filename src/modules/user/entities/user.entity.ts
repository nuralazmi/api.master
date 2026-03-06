import { Column, Entity, Index } from 'typeorm';
import { TenantBaseEntity } from '@common/base';
import { UserRole } from '@common/constants/user-roles.enum';

@Index(['clientId', 'phone'], { unique: true, where: '"phone" IS NOT NULL' })
@Entity('users')
export class User extends TenantBaseEntity {
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'int', default: 1 })
  credit!: number;
}
