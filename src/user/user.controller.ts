import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

const logger = new Logger('UserController');
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* 使用 multer 作为中间层实现解析content-type为multipart/form-data的请求 */
  /* FileInterceptor：适合接收单独的file类型参数
     FilesInterceptor：适合当传参中既有string又有file类型,且只有一个file字段
     FileFieldsInterceptor：一个参数可以是数组，适合当传参中有多个字段是file类型
  */
  @Post('register')
  // @UseInterceptors(
  //   //  NOTE:第一个参数要和传参中file类型的字段名称一致
  //   FilesInterceptor('avatar', 10, {
  //     /*  diskStorage 来配置文件存储路径和文件命名规则 */
  //     storage: diskStorage({
  //       destination: path.resolve('/Users/code/nest-demo/uploads'), // 指定文件存储的目录
  //       filename: (req, file, cb) => {
  //         // logger.log(path.join('/uploads')); // \uploads 这个实际也是储存在D:\uploads目录下
  //         // logger.log(path.join(__dirname, '/uploads')); // D:\Users\code\nest-demo\dist\src\user\uploads
  //         // logger.log(path.resolve(__dirname, '../../uploads')); // D:\Users\code\nest-demo\dist\uploads
  //         // logger.log(path.resolve(__dirname, '/uploads')); //D:\uploads
  //         // logger.log(path.join('/Users/code/nest-demo/uploads')); // \Users\code\nest-demo\uploads 实际也是D盘
  //         // logger.log(path.resolve('/Users/code/nest-demo/uploads')); // D:\Users\code\nest-demo\uploads 使用这个合适，resolve返回绝对路径

  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = path.extname(file.originalname);
  //         cb(null, file.fieldname + '-' + uniqueSuffix + ext); // 生成唯一的文件名
  //       },
  //     }),
  //   }),
  // )
  async register(
    // @UploadedFiles() files: Express.Multer.File[],
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.userService.register(createUserDto);
  }

  // 将注册和更新头像的接口分开
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'), 1)
  updateAvatar(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {}

  @Post('logout')
  async logout() {}
}
