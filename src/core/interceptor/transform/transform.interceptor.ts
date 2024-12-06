import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

const logger = new Logger('拦截器');

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  /* context：当前执行上下文
  next:并不是处理当前请求的处理器，而是指在当前拦截器之后的下一个处理器。这可以理解为请求处理链中的下一个环节。 */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context.switchToRpc().getContext();
    context.getArgs();
    context.getClass();
    const body = context.switchToHttp().getRequest().body;
    const request = context.switchToHttp().getRequest();
    /* context.switchToHttp().getResponse() 方法用于获取当前 HTTP 响应对象，但这个对象主要用于设置响应的状态码、头信息等，而不是直接获取返回的数据 */
    const response = context.switchToHttp().getResponse();
    // console.log('拦截器', body);
    // new Logger('拦截器').log(body);

    /* 
      不进行格式转换的路由；这种直接返回的方式，在浏览器地址栏访问就直接弹出保存窗口，
      使用next.handle()对返回数据格式转换，前端得到的是一个json对象不会直接调用保存窗口，
      如果使用axios前端需要将blob转换为BlobURL 
    */
    if (/^\/project\/editDataFile/.test(request.url)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // 移除响应头中的ETag字段
        const response = context.switchToHttp().getResponse();
        // response.setHeader('ContentDisposition', 'attachment');
        // response.setHeader('Content-Type', 'application/octet-stream');
        // response.removeHeader('ETag');
        // logger.log(typeof data === 'object' ? JSON.stringify(data) : data);
        return {
          code: 0,
          data,
          message: '请求成功',
        };
      }),
    );
  }
}
