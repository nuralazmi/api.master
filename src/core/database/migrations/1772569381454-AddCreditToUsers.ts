import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreditToUsers1772569381454 implements MigrationInterface {
    name = 'AddCreditToUsers1772569381454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`credit\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`credit\``);
    }

}
