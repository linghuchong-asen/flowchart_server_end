// apps/server/src/modules/ai/memory/summary.memory.ts
import { BaseChatMemory, BaseChatMemoryInput } from "@langchain/core/memory";
import { BaseMessage } from "@langchain/core/messages";

export interface SummaryMemoryInput extends BaseChatMemoryInput {
  kvStore: { get: Function; set: Function };
}

export class SummaryMemory extends BaseChatMemory {
  private kvStore: any;
  private sessionId: string;

  constructor(fields: SummaryMemoryInput & { sessionId: string }) {
    super(fields);
    this.kvStore = fields.kvStore;
    this.sessionId = fields.sessionId;
  }

  private key() { 
    return `session:${this.sessionId}:summary`; 
  }

  async getSummary(): Promise<string> {
    return (await this.kvStore.get(this.key())) || '';
  }

  async setSummary(summary: string) {
    await this.kvStore.set(this.key(), summary);
  }

  async loadMemoryVariables(_values: Record<string, any>): Promise<Record<string, any>> {
    const summary = await this.getSummary();
    return { summary };
  }

  async saveContext(
    inputValues: Record<string, any>,
    outputValues: Record<string, any>
  ): Promise<void> {
    // 在实际实现中，这里可能需要调用摘要链来生成新的摘要
    // 简化起见，我们只保存最后一次交互
    const input = Object.values(inputValues)[0];
    const output = Object.values(outputValues)[0];
    const summary = `用户: ${input}\n助手: ${output}`;
    await this.setSummary(summary);
  }

  async clear(): Promise<void> {
    await this.kvStore.set(this.key(), '');
  }
}