// apps/server/src/modules/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import * as Prompts from './prompts';
import { buildContextStitcher } from './memory/memory.factory';
import { BufferMemory } from './memory/buffer.memory';
import { SummaryMemory } from './memory/summary/summary.memory';
import { VectorMemory } from './memory/vector.memory';
import { toSseObservable } from './adapters';
import { LayoutTool } from './tools/layout.tool';
import { ValidatorTool } from './tools/validator.tool';
import { QwenAdapter } from './adapters/qwen.adapter';
import { GenerateChain } from './chains/generate.chain';
import { GenerateInput } from './chains/types';

@Injectable()
export class AiService {
  // 真实项目里替换为注入的实例（Redis 客户端、向量库客户端、Qwen SDK 等）
  private buffer = new BufferMemory({
    lrange: async () => [],
    rpush: async () => {},
    ltrim: async () => {},
  });
  private summary = new SummaryMemory({
    get: async () => '',
    set: async () => {},
  });
  private vector = new VectorMemory({
    query: async () => [],
  });
  private contextStitch = buildContextStitcher({
    buffer: this.buffer,
    summary: this.summary,
    vector: this.vector,
  });

  // 使用新的 Qwen 适配器
  private llmAdapter = new QwenAdapter({
    apiKey: process.env.DASHSCOPE_API_KEY || 'your-api-key-here',
    baseUrl: process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: process.env.QWEN_MODEL || "qwen-plus"
  });

  private validator = new ValidatorTool();
  private layout = new LayoutTool();

  streamGenerate(dto: {
    userId: string;
    projectId: string;
    input: string;
    selection?: string[];
    ops?: any[];
    sessionId?: string;
  }) {
    const sessionId = dto.sessionId ?? `${dto.userId}:${dto.projectId}`;

    return toSseObservable((push, done, fail) => {
      (async () => {
        try {
          // 1) 组上下文
          const context = await this.contextStitch({
            sessionId,
            projectId: dto.projectId,
            userInput: dto.input,
          });

          // 2) 创建生成链并运行（边流边推送）
          const generateChain = new GenerateChain(this.llmAdapter.model, {
            tools: {
              validate: (g) => this.validator.validate(g),
              layout: (g) => this.layout.autoLayout(g),
            },
            prompts: Prompts
          });

          const input: GenerateInput = {
            userId: dto.userId,
            projectId: dto.projectId,
            input: dto.input,
            selection: dto.selection,
            ops: dto.ops,
            context,
          };

          const out = await generateChain.run(
            input,
            (evt) => push(evt as any)
          );

          // 3) 持久化：把用户输入与简要结果追加到记忆（示例）
          await this.buffer.append(sessionId, 'user', dto.input);
          await this.buffer.append(sessionId, 'assistant', JSON.stringify(out.plan_bullets));

          // 4) 收尾
          done({ type: 'done', data: { cost: { input: 0, output: 0 } } });
        } catch (e: any) {
          push({ type: 'error', data: { message: e?.message || 'AI 生成失败' } });
          done();
        }
      })().catch(fail);
    });
  }
}