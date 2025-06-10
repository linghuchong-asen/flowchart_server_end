/*
 * @Description: 编辑器数据保存模块
 * @Author: yangsen
 * @Date: 2022-04-19 09:31:59
 * @LastEditors: yangsen
 * @LastEditTime: 2025-01-21 18:42:24
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EditorDocument,
  EditorDocumentSchema,
} from './schemas/editor_document.schema';
import { EditorDocumentController } from './editor_document.controller';
import { EditorDocumentService } from './editor_document.service';
import { ProjectSearchModule } from '../projectSearch/project_search.module';

/* 编辑器文档保存至MongoDB模块 */
@Module({
  imports: [
    // name要和service依赖注入的scheme名一致
    // forFeature 方法在 NestJS 中用于注册特定的 Mongoose 模型到模块中,，使得这些模型可以在模块内的服务中被注入和使用。
    MongooseModule.forFeature([
      { name: EditorDocument.name, schema: EditorDocumentSchema },
    ]),
    ProjectSearchModule,
  ],
  controllers: [EditorDocumentController],
  providers: [EditorDocumentService],
  exports: [EditorDocumentService],
})
export class EditorDocumentModule {}
