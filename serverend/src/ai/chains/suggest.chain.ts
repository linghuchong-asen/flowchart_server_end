// apps/server/src/modules/ai/chains/suggest.chain.ts
import { BaseChain } from './base.chain';
import { SuggestInput } from './types';
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

export type SuggestChainDeps = {
  prompts: {
    system: (args: { projectId: string }) => string;
    suggest: (args: { input: string; graphSummary: string }) => string;
  };
};

export class SuggestChain extends BaseChain {
  private prompts: SuggestChainDeps['prompts'];

  constructor(llm: BaseLanguageModel, deps: SuggestChainDeps) {
    super(llm);
    this.prompts = deps.prompts;
  }

  async run(args: SuggestInput): Promise<string[]> {
    const systemPrompt = this.prompts.system({ projectId: args.projectId });
    const suggestPrompt = this.prompts.suggest({ 
      input: args.input, 
      graphSummary: args.graphSummary 
    });

    const fullPrompt = PromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["user", suggestPrompt]
    ]);

    const parser = new JsonOutputParser();
    const chain = fullPrompt.pipe(this.llm).pipe(parser);

    try {
      const response = await chain.invoke({});
      // 兜底 & 取前三
      return (response.length ? response : [
        '要不要添加条件分支？', 
        '是否需要泳道/部门？', 
        '要不要生成通知节点？'
      ]).slice(0, 3);
    } catch (error) {
      console.error("Error in suggest chain:", error);
      // 出错时返回默认建议
      return [
        '要不要添加条件分支？', 
        '是否需要泳道/部门？', 
        '要不要生成通知节点？'
      ];
    }
  }
}