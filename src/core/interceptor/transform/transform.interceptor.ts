import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  /* context：当前执行上下文
  next:并不是处理当前请求的处理器，而是指在当前拦截器之后的下一个处理器。这可以理解为请求处理链中的下一个环节。 */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context.switchToRpc().getContext();
    context.getArgs();
    context.getClass();
    const body = context.switchToHttp().getRequest().body;
    // console.log('拦截器', body);
    // new Logger('拦截器').log(body);

    context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => ({
        data,
        code: 0,
        message: '请求成功',
      })),
    );
  }
}
