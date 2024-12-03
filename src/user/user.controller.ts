import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseInterceptors,
  UploadedFiles,
  Logger,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

const logger = new Logger('UserController');
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor) // 所有的返回结果排除password字段
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    // @UploadedFiles() files: Express.Multer.File[],
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.userService.register(createUserDto);
  }
  /** 更新用户信息 */
  /*  注册时只需要用户名和密码，头像角色等信息可以登录后修改 
      使用 multer 作为中间层实现解析content-type为multipart/form-data的请求 
      FileInterceptor：适合接收单独的file类型参数
      FilesInterceptor：适合当传参中既有string又有file类型,且只有一个file字段
      FileFieldsInterceptor：一个参数可以是数组，适合当传参中有多个字段是file类型
  */
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard('jwt')) // 这种方式能调用JwtStrategy，但是不能调用到JwtAuthGuard
  @UseInterceptors(
    //  NOTE:第一个参数要和传参中file类型的字段名称一致
    FilesInterceptor('avatar', 10), //FilesInterceptor 是一个特定的拦截器，用于处理多文件上传。会将拦截到的文件交给multer处理
  )
  async update(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() userInfo: UpdateUserDto,
    @Req() req,
  ) {
    /*  logger.log(req); // req.user即为数据库中查询出来user的完整信息，是在JwtStrategy的validate方法中返回的
     logger.log(files); // files.path即为文件绝对路径
     logger.log(userInfo); // 此次传入的非file类型字段 */

    const newUser = { id: req.user.id, avatar: files[0].path, ...userInfo };
    return await this.userService.update(newUser);
  }

  /** 获取用户信息 */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req) {
    const user = req.user as UserEntity;
    return await this.userService.getUserById(user.id);
  }
}
