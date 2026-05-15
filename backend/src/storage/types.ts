import type { RecruiterXrayResult } from '../schemas/recruiterXray.js';

export type StoredAiRequest = {
  requestId: string;
  actionId: string;
  inputHash: string;
  status: string;
  routeProvider?: string;
  modelTier?: string;
  creditsReserved?: number;
  creditsCharged?: number;
  cacheHit?: boolean;
  errorType?: string;
  latencyMs?: number;
  createdAt: string;
  updatedAt: string;
};

export type StoredAiResult = {
  resultId: string;
  requestId: string;
  actionId: string;
  inputHash: string;
  resultJson: RecruiterXrayResult;
  resultSummary: string;
  createdAt: string;
};

export type StoredAiCacheEntry = {
  inputHash: string;
  actionId: string;
  result: RecruiterXrayResult;
  createdAt: string;
  hits: number;
};

export type StoredCreditEvent = {
  eventId: string;
  requestId: string;
  actionId: string;
  type: 'reserved' | 'charged' | 'refunded';
  credits: number;
  createdAt: string;
};

export type StorageStats = {
  requests: number;
  results: number;
  cacheEntries: number;
  creditEvents: number;
};

export interface AiStorage {
  createRequest(entry: StoredAiRequest): Promise<StoredAiRequest>;
  updateRequest(requestId: string, patch: Partial<StoredAiRequest>): Promise<StoredAiRequest | null>;
  getRecentRequests(limit: number): Promise<StoredAiRequest[]>;

  saveResult(entry: StoredAiResult): Promise<StoredAiResult>;

  getCacheEntry(inputHash: string): Promise<StoredAiCacheEntry | null>;
  setCacheEntry(entry: StoredAiCacheEntry): Promise<StoredAiCacheEntry>;

  recordCreditEvent(entry: StoredCreditEvent): Promise<StoredCreditEvent>;

  getStats(): Promise<StorageStats>;
}
