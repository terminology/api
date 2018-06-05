import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTermsTable1528169591773 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'Terms',
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
            name: 'terms-name',
            columnNames: [ 'name' ],
          },
        ],
        uniques: [
          {
            name: 'terms-slug-unique',
            columnNames: [ 'slug' ],
          },
        ],
        foreignKeys: [
          {
            name: 'terms-users-created-by-id',
            columnNames: [ 'createdById' ],
            referencedTableName: 'Users',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
          {
            name: 'terms-users-last-updated-by-id',
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
    // await queryRunner.dropForeignKey('Terms', 'users-created-by-id');
    // await queryRunner.dropForeignKey('Terms', 'users-last-updated-by-id');
    // await queryRunner.dropTable('Terms');
  }
}
