import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { RoleEnum, UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

interface jwtPayload {
  id: string;
  username: string;
  role: RoleEnum;
}

// 这里的Strategy来自passport-jwt
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly ConfigService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    console.log('验证用jwt', ConfigService.get('JWT_SECRET'));
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ConfigService.get('JWT_SECRET'),
    } as StrategyOptions);
  }

  /* TODO: payload是不是已经通过passport-jwt解析过了的负载 */
  validate(payload: jwtPayload) {
    const userId = payload.id;
    const existUser = this.userService.getUserById(userId);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    return existUser;
  }
}
