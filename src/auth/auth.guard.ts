import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
 * @Description: 自动登录守卫，会调用jwt.strategy.ts策略，可以将用户信息写入到request对象中
 * @Author: yangsen
 * @Date: 2024-11-13 16:28:10
 * @LastEditors: yangsen
 * @LastEditTime: 2024-11-13 17:03:42
 */
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    return request;
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException('身份认证失败');
    }
    return user;
  }
}
