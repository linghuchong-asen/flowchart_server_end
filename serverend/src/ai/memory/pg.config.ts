import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConversationSummary } from './conversation_summary.entity';

export const PgSummaryConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST', 'localhost'),
    port: configService.get<number>('PG_PORT', 5432),
    username: configService.get('PG_USER', 'postgres'),
    password: configService.get('PG_PASSWD', 'postgres'),
    database: configService.get('PG_DATABASE', 'flowchart_editor'),
    entities: [ConversationSummary],
    synchronize: true, // 在生产环境中应设置为 false
    logging: false,
  }),
});