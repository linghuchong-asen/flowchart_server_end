import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http_exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  // 注册全局管道
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // 如果需要发送 cookies 或认证头，设置为 true
  });

  // swagger文档
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Nest.js API')
    .setDescription('Nest.js API description')
    .setVersion('1.0')
    .addTag('Nest.js')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions, {
    // ignoreGlobalPrefix: false,
    // deepScanRoutes: false  // 添加此选项，避免深度扫描可能有问题的路由
  });
  SwaggerModule.setup('api', app, document);

  // process是nodejs的全局变量
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
