import { Module } from '@nestjs/common';
import { ProjectController } from './project_manager.controller';
import { ProjectService } from './project_manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project_manager.entity';

@Module({
  /*TypeOrmModule.forFeature方法的主要作用是将指定的实体（如PostsEntity)注册到当前的Nst]S模块中，以便在该模块中可以直接注入和使用这些实体*/
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class PostsModule {}
