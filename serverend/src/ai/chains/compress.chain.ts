/*
 * @Description: 会话压缩、摘要
 * @Author: yangsen
 * @Date: 2025-08-19 14:20:29
 * @LastEditors: yangsen
 * @LastEditTime: 2025-08-19 15:51:49
 */
// apps/server/src/modules/ai/chains/compress.chain.ts
import { BaseChain } from './base.chain';
import { CompressInput } from './types';
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export type CompressChainDeps = {
  prompts: {
    system: (args: { projectId: string }) => string;
    compress: (args: { history: string }) => string;
  };
};

export class CompressChain extends BaseChain {
  private prompts: CompressChainDeps['prompts'];

  constructor(llm: BaseLanguageModel, deps: CompressChainDeps) {
    super(llm);
    this.prompts = deps.prompts;
  }

  async run(
    input: CompressInput
  ): Promise<string> {
    const systemPrompt = this.prompts.system({ projectId: input.projectId });
    const compressPrompt = this.prompts.compress({ history: input.history });

    const fullPrompt = PromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["user", compressPrompt]
    ]);

    const parser = new StringOutputParser();
    const chain = fullPrompt.pipe(this.llm).pipe(parser);

    try {
      const summary = await chain.invoke({});
      return summary.trim().slice(0, 4000); // 控长度
    } catch (error) {
      console.error("Error in compress chain:", error);
      return "";
    }
  }
}
