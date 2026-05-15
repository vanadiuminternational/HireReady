import { createHash } from 'node:crypto';

export function stableHash(input: unknown): string {
  const raw = typeof input === 'string' ? input : JSON.stringify(input, Object.keys(input as Record<string, unknown>).sort());
  return createHash('sha256').update(raw).digest('hex');
}

export function buildActionInputHash(actionId: string, cvText: string, jobDescription: string): string {
  return stableHash({
    actionId,
    cvText: cvText.trim().replace(/\s+/g, ' '),
    jobDescription: jobDescription.trim().replace(/\s+/g, ' '),
  });
}
