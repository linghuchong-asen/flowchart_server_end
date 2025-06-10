/*
 * @Description: 拦截器可以访问到控制器的返回值，这里对响应数据进行处理，统一返回格式
 * @Author: yangsen
 * @Date: 2024-12-10 09:31:18
 * @LastEditors: yangsen
 * @LastEditTime: 2025-06-10 09:44:24
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

const logger = new Logger('拦截器');

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
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

    // 判断是否需要跳过全局拦截器; context.getHandler()返回的是当前的路由
    const isSkip = this.reflector.get('skipInterceptor', context.getHandler());
    logger.log(
      '是否跳过全局拦截器',
      isSkip,
      JSON.stringify(context.getHandler()),
    );
    if (isSkip) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // 移除响应头中的ETag字段
        const response = context.switchToHttp().getResponse();
        // response.setHeader('ContentDisposition', 'attachment');
        // response.setHeader('Content-Type', 'application/octet-stream');
        // response.removeHeader('ETag');
        // logger.log(
        //   'interceptor响应数据',
        //   typeof data === 'string' ? data : JSON.stringify(data),
        // );
        return {
          code: 0,
          data,
          message: '请求成功',
        };
      }),
    );
  }
}
