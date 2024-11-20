import { ConfigService } from '@nestjs/config';
import { Module, Inject } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // es中节点地址，当是多节点时可以将node设置为数组
        node: config.get('ES_NODE'),
        auth: {
          username: config.get('ELASTICSEARCH_USERNAME'),
          password: config.get('ELASTICSEARCH_PASSWORD'),
        },
      }),
    }),
  ],
})
export class ProjectSearchModule {}
