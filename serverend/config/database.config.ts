import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSummary } from '../src/ai/memory/conversation_summary.entity';
import envConfig from './env';

// MySQL数据库配置
export const MysqlConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'mysql',
    // entities: [PostsEntity], // 数据表实体
    autoLoadEntities: true, // 自动加载实体，不用崽崽entities数组中一个一个添加了，不过要配合ypeOrmModule.forFeature()将对应的实体注册到nestjs模块中
    host: configService.get('DB_HOST', 'localhost'), // 后面的localhost是当前没有配置环境变量时，默认值
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get('DB_USER', 'root'),
    password: configService.get('DB_PASSWD', '123456'),
    database: configService.get('DB_DATABASE', 'flowchart_editor'),
    timezone: '+08:00', // 服务器上配置的时区
    synchronize: true, // 根据实体自动创建数据库表，生产环境建议关闭
  }),
});

// PostgreSQL数据库配置
export const PostgresConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST', 'localhost'),
    port: configService.get<number>('PG_PORT', 5432),
    username: configService.get('PG_USER', 'postgres'),
    password: configService.get('PG_PASSWD', 'postgres'),
    database: configService.get('PG_DATABASE', 'flowchart_editor'),
    entities: [ConversationSummary],
    synchronize: true, // 在生产环境中应设置为 false
    logging: false,
  }),
});

// MongoDB数据库配置
export const MongoConfig = MongooseModule.forRootAsync({
 imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        /* 不需要指定端口号和密码吗?
        在mongoose中，端口号、密码、数据库都是通过uri指定的 */
        uri: `mongodb://${config.get(
          'MONGO_DB_USER_NAME',
          'devUser',
        )}:${config.get('MONGO_DB_PASSWD', '123456')}@${config.get(
          'MONGO_DB_HOST',
          '127.0.0.1',
        )}:${config.get('MONGO_DB_PORT', 27017)}/${config.get(
          'MONGO_DB_NAME',
          'flowchartEditor',
        )}`,
      }),
});
