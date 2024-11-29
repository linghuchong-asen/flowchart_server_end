import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EditorDocumentService } from './editor_document.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { SaveEditorDocumentDto } from './dto/save_editor_document.dto';

@Controller('editor') // 参数为路径
export class EditorDocumentController {
  constructor(private readonly editorDocumentService: EditorDocumentService) {}

  /** 保存编辑器文档 */
  @Post()
  @UseGuards(JwtAuthGuard)
  async saveEditorDocument(@Body() editorDocument: SaveEditorDocumentDto) {
    const translateMongoData = {
      name: editorDocument.name,
      editorData: editorDocument.editorData,
    };
    return await this.editorDocumentService.save(translateMongoData);
  }

  /** 获取编辑器文档 */
  /* :id是路径参数占位符，客户端发送一个 GET 请求到 /somePath/123 时，这个处理器会被触发，并且 id 参数会被解析为 123。 */
  /* @Query() 装饰器用于从 HTTP 请求的查询字符串中提取参数。它可以从请求 URL 中获取所有查询参数，并将它们作为对象传递给方法参数 query。例如，如果请求 URL 是 http://example.com/api/posts?filter=active&page=1，那么 query 将是一个包含 filter 和 page 属性的对象 */
  /* @Query获取查询参数，用于get请求, @Param是获取指定路由参数，用于get、post、put、delete请求体参数*/
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getEditorDocument(@Param('id') id: string) {
    return await this.editorDocumentService.getDocumentById(id);
  }

  /** 获取所有文档 */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllEditorDocument() {
    return await this.editorDocumentService.getAllDocuments();
  }

  /** 根据id删除文档 */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteDocumentById(@Param('id') id: string) {
    return await this.editorDocumentService.removeById(id);
  }
}
