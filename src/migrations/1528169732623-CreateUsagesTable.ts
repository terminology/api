import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsagesTable1528169732623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'Usages',
        columns: [
          {
            name: 'id',
            type: 'int',
            width: 10,
            unsigned: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'summary',
            type: 'tinytext',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'createdById',
            type: 'int',
            width: 10,
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'lastUpdatedAt',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'lastUpdatedById',
            type: 'int',
            width: 10,
            unsigned: true,
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'usage-name',
            columnNames: [ 'name' ],
          },
        ],
        foreignKeys: [
          {
            name: 'usage-users-created-by-id',
            columnNames: [ 'createdById' ],
            referencedTableName: 'Users',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
          {
            name: 'usage-users-last-updated-by-id',
            columnNames: [ 'lastUpdatedById' ],
            referencedTableName: 'Users',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          }
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.dropForeignKey('Usages', 'users-created-by-id');
    // await queryRunner.dropForeignKey('Usages', 'users-last-updated-by-id');
    // await queryRunner.dropTable('Usages');
  }
}
