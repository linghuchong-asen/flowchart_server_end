import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  createToken(user: Partial<UserEntity>) {
    return this.jwtService.sign(user, {});
  }

  getToken(user: Partial<UserEntity>) {
    /* console.log('用于生成token的user信息', user.id, user.username); */
    const token = this.createToken({
      id: user.id,
      username: user.username,
    });
    return { token };
  }
}
