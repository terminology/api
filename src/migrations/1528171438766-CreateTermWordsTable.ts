import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTermWordsTable1528171438766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'TermWords',
        columns: [
          {
            name: 'termId',
            type: 'int',
            width: 10,
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'wordId',
            type: 'int',
            width: 10,
            unsigned: true,
            isNullable: true,
          },
        ],
        uniques: [
          {
            name: 'terms-words-unique',
            columnNames: [ 'termId', 'wordId' ],
          }
        ],
        foreignKeys: [
          {
            name: 'term-words-term-id',
            columnNames: [ 'termId' ],
            referencedTableName: 'Terms',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
          {
            name: 'term-words-word-id',
            columnNames: [ 'wordId' ],
            referencedTableName: 'Words',
            referencedColumnNames: [ 'id' ],
            onDelete: 'RESTRICT',
          },
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.dropForeignKey('TermWords', 'users-created-by-id');
    // await queryRunner.dropForeignKey('TermWords', 'users-last-updated-by-id');
    // await queryRunner.dropTable('TermWords');
  }
}
