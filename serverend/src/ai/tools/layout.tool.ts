// apps/server/src/modules/ai/tools/layout.tool.ts
import { FlowGraph } from '../schemas/flow.schema';

export class LayoutTool {
  async autoLayout(graph: FlowGraph): Promise<FlowGraph> {
    // 占位：真实可用 dagre/layout。这里仅回传 layout 标记，前端也可再布局。
    return { ...graph, layout: graph.layout ?? 'dagre' };
  }
}
