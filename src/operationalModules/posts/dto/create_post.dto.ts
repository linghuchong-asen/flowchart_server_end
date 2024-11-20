import { IsNotEmpty, IsNumber, IsString, isEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;
  @IsNotEmpty({ message: '内容不能为空' })
  readonly content: string;
  @IsNotEmpty({ message: '作者不能为空' })
  readonly author: string;
  /* 如果前端使用content-type: x-www-urlencoded，那么前端传的number类型将会转换为字符串，所以这里需要做类型转换
  content-type: application/json，不会发生类型转换 */
  @Transform((params) => parseInt(params.value, 10))
  @IsNumber()
  readonly category: number;
  @IsString()
  readonly cover_url: string;
}
