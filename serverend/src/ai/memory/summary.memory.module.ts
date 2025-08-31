import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationSummary } from './conversation_summary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationSummary])],
  exports: [TypeOrmModule],
})
export class SummaryMemoryModule {}