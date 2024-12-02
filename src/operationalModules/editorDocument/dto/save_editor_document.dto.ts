import { IsNotEmpty } from 'class-validator';

export class SaveEditorDocumentDto {
  @IsNotEmpty({ message: '项目id不能为空' })
  readonly projectId: string;
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly projectName: string;
  @IsNotEmpty({ message: '项目数据不能为空' })
  readonly editorData: [];
}
