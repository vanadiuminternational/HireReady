import { ProviderUnavailableError, type AiProvider, type ProviderRequest, type ProviderResponse } from './providerTypes.js';

export const disabledLiveProvider: AiProvider = {
  id: 'disabled-live',
  displayName: 'Disabled Live Provider Placeholder',
  live: false,

  async runRecruiterXray(_request: ProviderRequest): Promise<ProviderResponse> {
    throw new ProviderUnavailableError(
      'Live AI provider is not enabled. Configure a real provider adapter only after cost guard, privacy, Data Safety, and credit controls are ready.'
    );
  },
};
