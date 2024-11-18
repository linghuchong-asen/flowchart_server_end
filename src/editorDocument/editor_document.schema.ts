import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class EditorDocument {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  data: { cells: [] };
}

export const EditorDocumentSchema =
  SchemaFactory.createForClass(EditorDocument);
