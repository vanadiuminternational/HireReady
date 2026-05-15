import type { AiActionDefinition, ModelTier } from './actions.js';
import { config } from '../config.js';

export type RoutePlan = {
  provider: 'mock';
  modelTier: ModelTier;
  model: string;
  liveEnabled: boolean;
  reason: string;
};

export function planRoute(action: AiActionDefinition): RoutePlan {
  // Scaffold phase: always use mock provider. Live providers are intentionally disabled.
  const modelTier: ModelTier = action.allowedModelTiers.includes('T2') ? 'T2' : action.allowedModelTiers[0] ?? 'T0';

  return {
    provider: 'mock',
    modelTier,
    model: 'mock-recruiter-xray-v1',
    liveEnabled: config.aiLiveEnabled,
    reason: config.aiLiveEnabled
      ? 'Live AI flag is present but scaffold is locked to mock provider.'
      : 'Mock provider selected for safe scaffold testing.',
  };
}
