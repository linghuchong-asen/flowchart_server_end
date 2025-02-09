import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectManagerModule } from './operationalModules/projectManager/project_manager.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import envConfig from '../config/env';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
// import { RedisCacheModule } from './jwtRedis/redis_cache.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EditorDocumentModule } from './operationalModules/editorDocument/editor_document.module';
// import { ProjectSearchModule } from './operationalModules/projectSearch/project_search.module';

/* nest项目可以理解为由好多模块组成的，app.module.ts是项目的根模块 */
@Module({
  // imports的作用是引入其他模块，providers的作用是为当前模块提供服务的文件
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 在全局任何地方都可以使用ConfigService来获取配置信息
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
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
    }),
    MongooseModule.forRootAsync({
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
    }),
    ServeStaticModule.forRoot({
      // 静态资源目录，项目启动后代码会被打包进dist文件夹;这里要结合multer储存位置决定
      rootPath: path.resolve(__dirname, '../../', 'uploads'),
    }),
    ProjectManagerModule,
    UserModule,
    AuthModule,
    // RedisCacheModule,
    EditorDocumentModule,
    // ProjectSearchModule,
  ],
  controllers: [AppController], // 处理http请求，包括路由控制，向客户端返回响应
  providers: [AppService], // 服务提供者，处理具体的业务逻辑
})
export class AppModule {}
