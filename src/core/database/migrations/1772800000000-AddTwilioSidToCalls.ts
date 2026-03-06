import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTwilioSidToCalls1772800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'calls',
      new TableColumn({
        name: 'twilio_sid',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('calls', 'twilio_sid');
  }
}
