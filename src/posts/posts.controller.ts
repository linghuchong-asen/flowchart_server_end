import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostRo, PostsService } from './posts.service';

@Controller('posts') // 路径为/posts
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /** 创建文章
   * @param post
   */
  /* @Body() 它的主要作用是从 HTTP 请求的请求体（Request Body）中提取数据，并将其传递给控制器方法中的参数。*/
  @Post()
  async create(@Body() post) {
    return this.postsService.create(post);
  }

  /** 获取所有文章 */
  @Get()
  /* @Query() 装饰器用于从 HTTP 请求的查询字符串中提取参数。它可以从请求 URL 中获取所有查询参数，并将它们作为对象传递给方法参数 query。例如，如果请求 URL 是 http://example.com/api/posts?filter=active&page=1，那么 query 将是一个包含 filter 和 page 属性的对象 */
  async findAll(@Query() query): Promise<PostRo> {
    return this.postsService.findAll(query);
  }

  /** 获取指定文章
   * @param id
   */
  /* :id是路径参数占位符，客户端发送一个 GET 请求到 /somepath/123 时，这个处理器会被触发，并且 id 参数会被解析为 123。 */
  /*  */
  @Get(':id')
  /* 获取路由参数id,@Query是所有路由参数，@Param是获取指定路由参数 */
  async findById(@Param('id') id) {
    return await this.postsService.findById(id);
  }

  /** 更新文章
   * @param id
   * @param post */
  /*获取路由参数id,@Query是所有路由参数(get),@Param是获取指定路由参数@Body用于post或put、delete请求体参数*/
  @Put(':id')
  async update(@Param('id') id, @Body() post) {
    return await this.postsService.updateById(id, post);
  }

  /** 删除文章
   *  @param id
   */
  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.postsService.removeById(id);
  }
}
