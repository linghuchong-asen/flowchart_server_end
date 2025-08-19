// apps/server/src/modules/ai/chains/base.chain.ts
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, BaseOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { FlowGraph } from "../schemas/flow.schema";

export abstract class BaseChain {
  protected llm: BaseLanguageModel;

  constructor(llm: BaseLanguageModel) {
    this.llm = llm;
  }

  protected createPrompt(template: string) {
    return PromptTemplate.fromTemplate(template);
  }

  protected async executeChain(prompt: PromptTemplate, input: any, parser?: BaseOutputParser<any>) {
    let chain;
    if (parser) {
      chain = prompt.pipe(this.llm).pipe(parser);
    } else {
      chain = prompt.pipe(this.llm);
    }
    
    return await chain.invoke(input);
  }
}