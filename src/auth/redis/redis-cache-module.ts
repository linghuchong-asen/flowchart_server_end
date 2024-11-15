import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigService],
      // inject有什么作用，是必须的吗？inject 是必需的，用于注入依赖项（如 ConfigService），以便在 useFactory 中使用。
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          store: 'redis',
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          db: 0, // 选择数据库
          auth_pass: configService.get('REDIS_PASSWD', '123456'),
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class RedisCacheModule {}
