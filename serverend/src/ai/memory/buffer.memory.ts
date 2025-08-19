// apps/server/src/modules/ai/memory/buffer.memory.ts
import { BaseChatMemory, BaseChatMemoryInput } from "@langchain/core/memory";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export interface BufferMemoryInput extends BaseChatMemoryInput {
  redisClient: { 
    lrange: Function; 
    rpush: Function; 
    ltrim: Function 
  };
}

export class BufferMemory extends BaseChatMemory {
  private redisClient: any;
  private sessionId: string;

  constructor(fields: BufferMemoryInput & { sessionId: string }) {
    super(fields);
    this.redisClient = fields.redisClient;
    this.sessionId = fields.sessionId;
  }

  private key() { 
    return `session:${this.sessionId}:buffer`; 
  }

  async append(role: 'user' | 'assistant', content: string) {
    const message = role === 'user' 
      ? new HumanMessage(content) 
      : new AIMessage(content);
      
    await this.redisClient.rpush(this.key(), JSON.stringify({ 
      role, 
      content, 
      t: Date.now() 
    }));
    await this.redisClient.ltrim(this.key(), -12, -1); // 最近 12 条
  }

  async loadMemoryVariables(_values: Record<string, any>): Promise<Record<string, any>> {
    const arr: string[] = await this.redisClient.lrange(this.key(), 0, -1);
    const msgs = arr.map(s => JSON.parse(s));
    const messages: BaseMessage[] = msgs.map(m => 
      m.role === 'user' 
        ? new HumanMessage(m.content) 
        : new AIMessage(m.content)
    );
    
    return { history: messages };
  }

  async saveContext(
    inputValues: Record<string, any>,
    outputValues: Record<string, any>
  ): Promise<void> {
    await this.append('user', Object.values(inputValues)[0]);
    await this.append('assistant', Object.values(outputValues)[0]);
  }

  async clear(): Promise<void> {
    // 清除 Redis 中的会话数据
    // 实现根据具体需求确定
  }
}