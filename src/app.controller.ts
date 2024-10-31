import { Controller, Delete, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // 因为在service文件中使用@Injectable()装饰器，所以这里可以直接调用service中的方法
    return this.appService.getHello();
  }

  @Delete()
  delete(){}
}
