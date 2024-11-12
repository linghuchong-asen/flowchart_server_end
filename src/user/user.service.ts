import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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

  /** 更新用户头像 */
  async updateAvatar(avatar: string) {
    // TODO 如何基于token获取id
    // const user = await this.userRepository.findOne({ where: { id } });
    // if (!user) {
    //   throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    // }
    // user.avatar = avatar;
    // return await this.userRepository.save(user);
  }
}
