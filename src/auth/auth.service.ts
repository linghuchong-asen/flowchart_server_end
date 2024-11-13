import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  createToken(user: Partial<UserEntity>) {
    return this.jwtService.sign(user, {
      privateKey: this.configService.get('JWT_SECRET'),
    });
  }

  getToken(user: Partial<UserEntity>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return { token };
  }
}
