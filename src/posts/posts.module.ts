import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';

@Module({
  /*TypeOrmModule.forFeature方法的主要作用是将指定的实体（如PostsEntity)注册到当前的Nst]S模块中，以便在该模块中可以直接注入和使用这些实体*/
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
