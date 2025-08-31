// apps/server/src/modules/ai/adapters/qwen.adapter.ts
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { BaseLanguageModel } from "@langchain/core/language_models/base";

/**
 * QwenAdapter: 使用 LangChain 集成通义千问模型
 */
export class QwenAdapter {
  private llm: ChatOpenAI;
  
  constructor(
    private readonly config: {
      apiKey: string;
      baseUrl?: string;
      model?: string;
    }
  ) {
    this.llm = new ChatOpenAI({
      openAIApiKey: config.apiKey,
      configuration: {
        baseURL: config.baseUrl || "https://dashscope.aliyuncs.com/compatible-mode/v1",
      },
      model: config.model || "qwen-plus",
      streaming: true,
    });
  }

  get model(): BaseLanguageModel {
    return this.llm;
  }

  async *streamObject(args: { schema: z.ZodTypeAny; prompt: string }):
    AsyncIterable<{ type: 'text' | 'object'; data: any }> {
    
    const parser = new JsonOutputParser({ schema: args.schema });
    
    try {
      let accumulatedContent = "";
      
      const response = await this.llm.invoke([
        ["user", args.prompt]
      ], {
        callbacks: [
          {
            async handleLLMNewToken(token: string) {
              yield { type: 'text', data: token };
              accumulatedContent += token;
            }
          }
        ]
      });
      
      // 尝试解析最终的结构化输出
      try {
        const parsedData = await parser.parse(accumulatedContent);
        yield { type: 'object', data: parsedData };
      } catch (parseError) {
        console.error("Failed to parse structured output:", parseError);
      }
    } catch (error) {
      console.error("Error in streamObject:", error);
      throw error;
    }
  }

  async complete(prompt: string): Promise<string[]> {
    try {
      const response = await this.llm.invoke([
        ["user", prompt]
      ]);
      
      const content = response.content as string;
      try {
        const arr = JSON.parse(content);
        return Array.isArray(arr) ? arr.map(String) : [content];
      } catch {
        return content.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 5);
      }
    } catch (error) {
      console.error("Error in complete:", error);
      return [];
    }
  }

  async completeText(prompt: string): Promise<string> {
    try {
      const response = await this.llm.invoke([
        ["user", prompt]
      ]);
      return response.content as string || '';
    } catch (error) {
      console.error("Error in completeText:", error);
      return '';
    }
  }
}