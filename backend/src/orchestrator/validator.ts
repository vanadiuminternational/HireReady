import { recruiterXrayResultSchema, type RecruiterXrayResult } from '../schemas/recruiterXray.js';

export type ValidationResult = {
  ok: boolean;
  result?: RecruiterXrayResult;
  reason?: string;
};

export function validateRecruiterXrayResult(payload: unknown): ValidationResult {
  const parsed = recruiterXrayResultSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      reason: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '),
    };
  }

  return { ok: true, result: parsed.data };
}
