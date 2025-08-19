// apps/server/src/modules/ai/memory/memory.factory.ts
import { BufferMemory } from './buffer.memory';
import { SummaryMemory } from './summary.memory';
import { VectorMemory } from './vector.memory';

// 更新上下文拼接工厂函数以适配新的 LangChain 内存组件
export function buildContextStitcher(deps: {
  buffer: BufferMemory;
  summary: SummaryMemory;
  vector: VectorMemory;
}) {
  return async function assemble({
    sessionId,
    projectId,
    userInput,
  }: {
    sessionId: string;
    projectId: string;
    userInput: string;
  }): Promise<string> {
    // 从 LangChain 内存组件中获取数据
    const bufferData = await deps.buffer.loadMemoryVariables({});
    const summaryData = await deps.summary.loadMemoryVariables({});
    const vectorData = await deps.vector.getRelevantDocuments(userInput);
    
    const bufferText = Array.isArray(bufferData.history) 
      ? bufferData.history.map((msg: any) => `${msg._getType().toUpperCase()}: ${msg.content}`).join('\n')
      : '';
      
    const summaryText = summaryData.summary || '';
    const vectorText = vectorData.map(doc => `- ${doc.pageContent}`).join('\n');
    
    return [
      summaryText && `## Summary\n${summaryText}`,
      bufferText && `## Recent Turns\n${bufferText}`,
      vectorText && `## Retrieved\n${vectorText}`,
    ].filter(Boolean).join('\n\n');
  };
}