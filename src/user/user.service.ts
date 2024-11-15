import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    /* create方法只是创建了User对象，save方法才是将User对象保存到数据库中 */
    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }

  /** 更新用户信息 */
  async update(user: Partial<UserEntity>) {
    const existUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!existUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const updateUser = this.userRepository.merge(existUser, user);
    return await this.userRepository.save(updateUser);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    // todo:
    // NOTE: 配置文件路径要结合multer的文件存储路径和serve-static静态服务的路径
    const userFileName = user.avatar.split('\\').pop();
    user.avatar = `localhost:3001/${userFileName}`;
    return user;
  }
}
