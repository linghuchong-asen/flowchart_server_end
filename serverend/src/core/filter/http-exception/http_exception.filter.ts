/*
 * @Description: filter文件，对于捕获到的异常进行处理
 * @Author: yangsen
 * @Date: 2024-11-27 10:29:42
 * @LastEditors: yangsen
 * @LastEditTime: 2025-06-10 09:44:07
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import logger from '../../../utils/log/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /* exception: 捕获到的 HTTP 异常对象。注意是捕获到的异常，比如代码中写了throw new Error或者是validator验证抛出异常，而不是http请求返回的异常。
  host: 当前请求的上下文对象，包含请求和响应的信息。 */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const request = ctx.getRequest();
    const status = exception.getStatus(); // 获取异常状态码
    const exceptionResponse = exception.getResponse(); // 获取异常响应数据,这个只是错误信息，ctx.getResponse()获取的是response对象
    let validateMessage: string;
    if (typeof exceptionResponse === 'object') {
      validateMessage = exceptionResponse['message'];
    }

    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Server Error' : 'Client Error'}`;
    const errorResponse = {
      code: -1,
      data: {},
      message: validateMessage || message,
      request: `${ctx.getRequest().method} ${ctx.getRequest().url}`,
    };

    // 记录错误日志
    logger.error(validateMessage || message);

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
