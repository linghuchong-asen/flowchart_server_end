// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { RedisClientType } from 'redis';

// const logger = new Logger('RedisCacheService');

// @Injectable()
// export class RedisCacheService {
//   constructor(@Inject('REDIS_CLIENT') private redisClient: RedisClientType) {}

//   async set(key: string, value: string, ttl: number = 60 * 60 * 4) {
//     value = JSON.stringify(value);
//     // EX:设置数据的生存时间，单位秒
//     return await this.redisClient.set(key, value, { EX: ttl });
//   }

//   async get(key: string) {
//     let value = await this.redisClient.get(key);
//     try {
//       value = JSON.parse(value);
//     } catch (e) {
//       logger.error('JSON.parse解析错误', e);
//     }
//     return value;
//   }

//   async delete(key: string) {
//     return await this.redisClient.del(key);
//   }

//   /**清空所有数据库中的所有键 */
//   async flushAll() {
//     return await this.redisClient.flushAll();
//   }

//   /* -------------使用set实现用户黑名单列表-------------- */
//   async addToBlackList(userId: string) {
//     return await this.redisClient.sAdd(`blacklist:users`, userId);
//   }

//   async isUserInBlacklist(userId: string): Promise<boolean> {
//     return await this.redisClient.sIsMember('blacklist:users', userId);
//   }

//   async getAllBlacklistedUsers() {
//     return await this.redisClient.sMembers('blacklist:users');
//   }

//   async removeFromBlacklist(userId:string) {
//     return await this.redisClient.sRem('blacklist:users', userId);
//   }
// }
