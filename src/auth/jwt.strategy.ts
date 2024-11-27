// import { RedisCacheService } from '../jwtRedis/redis_cache.service';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum, UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import {
  ClassSerializerInterceptor,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

interface jwtPayload {
  id: string;
  username: string;
  role: RoleEnum;
}

// NOTE:！！！确认Strategy来自passport-jwt
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly ConfigService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) // private readonly redisCacheService: RedisCacheService,
  {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ConfigService.get('JWT_SECRET', 'secret123456'),
    } as StrategyOptions);
    /*  console.log('验证用jwt', ConfigService.get('JWT_SECRET')); */
  }

  /* NOTE: payload是已经通过passport-jwt解析过了的负载 */
  @UseInterceptors(ClassSerializerInterceptor)
  async validate(payload: jwtPayload) {
    const userId = payload.id;
    const existUser = await this.userService.getUserById(userId);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }

    // const isBlacklisted = await this.redisCacheService.isUserInBlacklist(
    //   userId,
    // );
    // if (isBlacklisted) {
    //   throw new UnauthorizedException('黑名单用户');
    // }

    // NOTE: validate返回值会被添加到请求对象的req.user属性上，这样你可以在后续的处理器（如控制器方法）中访问到这个用户信息。
    return existUser;
  }
}
