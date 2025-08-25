// apps/server/src/modules/ai/memory/buffer.memory.ts
import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export interface BufferMemoryInput {
  redisClient: { 
    lrange: Function; 
    rpush: Function; 
    ltrim: Function 
  };
  sessionId: string;
}

export class BufferMemory extends BaseChatMessageHistory {
  private redisClient: any;
  private sessionId: string;

  constructor(fields: BufferMemoryInput) {
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

  // 实现BaseChatMessageHistory的抽象方法
  async getMessages(): Promise<BaseMessage[]> {
    const arr: string[] = await this.redisClient.lrange(this.key(), 0, -1);
    const msgs = arr.map(s => JSON.parse(s));
    const messages: BaseMessage[] = msgs.map(m => 
      m.role === 'user' 
        ? new HumanMessage(m.content) 
        : new AIMessage(m.content)
    );
    
    return messages;
  }

  // 实现BaseChatMessageHistory的抽象方法
  async addMessage(message: BaseMessage): Promise<void> {
    const role = message._getType() === "human" ? "user" : "assistant";
    await this.append(role, message.content);
  }

  async clear(): Promise<void> {
    // 清除 Redis 中的会话数据
    // 实现根据具体需求确定
  }
}