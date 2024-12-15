import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import * as path from 'path';
// const diskStorage = require('@nestjs/platform-express/multer');
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.register({
      /*  diskStorage 来配置文件存储路径和文件命名规则 */
      storage: diskStorage({
        destination: path.resolve(__dirname, '../../../uploads'), // 指定文件存储的目录
        filename: (req, file, cb) => {
          // logger.log(path.join('/uploads')); // \uploads 这个实际也是储存在D:\uploads目录下
          // logger.log(path.join(__dirname, '/uploads')); // D:\Users\code\nest-demo\dist\src\user\uploads
          // logger.log(path.resolve(__dirname, '../../uploads')); // D:\Users\code\nest-demo\dist\uploads 使用这个合适，resolve返回绝对路径
          // logger.log(path.resolve(__dirname, '/uploads')); //D:\uploads
          // logger.log(path.join('/Users/code/nest-demo/uploads')); // \Users\code\nest-demo\uploads 实际也是D盘
          // logger.log(path.resolve('/Users/code/nest-demo/uploads')); // D:\Users\code\nest-demo\uploads

          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, file.fieldname + '-' + uniqueSuffix + ext); // 生成唯一的文件名
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
