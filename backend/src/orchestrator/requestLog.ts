export type AiRequestStatus = 'started' | 'cache_hit' | 'provider_called' | 'validated' | 'charged' | 'refunded' | 'failed';

export type AiRequestLogEntry = {
  requestId: string;
  actionId: string;
  inputHash: string;
  status: AiRequestStatus;
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

const requestLog = new Map<string, AiRequestLogEntry>();

export function createRequestLog(actionId: string, inputHash: string): AiRequestLogEntry {
  const now = new Date().toISOString();
  const entry: AiRequestLogEntry = {
    requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    actionId,
    inputHash,
    status: 'started',
    createdAt: now,
    updatedAt: now,
  };
  requestLog.set(entry.requestId, entry);
  return entry;
}

export function updateRequestLog(requestId: string, patch: Partial<AiRequestLogEntry>): AiRequestLogEntry | null {
  const existing = requestLog.get(requestId);
  if (!existing) return null;

  const updated: AiRequestLogEntry = {
    ...existing,
    ...patch,
    requestId: existing.requestId,
    updatedAt: new Date().toISOString(),
  };
  requestLog.set(requestId, updated);
  return updated;
}

export function getRecentRequestLogs(limit = 25): AiRequestLogEntry[] {
  return Array.from(requestLog.values())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getRequestLogStats() {
  const entries = Array.from(requestLog.values());
  return {
    total: entries.length,
    cacheHits: entries.filter((entry) => entry.cacheHit).length,
    charged: entries.filter((entry) => entry.status === 'charged').length,
    failed: entries.filter((entry) => entry.status === 'failed').length,
  };
}
