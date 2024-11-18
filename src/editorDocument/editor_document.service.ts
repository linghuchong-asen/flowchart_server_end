import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EditorDocument } from './editor_document.schema';
import { Model } from 'mongoose';

@Injectable()
export class EditorDocumentService {
  constructor(
    // @InjectModel()方法，注入数据库的model
    // todo:每一个class类都有一个name吗？
    @InjectModel(EditorDocument.name)
    private editorDocumentModel: Model<EditorDocument>,
  ) {}
}
