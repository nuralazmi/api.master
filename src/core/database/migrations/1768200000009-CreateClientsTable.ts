import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateClientsTable1768200000009 implements MigrationInterface {
  name = 'CreateClientsTable1768200000009';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clients',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '100',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'is_active',
            type: 'tinyint',
            width: 1,
            isNullable: false,
            default: 1,
          },
          {
            name: 'feature_flags',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'api_key_hash',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            precision: 6,
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            precision: 6,
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            precision: 6,
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
        ],
        indices: [
          new TableIndex({
            name: 'IDX_clients_slug',
            columnNames: ['slug'],
            isUnique: true,
          }),
          new TableIndex({
            name: 'IDX_clients_is_active',
            columnNames: ['is_active'],
          }),
          new TableIndex({
            name: 'IDX_clients_deleted_at',
            columnNames: ['deleted_at'],
          }),
        ],
        engine: 'InnoDB',
      }),
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clients', true);
  }
}
