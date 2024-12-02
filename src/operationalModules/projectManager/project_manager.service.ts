import { EditorDocument } from './../editorDocument/schemas/editor_document.schema';
import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project_manager.entity';
import { DataSource, Repository } from 'typeorm';
import {
  classToPlain,
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { ProjectResponseDto } from './dto/project_response.dto';
import { CreateProjectDto } from './dto/create_project.dto';
import { EditorDocumentService } from '../editorDocument/editor_document.service';

const logger = new Logger('ProjectService');

export interface ProjectRo {
  page: { total: number; pageSize: number };
  tableData: ProjectEntity[];
}
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly dataSource: DataSource,
    private readonly editorDocumentService: EditorDocumentService,
  ) {}

  /* 新建项目 */
  async create(project: ProjectEntity): Promise<ProjectEntity> {
    // todo: 当没有传project_desc字段时，mysql中会存储为什么
    const { project_name } = project;
    if (!project_name) {
      throw new HttpException('项目名称不能为空', 400);
    }
    const doc = await this.projectRepository.findOne({
      where: { project_name },
    });
    if (doc) {
      throw new HttpException('项目名称已存在', 409);
    }

    /* TypeORM会将查询结果转换为类实例，所以savedProject是一个类实例对象(此处为CreateProjectDto)，返回前端的通常是普通对象 */
    /* save方法返回的实例对象类型是与传入参数一致的，比如传入的的是CreateProjectDto返回的也是CreateProjectDto；传入的ProjectEntity返回的也是ProjectEntity */
    const savedProject = await this.projectRepository.save(project);
    return savedProject;
  }

  /**  获取项目列表 */
  async findAll(query: {
    pageSize: number;
    pageNumber: number;
  }): Promise<ProjectRo> {
    const qb = this.projectRepository.createQueryBuilder('project'); // 数据库表的名字
    qb.where('1=1'); // 1=1 总是为真，不会影响查询结果，但可以作为一个占位符，方便后续添加更多的条件。
    qb.orderBy('project.update_time', 'DESC'); // DESC是降序的意思，升序：ASC

    const count = await qb.getCount();
    const { pageNumber = 1, pageSize = 10 } = query;
    qb.limit(pageSize); // 可以选择的最大行数
    qb.offset((pageNumber - 1) * pageSize); // 从第几行开始

    try {
      const projects = await qb.getMany();
      return {
        page: { total: count, pageSize },
        tableData: projects,
      };
    } catch (err) {
      logger.error('查询项目列表失败', err);
      throw new HttpException(
        `查询项目列表失败${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 获取指定项目 */
  async findById(id): Promise<ProjectEntity> {
    return await this.projectRepository.findOne({
      select: ['id', 'project_name', 'project_desc'], // 指定返回那几列
      where: { id }, // 查询id符合条件的行
    });
  }

  /** 更新项目 */
  async updateById(id, project): Promise<ProjectEntity> {
    const existProject = await this.projectRepository.findOne({
      where: { id },
    });
    if (!existProject) {
      throw new HttpException(`id为${id}的项目不存在`, 401);
    }
    const updateProject = this.projectRepository.merge(existProject, project);
    return this.projectRepository.save(updateProject);
  }

  /** 删除项目 */
  async removeById(ids: string[]): Promise<any> {
    // dataSource默认使用typeORM链接的数据库
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      ids.forEach(async (id) => {
        const editorDocument = await this.editorDocumentService.getDocumentById(
          id,
        );
        if (editorDocument) {
          await this.editorDocumentService.removeById(id);
        }

        const existProject = await queryRunner.manager.findOne(ProjectEntity, {
          where: [{ id }],
        });
        if (!existProject) {
          throw new HttpException(`id为${id}的项目不存在`, 401);
        }
        return await this.projectRepository.delete(id);
      });
    } catch (err) {
      logger.error('删除项目失败', err);
      await queryRunner.rollbackTransaction();
    } finally {
      // 完成操作，释放queryRunner以避免资源泄露
      await queryRunner.release();
    }
  }
}
