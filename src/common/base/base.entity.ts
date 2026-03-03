import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BeforeInsert,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

/**
 * Base Entity — extend this in all entities.
 * Provides: UUID v7 id, createdAt, updatedAt, deletedAt (soft delete), audit fields.
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 6,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: 6,
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  deletedAt?: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;
}
