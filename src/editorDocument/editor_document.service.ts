import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EditorDocument } from './editor_document.schema';
import { Model } from 'mongoose';

@Injectable()
export class EditorDocumentService {
  constructor(
    // 将定义的EditorDocument作为依赖注入生成model
    // ts的class类编译为js时，会转变为一个函数，函数的名字即为类名
    @InjectModel(EditorDocument.name)
    private editorDocumentModel: Model<EditorDocument>,
  ) {}

  /** 保存编辑器文档 */
  async save() {}

  /** 获取编辑器文档 */
  async getDocumentById(id: string) {
    
  }
}
