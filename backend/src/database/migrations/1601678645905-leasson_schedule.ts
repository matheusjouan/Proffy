import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class leassonSchedule1601678645905
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'leasson_schedule',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'leasson_id',
            type: 'uuid',
          },
          {
            name: 'week_day',
            type: 'int',
          },
          {
            name: 'from',
            type: 'int',
          },
          {
            name: 'to',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'LeassonSchedule',
            columnNames: ['leasson_id'],
            referencedTableName: 'leassons',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('leasson_schedule');
  }
}
