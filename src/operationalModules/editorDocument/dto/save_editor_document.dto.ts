import { isNotEmpty, IsNotEmpty } from 'class-validator';

export class SaveEditorDocumentDto {
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly name: string;
  @IsNotEmpty({ message: '项目数据不能为空' })
  readonly editorData: { cells: { cell: string; edge: string }[] };
}
