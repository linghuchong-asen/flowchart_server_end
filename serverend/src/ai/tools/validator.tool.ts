// apps/server/src/modules/ai/tools/validator.tool.ts
import { FlowGraphSchema, FlowGraph } from '../schemas/flow.schema';

export class ValidatorTool {
  async validate(graph: unknown): Promise<FlowGraph> {
    const parsed = FlowGraphSchema.safeParse(graph);
    if (!parsed.success) {
      // 简单修复：兜底一个开始节点
      return { nodes: [{ id: 'start', label: '开始', type: 'start' }], edges: [] };
    }
    return parsed.data;
  }
}
