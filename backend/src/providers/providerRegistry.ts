import { config } from '../config.js';
import { disabledLiveProvider } from './disabledLiveProvider.js';
import { mockProvider } from './mockProvider.js';
import type { AiProvider } from './providerTypes.js';

const providers: Record<string, AiProvider> = {
  mock: mockProvider,
  'disabled-live': disabledLiveProvider,
};

export function listProviders() {
  return Object.values(providers).map((provider) => ({
    id: provider.id,
    displayName: provider.displayName,
    live: provider.live,
  }));
}

export function getProvider(providerId: string): AiProvider {
  return providers[providerId] ?? mockProvider;
}

export function getConfiguredProvider(): AiProvider {
  if (!config.aiLiveEnabled) return mockProvider;

  // Scaffold phase: live mode intentionally resolves to disabled-live until a real
  // provider adapter is added in a future PR behind explicit environment controls.
  return disabledLiveProvider;
}
