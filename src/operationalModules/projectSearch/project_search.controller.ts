import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProjectSearchService } from './project_search.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('projectSearch')
export class ProjectSearchController {
  constructor(private readonly searchService: ProjectSearchService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  // 能通过@Query自动获取到searchWord参数吗？答：可以的
  async getProjectList(@Query('searchWord') searchWord: string) {
    return await this.searchService.getProjectList(searchWord);
  }
}
