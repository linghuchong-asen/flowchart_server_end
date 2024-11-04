import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';
import { Repository } from 'typeorm';
import { error } from 'console';

interface PostRo {
  list: PostsEntity[];
  count: number;
}
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  /* 创建文章 */
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('文章标题不能为空', 401);
    }
    const doc = await this.postsRepository.findOne({
      where: { title },
    });
    if (doc) {
      throw new HttpException('文章标题已存在', 401);
    }

    return await this.postsRepository.save(post);
  }

  /**  获取文章列表 */
  async findAll(query): Promise<PostRo> {
    const qb = this.postsRepository.createQueryBuilder('post');
    qb.where('1=1');
    qb.orderBy('post.create_time', 'DESC'); // DESC是降序的意思，升序：ASC

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize); // 可以选择的最大行数
    qb.offset((pageNum - 1) * pageSize);

    const posts = await qb.getMany();
    return {
      list: posts,
      count,
    };
  }

  /** 获取指定文章 */
  async findById(id): Promise<PostsEntity> {
    return await this.postsRepository.findOne(id);
  }

  /** 更新文章 */
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  /** 删除文章 */
  async removeById(id): Promise<any> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.delete(id);
  }
}
