import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { RedisCacheService } from 'src/jwtRedis/redis-cache.service';
import { RedisCacheModule } from 'src/jwtRedis/redis-cache.module';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('JWT_SECRET', 'secret123456'),
      signOptions: { expiresIn: '4h' },
    };
  },
});

@Module({
  // 用于导入其他模块，而且是导入了jwtModule模块才可以在当前模块的JwtStrategy中使用jwtService
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    jwtModule,
    RedisCacheModule,
  ],
  controllers: [AuthController],
  // 服务提供者，不是模块这个级别，是具体的服务
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
  /* 如果其他模块中需要使用依赖注入的方式 */
  // exports: [JwtAuthGuard],
})
export class AuthModule {}
