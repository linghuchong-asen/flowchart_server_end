import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// todo: 有必要写extends Document吗？
@Schema()
export class EditorDocument {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  data: { cells: [] };
}

// SchemaFactory 是 mongoose 内置的一个方法做用是读取模式文档 并创建 Schema 对象
export const EditorDocumentSchema =
  SchemaFactory.createForClass(EditorDocument);
