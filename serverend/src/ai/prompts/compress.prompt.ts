// apps/server/src/modules/ai/prompts/compress.prompt.ts
import { PromptTemplate } from "@langchain/core/prompts";

export const compressPrompt = PromptTemplate.fromTemplate(`Summarize the chat history into a compact brief to preserve:
- Actors/roles
- Mandatory constraints
- Naming rules
- Open TODOs

Keep < 400 tokens. History:
{history}`);