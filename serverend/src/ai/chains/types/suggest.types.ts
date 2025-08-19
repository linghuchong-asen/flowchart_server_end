// apps/server/src/modules/ai/chains/types/suggest.types.ts

export type SuggestInput = {
  projectId: string;
  input: string;
  graphSummary: string;
};

export type SuggestOutput = string[];