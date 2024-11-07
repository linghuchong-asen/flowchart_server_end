import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  /* context：当前执行上下文
  next:并不是处理当前请求的处理器，而是指在当前拦截器之后的下一个处理器。这可以理解为请求处理链中的下一个环节。 */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        data,
        code: 0,
        message: '请求成功',
      })),
    );
  }
}
