import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EditorDocument, EditorDocumentSchema } from './editor_document.schema';

/* 编辑器文档保存至MongoDB模块 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EditorDocument.name, schema: EditorDocumentSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class EditorContentModule {}
