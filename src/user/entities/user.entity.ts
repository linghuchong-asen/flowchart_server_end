/*
 * @Description: 用户实体
 * @Author: yangsen
 * @Date: 2024-11-11 10:30:10
 * @LastEditors: yangsen
 * @LastEditTime: 2024-11-12 18:37:41
 */
import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import { Exclude } from 'class-transformer';

@Entity('user') // user即为表名
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 100 })
  nickname: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: path.resolve(__dirname, '../../public/avatar.jpg') })
  avatar: string;

  @Column()
  email: string;

  @Column('simple-enum', {
    enum: ['root', 'author', 'visitor'],
    default: 'visitor',
  })
  role: string; // 用户角色

  @Column({
    name: 'create_time', // 存入数据库的实际是create_time
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPassword() {
    // 插入数据库之前执行的方法
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}
