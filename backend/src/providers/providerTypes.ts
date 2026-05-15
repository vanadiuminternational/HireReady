import type { ModelTier } from '../orchestrator/actions.js';
import type { RecruiterXrayResult } from '../schemas/recruiterXray.js';

export type ProviderRequest = {
  actionId: string;
  cvText: string;
  jobDescription: string;
  modelTier: ModelTier;
  maxOutputTokens: number;
};

export type ProviderResponse = {
  provider: string;
  model: string;
  result: RecruiterXrayResult;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cachedInputTokens: number;
    estimatedCostCents: number;
  };
  latencyMs: number;
};

export interface AiProvider {
  id: string;
  runRecruiterXray(request: ProviderRequest): Promise<ProviderResponse>;
}
