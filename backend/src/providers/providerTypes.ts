import type { ModelTier } from '../orchestrator/actions.js';
import type { RecruiterXrayResult } from '../schemas/recruiterXray.js';

export type ProviderId = 'mock' | 'disabled-live';

export type ProviderRequest = {
  actionId: string;
  cvText: string;
  jobDescription: string;
  modelTier: ModelTier;
  maxOutputTokens: number;
  requestId?: string;
  inputHash?: string;
};

export type ProviderUsage = {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
  estimatedCostCents: number;
};

export type ProviderResponse = {
  provider: ProviderId | string;
  model: string;
  result: RecruiterXrayResult;
  usage: ProviderUsage;
  latencyMs: number;
};

export interface AiProvider {
  id: ProviderId | string;
  displayName: string;
  live: boolean;
  runRecruiterXray(request: ProviderRequest): Promise<ProviderResponse>;
}

export class ProviderUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderUnavailableError';
  }
}
