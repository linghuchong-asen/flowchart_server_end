import { IsNotEmpty, IsNumber, IsString, isEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly projectName: string;
  readonly projectDesc: string;
}
