import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
 * @Description: 身份认证守卫，会调用jwt.strategy.ts策略，可以将用户信息写入到request对象中
 * @Author: yangsen
 * @Date: 2024-11-13 16:28:10
 * @LastEditors: yangsen
 * @LastEditTime: 2024-11-14 14:46:49
 */
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    return request;
  }

  /* JwtStrategy中的validate 方法：负责解析和验证 JWT 令牌，返回用户信息。
  handleRequest 方法：负责处理 validate 方法的返回结果，将用户信息添加到请求对象 req 上，并处理验证失败的情况。 */
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
