import { IsNotEmpty, IsNumber, IsString, isEmpty } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty({ message: '项目名称不能为空' })
  /* 前端传参字段有时和存入数据库中的不一致，以下是一段示例*/
  @Expose({ name: 'project_name' }) // 转换字段名
  @Transform(({ value }) => value, { toClassOnly: true }) // 转换值
  readonly projectName: string;
  @Expose({ name: 'project_desc' })
  readonly projectDesc: string;
}
