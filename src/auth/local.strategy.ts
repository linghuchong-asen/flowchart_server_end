import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { IStrategyOptions, Strategy } from 'passport-local';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

// 使用的passport-local的strategy
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  /* validate方法内必须要查询来带有密码的user信息，并且返回给passport，passport内部会调用validate方法 */
  async validate(username: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username }) //其中 :username 是一个占位符，{ username } 是传递给占位符的实际值。
      .getOne();
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('密码不正确');
    }
    return user;
  }
}
