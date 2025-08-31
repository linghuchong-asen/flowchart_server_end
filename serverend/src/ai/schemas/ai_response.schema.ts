// apps/server/src/modules/ai/schemas/ai-response.schema.ts
import { FlowGraphSchema } from './flow.schema';
import { z } from 'zod';

export const AiGenerateResponseSchema = z.object({
  plan_bullets: z.array(z.string()),
  graph: FlowGraphSchema,
  followups: z.array(z.string()),
});
