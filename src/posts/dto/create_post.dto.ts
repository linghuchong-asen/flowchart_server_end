import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;
  @IsNotEmpty({ message: '内容不能为空' })
  readonly content: string;
  @IsNotEmpty({ message: '作者不能为空' })
  readonly author: string;
  @IsNumber()
  readonly type: number;
  @IsString()
  readonly cover_url?: string;
}
