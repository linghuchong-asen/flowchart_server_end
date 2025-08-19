// apps/server/src/modules/ai/prompts/optimize.prompt.ts
import { PromptTemplate } from "@langchain/core/prompts";
import { FlowGraph } from '../schemas/flow.schema';

export const optimizePrompt = PromptTemplate.fromTemplate(`## Task
Optimize the following flow graph for goal = "{goal}".
Return JSON: { "graph": FlowGraph }

## Current Graph
{graph}`);