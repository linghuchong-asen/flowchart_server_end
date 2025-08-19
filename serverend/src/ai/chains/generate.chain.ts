// apps/server/src/modules/ai/chains/generate.chain.ts
import { z } from 'zod';
import { BaseChain } from './base.chain';
import { FlowGraphSchema, FlowGraph } from '../schemas/flow.schema';
import { GenerateInput, GenerateOutput } from './types';
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export type GenerateChainDeps = {
  tools: {
    validate: (graph: unknown) => Promise<FlowGraph>;
    layout: (graph: FlowGraph) => Promise<FlowGraph>;
  };
  prompts: {
    system: (args: { projectId: string }) => string;
    generate: (args: { input: string }) => string;
  };
};

export class GenerateChain extends BaseChain {
  private tools: GenerateChainDeps['tools'];
  private prompts: GenerateChainDeps['prompts'];

  constructor(llm: BaseLanguageModel, deps: GenerateChainDeps) {
    super(llm);
    this.tools = deps.tools;
    this.prompts = deps.prompts;
  }

  async run(
    input: GenerateInput,
    onPartial?: (evt: { type: string; data: any }) => void
  ): Promise<GenerateOutput> {
    const systemPrompt = this.prompts.system({ projectId: input.projectId });
    const userPrompt = this.prompts.generate({ input: input.input });

    const fullPrompt = PromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["user", "## Context\n{context}\n\n## User Intent\n{userInput}"]
    ]);

    // 期望大模型最终吐一个结构化对象（含 graph、plan、followups）
    const OutputSchema = z.object({
      plan_bullets: z.array(z.string()).min(1).max(5),
      graph: FlowGraphSchema,
      followups: z.array(z.string()).min(1).max(5),
    });

    const parser = new JsonOutputParser();
    
    let latestPlan: string[] = [];
    let latestFollowups: string[] = [];
    let latestGraph: FlowGraph | null = null;

    try {
      // 使用流式处理
      const stream = await fullPrompt.pipe(this.llm).stream({
        context: input.context,
        userInput: userPrompt
      });

      let accumulatedContent = "";
      for await (const chunk of stream) {
        const content = chunk.content as string;
        if (content) {
          onPartial?.({ type: 'token', data: content });
          accumulatedContent += content;
        }
      }

      // 解析最终结果
      try {
        const parsedData = await parser.parse(accumulatedContent);
        
        if (parsedData.plan_bullets) {
          latestPlan = parsedData.plan_bullets;
          onPartial?.({ type: 'plan', data: { plan_bullets: latestPlan } });
        }
        
        if (parsedData.followups) {
          latestFollowups = parsedData.followups;
          onPartial?.({ type: 'followups', data: latestFollowups });
        }
        
        if (parsedData.graph) {
          // 对局部/完整 graph 做一次校验 + 可选布局修复
          const validated = await this.tools.validate(parsedData.graph);
          const laid = await this.tools.layout(validated);
          latestGraph = laid;
          onPartial?.({ type: 'graph_patch', data: { op: 'replaceAll', graph: laid } });
        }
      } catch (parseError) {
        console.error("Failed to parse structured output:", parseError);
      }
    } catch (error) {
      console.error("Error in generate chain:", error);
    }

    if (!latestGraph) {
      // 若模型没有返回 graph，给一个最小兜底
      latestGraph = await this.tools.layout(
        await this.tools.validate({
          nodes: [{ id: 'start', label: '开始', type: 'start' }],
          edges: [],
        })
      );
    }

    if (latestFollowups.length === 0) {
      latestFollowups = ['需要增加并行网关吗？', '是否需要添加 IT 审批节点？', '要不要生成邮件通知节点？'];
    }

    return {
      plan_bullets: latestPlan.length ? latestPlan : ['识别角色', '生成节点', '连线与条件'],
      graph: latestGraph,
      followups: latestFollowups.slice(0, 3),
    };
  }
}