// apps/server/src/modules/ai/schemas/flow.schema.ts
import { z } from 'zod';

export const NodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['start', 'task', 'gateway', 'end']),
  lane: z.string().optional(),
  data: z.record(z.string(), z.any()).optional(),
});

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  condition: z.string().optional(),
});

export const FlowGraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  layout: z.enum(['dagre', 'grid', 'manual']).optional(),
});

export type FlowGraph = z.infer<typeof FlowGraphSchema>;
