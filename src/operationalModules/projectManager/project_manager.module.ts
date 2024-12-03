import { Module } from '@nestjs/common';
import { ProjectManagerController } from './project_manager.controller';
import { ProjectManagerService } from './project_manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project_manager.entity';
import { EditorDocumentService } from '../editorDocument/editor_document.service';
import { EditorDocumentModule } from '../editorDocument/editor_document.module';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EditorDocument,
  EditorDocumentSchema,
} from '../editorDocument/schemas/editor_document.schema';

@Module({
  /*TypeOrmModule.forFeature方法的主要作用是将指定的实体（如PostsEntity)注册到当前的Nst]S模块中，以便在该模块中可以直接注入和使用这些实体*/
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),
    EditorDocumentModule,
    MongooseModule.forFeature([
      {
        name: EditorDocument.name,
        schema: EditorDocumentSchema,
      },
    ]),
  ],
  controllers: [ProjectManagerController],
  providers: [ProjectManagerService],
})
export class ProjectManagerModule {}
