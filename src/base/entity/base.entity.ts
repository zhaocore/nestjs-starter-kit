import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date = new Date();

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date = new Date();

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt?: Date;
}
