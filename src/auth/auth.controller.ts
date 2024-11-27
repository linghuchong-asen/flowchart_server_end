import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local')) //UseGuards装饰器可以传入多个认证守卫，在接收到对应请求时，会依次调用认证守卫
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginInfo: LoginDto, @Req() req) {
    // 逻辑能走到这里，证明用户登录认证已经通过;验证用户名密码的逻辑是在passport这个库的local策略中执行的
    const existUser = await this.userRepository.findOne({
      where: { username: loginInfo.username },
    });
    if (!existUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const token = await this.authService.getToken({
      id: existUser.id,
      ...loginInfo,
    });
    return token;
  }

  // 通过前端删除token的方式退出登录
}
