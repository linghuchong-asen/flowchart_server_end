import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        // TODO:不需要指定端口号和密码吗
        uri: config.get('MONGO_DB_HOST'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class EditorContentModule {}
