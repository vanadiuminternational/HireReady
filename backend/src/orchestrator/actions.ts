export type ModelTier = 'T0' | 'T1' | 'T2' | 'T3';

export type AiActionDefinition = {
  actionId: string;
  label: string;
  creditCost: number;
  minUserTier: 'free' | 'starter' | 'pro' | 'career_sprint';
  maxInputChars: number;
  maxOutputTokens: number;
  allowedModelTiers: ModelTier[];
  requiresJobDescription: boolean;
  cacheable: boolean;
  refundPolicy: 'refund_on_failure' | 'charge_on_attempt';
};

export const AI_ACTIONS: Record<string, AiActionDefinition> = {
  recruiter_xray: {
    actionId: 'recruiter_xray',
    label: 'Recruiter X-Ray',
    creditCost: 4,
    minUserTier: 'starter',
    maxInputChars: 24000,
    maxOutputTokens: 1200,
    allowedModelTiers: ['T1', 'T2'],
    requiresJobDescription: true,
    cacheable: true,
    refundPolicy: 'refund_on_failure',
  },
};

export function listAiActions() {
  return Object.values(AI_ACTIONS).map((action) => ({
    actionId: action.actionId,
    label: action.label,
    creditCost: action.creditCost,
    minUserTier: action.minUserTier,
    requiresJobDescription: action.requiresJobDescription,
    cacheable: action.cacheable,
  }));
}

export function getAction(actionId: string) {
  return AI_ACTIONS[actionId];
}
