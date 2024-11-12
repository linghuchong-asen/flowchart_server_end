import { IsNotEmpty, isNotEmpty } from 'class-validator';
import { IsFieldNotProvided } from './update_user_decorate.util';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;
  @IsNotEmpty({ message: '昵称不能为空' })
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
}
