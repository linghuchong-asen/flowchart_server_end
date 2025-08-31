// apps/server/src/modules/ai/prompts/generate.prompt.ts
import { PromptTemplate } from "@langchain/core/prompts";

export const generatePrompt = PromptTemplate.fromTemplate(`## Task
Based on the user's intent, produce:
1) plan_bullets: 3-5 bullet points of key decisions (concise).
2) graph: flowchart JSON (nodes/edges).
3) followups: 3-5 short, clickable questions.

## User Intent
{input}

## Rules
- Ensure a single start and end if applicable.
- Use gateway for parallel/conditional branches.
- Keep label short (<=12 chars).`);