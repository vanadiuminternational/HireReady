export const AI_TIERS = {
  rule: {
    id: 'rule',
    label: 'Free logic',
    credits: 0,
    modelTier: 'none',
    description: 'Uses HireReady rules and local checks. No AI call and no credits.',
  },
  assist: {
    id: 'assist',
    label: 'AI Assist',
    credits: 1,
    modelTier: 'cheap',
    description: 'Small focused rewrite or improvement. Designed for low-cost model routing later.',
  },
  premium: {
    id: 'premium',
    label: 'Premium AI',
    credits: 4,
    modelTier: 'strong',
    description: 'Full-context reasoning or generation. Uses stronger model routing later.',
  },
};

export const AI_ACTIONS = {
  buildSkeleton: {
    id: 'buildSkeleton',
    label: 'Build recommended CV structure',
    tier: 'rule',
    credits: 0,
    requiresConfirmation: false,
    reason: 'Region and category rules are enough. No AI needed.',
  },
  checkCvRules: {
    id: 'checkCvRules',
    label: 'Check CV rules',
    tier: 'rule',
    credits: 0,
    requiresConfirmation: false,
    reason: 'Uses built-in regional and ATS-safe checks.',
  },
  improveBullet: {
    id: 'improveBullet',
    label: 'Improve this bullet',
    tier: 'assist',
    credits: 1,
    requiresConfirmation: false,
    reason: 'Small rewrite of one bullet point.',
  },
  rewriteSummary: {
    id: 'rewriteSummary',
    label: 'Rewrite this summary',
    tier: 'assist',
    credits: 1,
    requiresConfirmation: false,
    reason: 'Short focused rewrite.',
  },
  careerStoryToCv: {
    id: 'careerStoryToCv',
    label: 'Turn career story into CV content',
    tier: 'premium',
    credits: 4,
    requiresConfirmation: true,
    reason: 'Uses full-context AI to turn messy experience into structured CV material.',
  },
  tailorCvToJob: {
    id: 'tailorCvToJob',
    label: 'Tailor CV to this job',
    tier: 'premium',
    credits: 4,
    requiresConfirmation: true,
    reason: 'Uses the CV and job description together, so it is a higher-value AI call.',
  },
  generateCoverLetter: {
    id: 'generateCoverLetter',
    label: 'Generate cover letter',
    tier: 'premium',
    credits: 3,
    requiresConfirmation: true,
    reason: 'Uses CV and job context to generate a personalised letter.',
  },
  recruiterXRay: {
    id: 'recruiterXRay',
    label: 'Recruiter X-Ray',
    tier: 'premium',
    credits: 5,
    requiresConfirmation: true,
    reason: 'Uses deeper review of CV and job description from a recruiter perspective.',
  },
};

export function getAiAction(actionId) {
  return AI_ACTIONS[actionId] || null;
}

export function getActionCostLabel(actionId) {
  const action = getAiAction(actionId);
  if (!action) return 'Unknown action';
  if (action.credits === 0) return `${action.label} · Free`;
  return `${action.label} · ${action.credits} credit${action.credits === 1 ? '' : 's'}`;
}

export function canRunAction({ actionId, creditBalance = 0 }) {
  const action = getAiAction(actionId);
  if (!action) return { ok: false, reason: 'Unknown AI action.' };
  if (action.credits === 0) return { ok: true, reason: 'No credits needed.' };
  if (creditBalance >= action.credits) return { ok: true, reason: 'Enough credits available.' };
  return {
    ok: false,
    reason: `This action needs ${action.credits} credit${action.credits === 1 ? '' : 's'}, but only ${creditBalance} available.`,
  };
}
