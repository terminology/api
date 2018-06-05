import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateConnectionsTable1528169948575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'Connections',
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
            name: 'termId',
            type: 'int',
            width: 10,
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'usageId',
            type: 'int',
            width: 10,
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'weight',
            type: 'smallint',
            width: 6,
            unsigned: true,
            default: 0,
            isNullable: false,
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
        ],
        foreignKeys: [
          {
            name: 'connections-users-created-by-id',
            columnNames: [ 'createdById' ],
            referencedTableName: 'Users',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
          {
            name: 'connections-users-last-updated-by-id',
            columnNames: [ 'lastUpdatedById' ],
            referencedTableName: 'Users',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
          {
            name: 'connections-term-id',
            columnNames: [ 'termId' ],
            referencedTableName: 'Terms',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
          {
            name: 'connections-usage-id',
            columnNames: [ 'usageId' ],
            referencedTableName: 'Usages',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.dropForeignKey('Connections', 'users-created-by-id');
    // await queryRunner.dropForeignKey('Connections', 'users-last-updated-by-id');
    // await queryRunner.dropTable('Connections');
  }
}
