import type {
  AiStorage,
  StoredAiCacheEntry,
  StoredAiRequest,
  StoredAiResult,
  StoredCreditEvent,
  StorageStats,
} from './types.js';

export class MemoryAiStorage implements AiStorage {
  private requests = new Map<string, StoredAiRequest>();
  private results = new Map<string, StoredAiResult>();
  private cache = new Map<string, StoredAiCacheEntry>();
  private creditEvents = new Map<string, StoredCreditEvent>();

  async createRequest(entry: StoredAiRequest): Promise<StoredAiRequest> {
    this.requests.set(entry.requestId, entry);
    return entry;
  }

  async updateRequest(requestId: string, patch: Partial<StoredAiRequest>): Promise<StoredAiRequest | null> {
    const existing = this.requests.get(requestId);
    if (!existing) return null;

    const updated: StoredAiRequest = {
      ...existing,
      ...patch,
      requestId: existing.requestId,
      updatedAt: new Date().toISOString(),
    };
    this.requests.set(requestId, updated);
    return updated;
  }

  async getRecentRequests(limit: number): Promise<StoredAiRequest[]> {
    return Array.from(this.requests.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async saveResult(entry: StoredAiResult): Promise<StoredAiResult> {
    this.results.set(entry.resultId, entry);
    return entry;
  }

  async getCacheEntry(inputHash: string): Promise<StoredAiCacheEntry | null> {
    const cached = this.cache.get(inputHash);
    if (!cached) return null;

    const updated: StoredAiCacheEntry = { ...cached, hits: cached.hits + 1 };
    this.cache.set(inputHash, updated);
    return updated;
  }

  async setCacheEntry(entry: StoredAiCacheEntry): Promise<StoredAiCacheEntry> {
    this.cache.set(entry.inputHash, entry);
    return entry;
  }

  async recordCreditEvent(entry: StoredCreditEvent): Promise<StoredCreditEvent> {
    this.creditEvents.set(entry.eventId, entry);
    return entry;
  }

  async getStats(): Promise<StorageStats> {
    return {
      requests: this.requests.size,
      results: this.results.size,
      cacheEntries: this.cache.size,
      creditEvents: this.creditEvents.size,
    };
  }
}

export const aiStorage = new MemoryAiStorage();
