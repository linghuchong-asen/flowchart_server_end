// apps/server/src/modules/ai/memory/vector.memory.ts
import { BaseRetriever, BaseRetrieverInput } from "@langchain/core/retrievers";
import { Document } from "@langchain/core/documents";

export interface VectorMemoryInput extends BaseRetrieverInput {
  client: {
    query: (args: { projectId: string; text: string; topK: number }) => Promise<Array<{ id: string; text: string; score: number }>>;
  };
}

export class VectorMemory extends BaseRetriever {
  private client: any;
  private projectId: string;

  constructor(fields: VectorMemoryInput & { projectId: string }) {
    super(fields);
    this.client = fields.client;
    this.projectId = fields.projectId;
  }

  async _getRelevantDocuments(query: string): Promise<Document[]> {
    try {
      const results = await this.client.query({ 
        projectId: this.projectId, 
        text: query, 
        topK: 6 
      });
      
      return results.map(item => 
        new Document({
          pageContent: item.text,
          metadata: { id: item.id, score: item.score }
        })
      );
    } catch (error) {
      console.error("Error retrieving documents:", error);
      return [];
    }
  }
}