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
  ClassSerializerInterceptor,
  UseGuards,
  Req,
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
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/auth.guard';

const logger = new Logger('UserController');
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    // @UploadedFiles() files: Express.Multer.File[],
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.userService.register(createUserDto);
  }

  /*  注册时只需要用户名和密码，头像角色等信息可以登录后修改 */
  /* 使用 multer 作为中间层实现解析content-type为multipart/form-data的请求 */
  /* FileInterceptor：适合接收单独的file类型参数
     FilesInterceptor：适合当传参中既有string又有file类型,且只有一个file字段
     FileFieldsInterceptor：一个参数可以是数组，适合当传参中有多个字段是file类型
  */
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard('jwt')) // 这种方式能调用JwtStrategy，但是不能调用到JwtAuthGuard
  @UseInterceptors(
    //  NOTE:第一个参数要和传参中file类型的字段名称一致
    FilesInterceptor('avatar', 10),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() userInfo: UpdateUserDto,
    @Req() req,
  ) {
    // TODO: 想要的是文件路径，在哪里获取
    logger.log(req); // req.user即为数据库中查询出来user的完整信息，是在JwtStrategy的validate方法中返回的
    logger.log(files); // files.path即为文件绝对路径
    logger.log(userInfo); // 此次传入的非file类型字段
    const newUser = { id: req.user.id, avatar: files[0].path, ...userInfo };
    return await this.userService.update(newUser);
  }

  /** 获取用户信息 */
  @Get()
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Req() req) {
    const user = req.user as UserEntity;
    const resAvatarPath = user.avatar.split('\\');
    const userInfo = {
      ...req.user,
      avatar: `localhost:3001/${resAvatarPath}`,
    };
    return userInfo;
  }
}
