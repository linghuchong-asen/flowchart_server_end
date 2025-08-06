/*
 * @Description:TypeORM是通过实体映射到数据表，所以要建立一个项目实体posts.entity.ts
 * @Author: yangsen
 * @Date: 2022-04-03 22:27:54
 * @LastEditors: yangsen
 * @LastEditTime: 2024-12-02 15:08:17
 */

import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('project') // 没有指定表名，则表名默认为类名project_entity
export class ProjectEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Expose({ name: 'projectId', toPlainOnly: true })
  id?: string; // 标记为主键，值自动生成

  @Column({ length: 50 })
  /* @Expose中定义的字段名是普通对象用的； project_name是实例对象的字段名 */
  @Expose({ name: 'projectName', toPlainOnly: true })
  project_name: string;

  @Column('text')
  @Expose({ name: 'projectDesc', toPlainOnly: true })
  project_desc: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose({ name: 'createTime', toPlainOnly: true })
  create_time?: Date;

  /* 使用@UpdateDateColumn装饰器会自动更新时间戳 */
  @UpdateDateColumn({ type: 'timestamp' })
  @Expose({ name: 'updateTime', toPlainOnly: true })
  update_time?: Date;
}
