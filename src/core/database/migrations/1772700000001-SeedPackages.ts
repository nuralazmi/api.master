import { MigrationInterface, QueryRunner } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class SeedPackages1772700000001 implements MigrationInterface {
  name = 'SeedPackages1772700000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    const clientId = '019cb3aa-119e-70d9-bcd0-1368ac6d79ec';

    const packages = [
      {
        id: uuidv7(),
        title: 'Basic Package',
        description: 'Access to basic features and content.',
        price: '9.99',
      },
      {
        id: uuidv7(),
        title: 'Premium Package',
        description: 'Full access to all premium features and exclusive content.',
        price: '19.99',
      },
      {
        id: uuidv7(),
        title: 'Enterprise Package',
        description: 'Unlimited access with priority support and custom integrations.',
        price: '49.99',
      },
    ];

    for (const pkg of packages) {
      await queryRunner.query(
        `INSERT INTO packages (id, client_id, title, description, price, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(6), NOW(6))`,
        [pkg.id, clientId, pkg.title, pkg.description, pkg.price],
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const clientId = '019cb3aa-119e-70d9-bcd0-1368ac6d79ec';
    await queryRunner.query(`DELETE FROM packages WHERE client_id = ?`, [clientId]);
  }
}
