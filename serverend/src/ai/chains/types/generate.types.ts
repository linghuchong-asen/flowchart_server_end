// apps/server/src/modules/ai/chains/types/generate.types.ts
import { FlowGraph } from '../../schemas/flow.schema';

export type GenerateInput = {
  userId: string;
  projectId: string;
  input: string;
  selection?: string[];
  ops?: any[];
  context: string; // 已拼好的上下文（系统提示词 + 记忆 + 检索切片）
};

export type GenerateOutput = {
  plan_bullets: string[];
  graph: FlowGraph;
  followups: string[];
};