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
import { AiModule } from './ai/ai.module';
import { MongoConfig, MysqlConfig, PostgresConfig } from 'config/database.config';
// import { ProjectSearchModule } from './operationalModules/projectSearch/project_search.module';

/* nest项目可以理解为由好多模块组成的，app.module.ts是项目的根模块 */
@Module({
  // imports的作用是引入其他模块，providers的作用是为当前模块提供服务的文件
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 在全局任何地方都可以使用ConfigService来获取配置信息
      envFilePath: [envConfig.path],
    }),
    MysqlConfig,
    PostgresConfig,
    MongoConfig,
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
    AiModule
  ],
  controllers: [AppController], // 处理http请求，包括路由控制，向客户端返回响应
  providers: [AppService], // 服务提供者，处理具体的业务逻辑
})
export class AppModule {}