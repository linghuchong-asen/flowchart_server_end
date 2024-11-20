import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

/*  有必要写extends Document吗？没必要，没有写也一样正常运行 */
@Schema({ collection: 'editorData' }) // 指定集合名称，这样就会在MongoDB创建一个集合
export class EditorDocument {
  /*  mongodb中有类似typeorm中自动生成id的功能，还需要前端传id吗？
   在 MongoDB 中，每个文档都会自动分配一个唯一的 _id 字段，除非你显式地指定了这个字段的值。因此，如果你不希望前端传递 id，你可以选择不在 EditorDocument 模型中定义 id 属性，或者将 id 属性设置为可选。*/
  @Prop({ required: false })
  id?: string;
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({
    required: true,
    // mongoose定义类型和ts 定义类型不一样，需要使用type来定义，否则会报错，并且要使用SchemaTypes
    type: {
      cells: [
        {
          cell: { type: SchemaTypes.String },
          edge: { type: SchemaTypes.String },
        },
      ],
    },
  })
  editorData: { cells: Array<{ cell: string; edge: string }> };
}

// SchemaFactory 是 mongoose 内置的一个方法做用是读取模式文档 并创建 Schema 对象
export const EditorDocumentSchema =
  SchemaFactory.createForClass(EditorDocument);
