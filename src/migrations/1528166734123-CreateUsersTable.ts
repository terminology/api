import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1528166734123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(
        new Table({
          name: 'Users',
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
              name: 'role',
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
              name: 'email',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'emailConfirmedAt',
              type: 'datetime',
              isNullable: true,
            },
            {
              name: 'emailConfirmationToken',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'passwordHash',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'passwordResetAt',
              type: 'datetime',
              isNullable: true,
            },
            {
              name: 'passwordResetToken',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'lastAuthenticatedAt',
              type: 'datetime',
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
              name: 'users-email-confirmation-token',
              columnNames: [ 'emailConfirmationToken' ],
            },
          ],
          uniques: [
            {
              name: 'users-email-unique',
              columnNames: [ 'email' ],
            },
          ],
          foreignKeys: [
            {
              name: 'users-users-created-by-id',
              columnNames: [ 'createdById' ],
              referencedTableName: 'Users',
              referencedColumnNames: [ 'id' ],
              onDelete: 'RESTRICT',
            },
            {
              name: 'users-users-last-updated-by-id',
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
      // await queryRunner.dropForeignKey('Users', 'users-created-by-id');
      // await queryRunner.dropForeignKey('Users', 'users-last-updated-by-id');
      // await queryRunner.dropTable('Users');
    }
}
