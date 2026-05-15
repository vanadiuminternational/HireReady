import type { AiActionDefinition } from './actions.js';

export type CostGuardInput = {
  action: AiActionDefinition;
  cvText: string;
  jobDescription?: string;
};

export type CostGuardResult = {
  ok: boolean;
  reason?: string;
  inputChars: number;
  maxInputChars: number;
};

export function checkCostGuard({ action, cvText, jobDescription = '' }: CostGuardInput): CostGuardResult {
  const inputChars = cvText.length + jobDescription.length;

  if (!cvText.trim()) {
    return { ok: false, reason: 'CV text is required.', inputChars, maxInputChars: action.maxInputChars };
  }

  if (action.requiresJobDescription && !jobDescription.trim()) {
    return { ok: false, reason: 'Job description is required for this action.', inputChars, maxInputChars: action.maxInputChars };
  }

  if (inputChars > action.maxInputChars) {
    return {
      ok: false,
      reason: `Input is too long for ${action.label}. Please shorten the CV or job description.`,
      inputChars,
      maxInputChars: action.maxInputChars,
    };
  }

  return { ok: true, inputChars, maxInputChars: action.maxInputChars };
}
