import type { RecruiterXrayResult } from '../schemas/recruiterXray.js';

export type CachedAiResult = {
  inputHash: string;
  actionId: string;
  result: RecruiterXrayResult;
  createdAt: string;
  hits: number;
};

const cache = new Map<string, CachedAiResult>();

export function getCachedResult(inputHash: string): CachedAiResult | null {
  const cached = cache.get(inputHash);
  if (!cached) return null;

  cached.hits += 1;
  cache.set(inputHash, cached);
  return cached;
}

export function setCachedResult(entry: Omit<CachedAiResult, 'createdAt' | 'hits'>): CachedAiResult {
  const cached: CachedAiResult = {
    ...entry,
    createdAt: new Date().toISOString(),
    hits: 0,
  };
  cache.set(entry.inputHash, cached);
  return cached;
}

export function getCacheStats() {
  return {
    entries: cache.size,
  };
}
