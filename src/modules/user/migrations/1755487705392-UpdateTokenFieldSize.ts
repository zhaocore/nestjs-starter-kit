import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { TABLE_NAME } from '../entities/user.entity';

export class UpdateTokenFieldSize1755487705392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 修改token字段类型为text，支持更大的存储空间
    await queryRunner.changeColumn(
      TABLE_NAME,
      'token',
      new TableColumn({
        name: 'token',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回滚：将token字段改回varchar类型
    await queryRunner.changeColumn(
      TABLE_NAME,
      'token',
      new TableColumn({
        name: 'token',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
