import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../base/entity/base.entity';

export const TABLE_NAME = 'tb_admin_user';
@Entity({
  name: TABLE_NAME,
})
export class UserEntity extends BaseEntity {
  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column()
  email: string;

  @Column({
    name: 'password',
  })
  passwordHash: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  token: string;
}
