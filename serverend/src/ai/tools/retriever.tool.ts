// apps/server/src/modules/ai/tools/retriever.tool.ts
import { RetrievedSnippet } from '../memory/vector.memory';

export class RetrieverTool {
  constructor(
    private readonly vector: {
      query: (args: { projectId: string; text: string; topK: number }) => Promise<RetrievedSnippet[]>;
    }
  ) {}
  async retrieve(projectId: string, query: string, topK = 6) {
    return this.vector.query({ projectId, text: query, topK });
  }
}
