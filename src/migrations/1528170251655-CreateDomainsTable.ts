import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDomainsTable1528170251655 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'Domains',
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
            name: 'private',
            type: 'tinyint',
            width: 1,
            unsigned: true,
            default: 0,
            isNullable: true,
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
            name: 'domains-name',
            columnNames: [ 'name' ],
          },
        ],
        uniques: [
          {
            name: 'domains-slug-unique',
            columnNames: [ 'slug' ],
          },
        ],
        foreignKeys: [
          {
            name: 'domains-users-created-by-id',
            columnNames: [ 'createdById' ],
            referencedTableName: 'Users',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
          {
            name: 'domains-users-last-updated-by-id',
            columnNames: [ 'lastUpdatedById' ],
            referencedTableName: 'Users',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.dropForeignKey('Domains', 'users-created-by-id');
    // await queryRunner.dropForeignKey('Domains', 'users-last-updated-by-id');
    // await queryRunner.dropTable('Domains');
  }
}
