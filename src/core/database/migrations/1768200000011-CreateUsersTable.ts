import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1768200000011 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\`            VARCHAR(36)   NOT NULL,
        \`client_id\`     VARCHAR(36)   NOT NULL,
        \`phone\`         VARCHAR(20)   NULL,
        \`email\`         VARCHAR(255)  NULL,
        \`password_hash\` VARCHAR(255)  NOT NULL,
        \`role\`          ENUM('user', 'admin', 'moderator') NOT NULL DEFAULT 'user',
        \`is_verified\`   TINYINT(1)   NOT NULL DEFAULT 0,
        \`created_at\`    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\`    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\`    DATETIME(6)   NULL,
        \`created_by\`    VARCHAR(36)   NULL,
        \`updated_by\`    VARCHAR(36)   NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_users_client_id\` (\`client_id\`),
        INDEX \`IDX_users_client_id_email\` (\`client_id\`, \`email\`),
        UNIQUE INDEX \`UQ_users_client_id_phone\` (\`client_id\`, \`phone\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
