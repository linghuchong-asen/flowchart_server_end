import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/*
 * @Description:TypeORM是通过实体映射到数据表，所以要建立一个文章实体posts.entity.ts
 * @Author: yangsen
 * @Date: 2024-11-03 22:27:54
 * @LastEditors: yangsen
 * @LastEditTime: 2024-11-11 15:50:16
 */
@Entity() // 没有指定表名，则表名默认为类名posts_entity
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主键，值自动生成
  @Column({ length: 50 })
  title: string;
  @Column({ length: 20 })
  author: string;
  @Column('text')
  content: string;
  @Column({ default: '' })
  cover_url: string;
  @Column('tinyint')
  category: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;
  /* 使用@UpdateDateColumn装饰器会自动更新时间戳 */
  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
