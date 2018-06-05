import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWordsTable1528168714364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'Words',
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
            name: 'stem',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'length',
            type: 'smallint',
            width: 6,
            unsigned: true,
            default: 0,
            isNullable: false,
          },
          {
            name: 'numeric',
            type: 'tinyint',
            width: 1,
            unsigned: true,
            default: 0,
            isNullable: true,
          },
          {
            name: 'acronym',
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
            name: 'words-name',
            columnNames: [ 'name' ],
          },
          {
            name: 'words-stem',
            columnNames: [ 'stem' ],
          },
        ],
        uniques: [
          {
            name: 'words-slug-unique',
            columnNames: [ 'slug' ],
          },
        ],
        foreignKeys: [
          {
            name: 'words-users-created-by-id',
            columnNames: [ 'createdById' ],
            referencedTableName: 'Users',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
          {
            name: 'words-users-last-updated-by-id',
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
    // await queryRunner.dropForeignKey('Words', 'users-created-by-id');
    // await queryRunner.dropForeignKey('Words', 'users-last-updated-by-id');
    // await queryRunner.dropTable('Words');
  }
}
