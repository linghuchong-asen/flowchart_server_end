import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis_cache.service';
import { createClient, RedisModules } from 'redis';

@Module({
  imports: [
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigService],
    //   // inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     const store = await redisStore({
    //       socket: {
    //         host: configService.get('REDIS_HOST', 'localhost'),
    //         port: configService.get('REDIS_PORT', 6379),
    //       },
    //       password: configService.get('REDIS_PASSWD', '123456'),
    //       database: 0, // 选择数据库
    //       ttl: 1000 * 60 * 60 * 4, // Time To Live 缓存数据的生存时间，单位是毫秒，默认是 1 天
    //     });
    //     return {
    //       store,
    //     };
    //   },
    // }),
  ],
  providers: [
    {
      // 'REDIS_CLIENT',是服务的标识符，可以在模块中使用作为依赖注入使用，如 @Inject('REDIS_CLIENT') private readonly redisClient: RedisModules
      provide: 'REDIS_CLIENT',
      // inject有什么作用，是必须的吗？inject 是必需的，用于注入依赖项（如 ConfigService），以便在 useFactory 中使用。不然在编译阶段就报错了
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
          },
          password: configService.get('REDIS_PASSWD', '123456'),
          database: 0, // 选择数据库
          // ttl: 1000 * 60 * 60 * 4, // Time To Live 缓存数据的生存时间，使用createClient方法创建客户端时不支持设置，可以在set方法添加数据时设置
        })
          .on('error', (err) => console.log('Redis Client Error', err))
          .connect();
        return client;
      },
    },
    RedisCacheService,
  ],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
