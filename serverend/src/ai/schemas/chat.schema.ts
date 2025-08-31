// apps/server/src/modules/ai/schemas/chat.schema.ts
export type SseEvent =
  | { type: 'token'; data: string }
  | { type: 'plan'; data: { plan_bullets: string[] } }
  | { type: 'graph_patch'; data: any }
  | { type: 'followups'; data: string[] }
  | { type: 'done'; data: { cost?: { input?: number; output?: number } } }
  | { type: 'error'; data: { message: string } };
