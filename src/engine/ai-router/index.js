import { AI_ACTIONS } from '../credits';

export const AI_PROVIDERS = {
  anthropic: {
    id: 'anthropic',
    label: 'Anthropic Claude',
    supports: ['cheap', 'strong'],
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    supports: ['cheap', 'strong'],
  },
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    supports: ['cheap', 'strong'],
  },
};

export const DEFAULT_ROUTING_POLICY = {
  cheap: {
    preferredProvider: 'openai',
    fallbackProviders: ['anthropic', 'gemini'],
    note: 'Small rewrite, short extraction, or focused polish tasks should route to a low-cost model later.',
  },
  strong: {
    preferredProvider: 'anthropic',
    fallbackProviders: ['openai', 'gemini'],
    note: 'Full-context CV tailoring, recruiter review, and career-story tasks should route to a stronger model later.',
  },
};

export function planAiRequest(actionId, options = {}) {
  const action = AI_ACTIONS[actionId];
  if (!action) {
    return {
      ok: false,
      status: 'unknown-action',
      message: 'Unknown AI action.',
    };
  }

  if (action.credits === 0) {
    return {
      ok: true,
      status: 'rule-only',
      action,
      credits: 0,
      provider: null,
      modelTier: 'none',
      message: 'This action should run locally with rules. No AI call is needed.',
    };
  }

  const policy = DEFAULT_ROUTING_POLICY[action.tier === 'assist' ? 'cheap' : 'strong'];
  const provider = options.provider || policy.preferredProvider;

  return {
    ok: true,
    status: 'backend-required',
    action,
    credits: action.credits,
    provider,
    modelTier: action.tier === 'assist' ? 'cheap' : 'strong',
    fallbackProviders: policy.fallbackProviders,
    message: 'Frontend has planned the AI request. A VPS backend must enforce credits, provider keys, caching, and rate limits before this can run live.',
  };
}
