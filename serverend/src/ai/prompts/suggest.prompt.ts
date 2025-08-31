// apps/server/src/modules/ai/prompts/suggest.prompt.ts
import { PromptTemplate } from "@langchain/core/prompts";

export const suggestPrompt = PromptTemplate.fromTemplate(`Given the user's latest intent:
"{input}"

And the current graph summary:
"{graphSummary}"

Propose 3-5 short follow-up questions (<=16 chars). Return a JSON array of strings.`);