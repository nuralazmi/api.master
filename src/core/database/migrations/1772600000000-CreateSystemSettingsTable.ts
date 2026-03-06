import { MigrationInterface, QueryRunner } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class CreateSystemSettingsTable1772600000000 implements MigrationInterface {
  name = 'CreateSystemSettingsTable1772600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`system_settings\` (
        \`id\`          VARCHAR(36)   NOT NULL,
        \`client_id\`   VARCHAR(36)   NULL,
        \`key\`         VARCHAR(100)  NOT NULL,
        \`value\`       TEXT          NOT NULL,
        \`created_at\`  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\`  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\`  DATETIME(6)   NULL,
        \`created_by\`  VARCHAR(36)   NULL,
        \`updated_by\`  VARCHAR(36)   NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`UQ_system_settings_client_key\` (\`client_id\`, \`key\`),
        INDEX \`IDX_system_settings_client_id\` (\`client_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Seed global default
    await queryRunner.query(
      `INSERT INTO \`system_settings\` (\`id\`, \`client_id\`, \`key\`, \`value\`) VALUES (?, NULL, 'system_number', '1')`,
      [uuidv7()],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`system_settings\``);
  }
}
