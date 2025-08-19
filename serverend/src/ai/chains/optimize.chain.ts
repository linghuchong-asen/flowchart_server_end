// apps/server/src/modules/ai/chains/optimize.chain.ts
import { z } from 'zod';
import { BaseChain } from './base.chain';
import { FlowGraphSchema, FlowGraph } from '../schemas/flow.schema';
import { OptimizeInput } from './types';
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

export type OptimizeChainDeps = {
  tools: {
    validate: (graph: unknown) => Promise<FlowGraph>;
    layout: (graph: FlowGraph) => Promise<FlowGraph>;
  };
  prompts: {
    system: (args: { projectId: string }) => string;
    optimize: (args: { goal: string; graph: FlowGraph }) => string;
  };
};

export class OptimizeChain extends BaseChain {
  private tools: OptimizeChainDeps['tools'];
  private prompts: OptimizeChainDeps['prompts'];

  constructor(llm: BaseLanguageModel, deps: OptimizeChainDeps) {
    super(llm);
    this.tools = deps.tools;
    this.prompts = deps.prompts;
  }

  async run(
    input: OptimizeInput,
    onPartial?: (evt: { type: string; data: any }) => void
  ) {
    const systemPrompt = this.prompts.system({ projectId: input.projectId });
    const optimizePrompt = this.prompts.optimize({ goal: input.goal, graph: input.graph });

    const fullPrompt = PromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["user", "## Context\n{context}\n\n{optimizePrompt}"]
    ]);

    const OutputSchema = z.object({ graph: FlowGraphSchema });
    const parser = new JsonOutputParser();
    const chain = fullPrompt.pipe(this.llm).pipe(parser);

    let latestGraph: FlowGraph | null = null;

    try {
      const response = await chain.invoke({
        context: input.context,
        optimizePrompt
      });

      if (response.graph) {
        const validated = await this.tools.validate(response.graph);
        latestGraph = await this.tools.layout(validated);
        onPartial?.({ type: 'graph_patch', data: { op: 'replaceAll', graph: latestGraph } });
      }
    } catch (error) {
      console.error("Error in optimize chain:", error);
    }

    return latestGraph ?? input.graph;
  }
}