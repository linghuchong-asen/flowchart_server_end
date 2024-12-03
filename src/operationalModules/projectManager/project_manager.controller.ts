import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectRo, ProjectManagerService } from './project_manager.service';
import { CreateProjectDto } from './dto/create_project.dto';
import { ProjectEntity } from './entities/project_manager.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

const logger = new Logger('ProjectController');

@Controller('project') // 路径为/project
@UseGuards(JwtAuthGuard)
export class ProjectManagerController {
  constructor(private readonly projectService: ProjectManagerService) {}

  /** 新建项目 */
  /* @Body() 它的主要作用是从 HTTP 请求的请求体（Request Body）中提取数据，并将其传递给控制器方法中的参数。*/
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() project: CreateProjectDto) {
    /* note：在 controller 中接收到的参数不会完成@Expose 中重新定义的字段名，且接收到的参数还是普通对象，在使用 plainToInStance(), instanceToPlain()方法时会完成字段名名的转换； */
    const projectEntityParam = plainToInstance(ProjectEntity, project);
    const createResult = await this.projectService.create(projectEntityParam);
    return createResult;
  }

  /** 获取项目列表 */
  @Get()
  /* @Query() 装饰器用于从 HTTP 请求的查询字符串中提取参数。它可以从请求 URL 中获取所有查询参数，并将它们作为对象传递给方法参数 query。例如，如果请求 URL 是 http://example.com/api/posts?filter=active&page=1，那么 query 将是一个包含 filter 和 page 属性的对象 */
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() query): Promise<ProjectRo> {
    const { pageSize, pageNumber } = query;
    const findResult = await this.projectService.findAll({
      pageSize,
      pageNumber,
    });
    return findResult;
  }

  /** 获取指定项目
   * @param id
   */
  /* :id是路径参数占位符，客户端发送一个 GET 请求到 /somepath/123 时，这个处理器会被触发，并且 id 参数会被解析为 123。
    使用正则只匹配数字路径，否则会错误拦截其他请求，比如后面的editDataFile；所以尽量使用查询参数比较好 */
  /*  */
  @Get('/:id(\\d+)/')
  async findById(@Param('id') id) {
    const projectResult = await this.projectService.findById(id);
    return projectResult;
  }

  /** 更新项目信息
   * @param id
   * @param post */
  @Put(':id')
  async update(@Param('id') id, @Body() post) {
    return await this.projectService.updateById(id, post);
  }

  /** 删除项目
   *  @param id
   */
  @Delete('delProject')
  async remove(@Query() reqParams) {
    const { projectIds } = reqParams;
    return await this.projectService.removeById(projectIds);
  }

  /** 导出指定项目的编辑器json文件 */
  @Get('editDataFile')
  async exportEditorDataFile(@Query() reqParams, @Res() res: Response) {
    const { projectId } = reqParams;
    const filePath = await this.projectService.exportEditorDataFile(projectId);
    if (!filePath) {
      throw new HttpException(`id为${projectId}的项目不存在`, 404);
    }
    // 可以获取带有后缀的文件名，path模块还能不同平台分割符的问题
    const fileName = path.basename(filePath);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);

    // 读取文件并返回
    const fileStream = fs.createReadStream(filePath);
    /* pipe 方法是 Node.js 流（Stream）模块中的一个方法，用于将一个可读流（Readable Stream）的数据传输到一个可写流（Writable Stream）。在这个上下文中，fileStream 是一个可读流，表示从文件系统中读取的文件数据，而 res 是一个可写流，表示 HTTP 响应。 */
    fileStream.pipe(res);

    // 下载完成后删除临时文件
    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });
    fileStream.on('error', (err) => {
      logger.error('文件下载失败', err);
      res.destroy(err);
      throw new HttpException('文件下载失败', 500);
    });
  }
}
