import { Entity, PrimaryGeneratedColumn } from 'typeorm';

/*
 * @Description:TypeORM是通过实体映射到数据表，所以要建立一个文章实体posts.entity.ts
 * @Author: yangsen
 * @Date: 2024-11-03 22:27:54
 * @LastEditors: yangsen
 * @LastEditTime: 2024-11-03 22:38:05
 */
@Entity()
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主键，值自动生成
  
}
