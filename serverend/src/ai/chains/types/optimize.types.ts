// apps/server/src/modules/ai/chains/types/optimize.types.ts
import { FlowGraph } from '../../schemas/flow.schema';

export type OptimizeInput = {
  projectId: string;
  graph: FlowGraph;
  goal: 'layout' | 'naming' | 'deduplicate' | 'refactor';
  context: string;
};

export type OptimizeOutput = {
  graph: FlowGraph;
};