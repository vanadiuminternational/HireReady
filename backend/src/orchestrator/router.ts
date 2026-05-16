import type { AiActionDefinition, ModelTier } from './actions.js';
import { config } from '../config.js';
import { getConfiguredProvider } from '../providers/providerRegistry.js';

export type RoutePlan = {
  provider: 'mock' | 'disabled-live';
  modelTier: ModelTier;
  model: string;
  liveEnabled: boolean;
  reason: string;
};

export function planRoute(action: AiActionDefinition): RoutePlan {
  const modelTier: ModelTier = action.allowedModelTiers.includes('T2') ? 'T2' : action.allowedModelTiers[0] ?? 'T0';
  const provider = getConfiguredProvider();

  if (provider.id === 'disabled-live') {
    return {
      provider: 'disabled-live',
      modelTier,
      model: 'disabled-live-provider-placeholder',
      liveEnabled: config.aiLiveEnabled,
      reason: 'Live AI flag is present, but no real provider adapter is enabled yet.',
    };
  }

  return {
    provider: 'mock',
    modelTier,
    model: 'mock-recruiter-xray-v1',
    liveEnabled: config.aiLiveEnabled,
    reason: 'Mock provider selected for safe scaffold testing.',
  };
}
