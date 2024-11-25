import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project_manager.entity';
import { Repository } from 'typeorm';

export interface PostRo {
  list: ProjectEntity[];
  count: number;
}
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly postsRepository: Repository<ProjectEntity>,
  ) {}

  /* 新建项目 */
  async create(project: Partial<ProjectEntity>): Promise<ProjectEntity> {
    // todo: 当没有穿project_desc字段时，mysql中会存储为什么
    const { project_name } = project;
    if (!project_name) {
      throw new HttpException('项目名称不能为空', 400);
    }
    const doc = await this.postsRepository.findOne({
      where: { project_name },
    });
    if (doc) {
      throw new HttpException('项目名称已存在', 409);
    }

    return await this.postsRepository.save(project);
  }

  /**  获取项目列表 */
  async findAll(query): Promise<PostRo> {
    const qb = this.postsRepository.createQueryBuilder('post');
    qb.where('1=1');
    qb.orderBy('post.create_date', 'DESC'); // DESC是降序的意思，升序：ASC

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
  async findById(id): Promise<ProjectEntity> {
    return await this.postsRepository.findOne({
      select: ['id', 'project_name', 'project_desc'], // 指定返回那几列
      where: { id }, // 查询id符合条件的行
    });
  }

  /** 更新文章 */
  async updateById(id, post): Promise<ProjectEntity> {
    const existPost = await this.postsRepository.findOne({ where: { id } });
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
