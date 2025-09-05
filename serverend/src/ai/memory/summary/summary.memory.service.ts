// apps/server/src/modules/ai/memory/summary.memory.ts
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConversationSummary } from './conversation_summary.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface SummaryMemoryInput {
  kvStore: { get: Function; set: Function };
  sessionId: string;
}

export interface SaveContextInput {
  inputValues: Record<string, any>;
  outputValues: Record<string, any>;
  projectId?: string;
}

@Injectable()
export class SummaryMemoryService {
  private kvStore: any;
  private sessionId: string;
  private summaryRepository?: Repository<ConversationSummary>;

  constructor(
    fields: SummaryMemoryInput,
    @InjectRepository(ConversationSummary)
    summaryRepository?: Repository<ConversationSummary>,
  ) {
    this.kvStore = fields.kvStore;
    this.sessionId = fields.sessionId;
    this.summaryRepository = summaryRepository;
  }

  private key() {
    return `session:${this.sessionId}:summary`;
  }

  async getSummary(): Promise<string> {
    // 如果配置了PostgreSQL仓库，则优先使用数据库
    if (this.summaryRepository) {
      try {
        const summaryEntity = await this.summaryRepository.findOne({
          where: { sessionId: this.sessionId },
        });
        return summaryEntity?.summary || '';
      } catch (error) {
        console.warn(
          'Failed to get summary from database, falling back to kvStore:',
          error,
        );
      }
    }

    // 否则使用原有的kvStore
    return (await this.kvStore.get(this.key())) || '';
  }

  async setSummary(summary: string, projectId?: string): Promise<void> {
    // 如果配置了PostgreSQL仓库，则优先使用数据库
    if (this.summaryRepository) {
      try {
        let summaryEntity = await this.summaryRepository.findOne({
          where: { sessionId: this.sessionId },
        });

        if (summaryEntity) {
          // 更新现有记录
          summaryEntity.summary = summary;
          summaryEntity.projectId = projectId;
          await this.summaryRepository.save(summaryEntity);
        } else {
          // 创建新记录
          summaryEntity = this.summaryRepository.create({
            sessionId: this.sessionId,
            summary,
            projectId,
          });
          await this.summaryRepository.save(summaryEntity);
        }
        return;
      } catch (error) {
        console.warn(
          'Failed to save summary to database, falling back to kvStore:',
          error,
        );
      }
    }

    // 否则使用原有的kvStore
    await this.kvStore.set(this.key(), summary);
  }

  async loadMemoryVariables(
    _values: Record<string, any>,
  ): Promise<Record<string, any>> {
    const summary = await this.getSummary();
    return { summary };
  }

  async saveContext(inputObj: SaveContextInput): Promise<void> {
    const input = Object.values(inputObj.inputValues)[0];
    const output = Object.values(inputObj.outputValues)[0];
    const projId = inputObj.projectId;

    // 在实际实现中，这里可能需要调用摘要链来生成新的摘要
    // 简化起见，我们只保存最后一次交互
    const summary = `用户: ${input}\n助手: ${output}`;
    await this.setSummary(summary, projId);
  }

  async clear(): Promise<void> {
    // 如果配置了PostgreSQL仓库，则优先使用数据库
    if (this.summaryRepository) {
      try {
        await this.summaryRepository.delete({ sessionId: this.sessionId });
        return;
      } catch (error) {
        console.warn(
          'Failed to clear summary from database, falling back to kvStore:',
          error,
        );
      }
    }

    // 否则使用原有的kvStore
    await this.kvStore.set(this.key(), '');
  }
}
