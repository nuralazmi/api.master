import { MigrationInterface, QueryRunner } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class SeedDefaultClient1768200000010 implements MigrationInterface {
  name = 'SeedDefaultClient1768200000010';

  async up(queryRunner: QueryRunner): Promise<void> {
    const id = uuidv7();
    await queryRunner.query(
      `INSERT INTO clients (id, name, slug, is_active, created_at, updated_at)
       VALUES (?, 'Default Client', 'default', 1, NOW(6), NOW(6))`,
      [id],
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM clients WHERE slug = 'default'`);
  }
}
