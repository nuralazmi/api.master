import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCallsTable1772543232370 implements MigrationInterface {
    name = 'CreateCallsTable1772543232370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_users_client_id\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_users_client_id_email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`UQ_users_client_id_phone\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_clients_deleted_at\` ON \`clients\``);
        await queryRunner.query(`DROP INDEX \`IDX_clients_is_active\` ON \`clients\``);
        await queryRunner.query(`DROP INDEX \`IDX_clients_slug\` ON \`clients\``);
        await queryRunner.query(`CREATE TABLE \`calls\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`created_by\` varchar(255) NULL, \`updated_by\` varchar(255) NULL, \`client_id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`phone\` varchar(20) NOT NULL, \`scheduled_at\` datetime NOT NULL, \`timezone\` varchar(100) NOT NULL, \`status\` enum ('pending', 'in_progress', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'pending', \`notes\` text NULL, \`called_at\` datetime NULL, \`failure_reason\` varchar(500) NULL, INDEX \`IDX_c1b69c83c5976d6003939b97ba\` (\`client_id\`), INDEX \`IDX_7146f176cd19ce91ef14fa699a\` (\`client_id\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_by\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`created_by\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_by\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updated_by\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`created_by\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`created_by\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`updated_by\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`updated_by\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD UNIQUE INDEX \`IDX_2a850b0972b11500683fe49b3c\` (\`slug\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_0d1e90d75674c54f8660c4ed44\` ON \`users\` (\`client_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_cc6e1e6bd9cbf7545911626554\` ON \`users\` (\`client_id\`, \`phone\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_cc6e1e6bd9cbf7545911626554\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_0d1e90d75674c54f8660c4ed44\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP INDEX \`IDX_2a850b0972b11500683fe49b3c\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`updated_by\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`updated_by\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`created_by\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`created_by\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updated_by\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updated_by\` varchar(36) COLLATE "utf8mb4_unicode_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_by\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`created_by\` varchar(36) COLLATE "utf8mb4_unicode_ci" NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_7146f176cd19ce91ef14fa699a\` ON \`calls\``);
        await queryRunner.query(`DROP INDEX \`IDX_c1b69c83c5976d6003939b97ba\` ON \`calls\``);
        await queryRunner.query(`DROP TABLE \`calls\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_clients_slug\` ON \`clients\` (\`slug\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_clients_is_active\` ON \`clients\` (\`is_active\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_clients_deleted_at\` ON \`clients\` (\`deleted_at\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_users_client_id_phone\` ON \`users\` (\`client_id\`, \`phone\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_users_client_id_email\` ON \`users\` (\`client_id\`, \`email\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_users_client_id\` ON \`users\` (\`client_id\`)`);
    }

}
