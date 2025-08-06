import { IsNotEmpty } from 'class-validator';
import { IsFieldNotProvided } from './update_user_decorate.util';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;
  readonly nickname: string;
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
  readonly avatar: string;
  readonly email: string;
  readonly role: string;
  @IsFieldNotProvided()
  readonly createTime: Date;
  @IsFieldNotProvided()
  readonly updateTime: Date;

  /* 前端传参字段有时和存入数据库中的不一致，以下是一段示例
  @Expose({ name: 'page_size' }) // 转换字段名
  @Transform(({ value }) => parseInt(value, 10)) // 转换值
  readonly pageSize: number;
   */
}
