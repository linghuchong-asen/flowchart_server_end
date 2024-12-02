import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectRo, ProjectService } from './project_manager.service';
import { CreateProjectDto } from './dto/create_project.dto';
import { ProjectEntity } from './project_manager.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Controller('project') // 路径为/project
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /** 新建项目 */
  /* @Body() 它的主要作用是从 HTTP 请求的请求体（Request Body）中提取数据，并将其传递给控制器方法中的参数。*/
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() project: CreateProjectDto) {
    /* note：在 controller 中接收到的参数不会完成@Expose 中重新定义的字段名，且接收到的参数还是普通对象，在使用 plainToInStance(), instanceToPlain()方法时会完成字段名名的转换； */
    // const projectDto = plainToInstance(CreateProjectDto, project);
    const projectEntity = plainToInstance(ProjectEntity, project);
    // const a = instanceToPlain(projectDto);
    // const b = plainToInstance(CreateProjectDto, project);
    return this.projectService.create(projectEntity);
  }

  /** 获取项目列表 */
  @Get()
  /* @Query() 装饰器用于从 HTTP 请求的查询字符串中提取参数。它可以从请求 URL 中获取所有查询参数，并将它们作为对象传递给方法参数 query。例如，如果请求 URL 是 http://example.com/api/posts?filter=active&page=1，那么 query 将是一个包含 filter 和 page 属性的对象 */
  async findAll(@Query() query): Promise<ProjectRo> {
    const { pageSize, pageNumber } = query;
    return this.projectService.findAll({ pageSize, pageNumber });
  }

  /** 获取指定项目
   * @param id
   */
  /* :id是路径参数占位符，客户端发送一个 GET 请求到 /somepath/123 时，这个处理器会被触发，并且 id 参数会被解析为 123。 */
  /*  */
  @Get(':id')
  /* 获取路由参数id,@Query是所有路由参数，@Param是获取指定路由参数 */
  async findById(@Param('id') id) {
    return await this.projectService.findById(id);
  }

  /** 更新项目信息
   * @param id
   * @param post */
  /*获取路由参数id,@Query是所有路由参数(get),@Param是获取指定路由参数@Body用于post或put、delete请求体参数*/
  @Put(':id')
  async update(@Param('id') id, @Body() post) {
    return await this.projectService.updateById(id, post);
  }

  /** 删除项目
   *  @param id
   */
  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.projectService.removeById(id);
  }
}
