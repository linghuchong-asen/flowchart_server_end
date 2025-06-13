// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { Module, Inject, OnModuleInit } from '@nestjs/common';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import { ProjectSearchService } from './project_search.service';
// import { ProjectSearchController } from './project_search.controller';

// @Module({
//   imports: [
//     ElasticsearchModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         // es中节点地址，当是多节点时可以将node设置为数组
//         node: config.get('ES_NODE', 'http://localhost:9200'),
//         auth: {
//           username: config.get('ES_USER', 'elastic'),
//           password: config.get('ES_PASSWD', '123456'),
//         },
//         maxRetries: 10,
//         // 请求超时时间：60s,用于业务请求的验证服务端是否在指定的时间内响应
//         requestTimeout: 60000,
//         // ping超时时间:用于维持长连接的活跃状态，心跳检测
//         pingTimeout: 60000,
//         // 启动时自动检测集群中的节点
//         sniffOnStart: true,
//       }),
//     }),
//   ],
//   controllers: [ProjectSearchController],
//   providers: [ProjectSearchService],
//   exports: [ProjectSearchService],
// })

// /* 模块启动的时候需要执行初始化索引操作，所以需要实现OnModuleInit接口 */
// export class ProjectSearchModule implements OnModuleInit {
//   constructor(private searchService: ProjectSearchService) {}
//   onModuleInit() {
//     this.searchService.createIndex().then();
//   }
// }
