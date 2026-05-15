import Database from 'better-sqlite3';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
import type {
  AiStorage,
  StoredAiCacheEntry,
  StoredAiRequest,
  StoredAiResult,
  StoredCreditEvent,
  StorageStats,
} from './types.js';

function nowIso() {
  return new Date().toISOString();
}

function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}

export class SQLiteAiStorage implements AiStorage {
  private db: Database.Database;

  constructor(private readonly filePath: string) {
    mkdirSync(dirname(filePath), { recursive: true });
    this.db = new Database(filePath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.migrate();
  }

  private migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ai_requests (
        request_id TEXT PRIMARY KEY,
        action_id TEXT NOT NULL,
        input_hash TEXT NOT NULL,
        status TEXT NOT NULL,
        route_provider TEXT,
        model_tier TEXT,
        credits_reserved INTEGER,
        credits_charged INTEGER,
        cache_hit INTEGER,
        error_type TEXT,
        latency_ms INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_results (
        result_id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL,
        action_id TEXT NOT NULL,
        input_hash TEXT NOT NULL,
        result_json TEXT NOT NULL,
        result_summary TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_cache (
        input_hash TEXT PRIMARY KEY,
        action_id TEXT NOT NULL,
        result_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        hits INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS credit_events (
        event_id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL,
        action_id TEXT NOT NULL,
        type TEXT NOT NULL,
        credits INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_ai_requests_created_at ON ai_requests(created_at);
      CREATE INDEX IF NOT EXISTS idx_ai_requests_input_hash ON ai_requests(input_hash);
      CREATE INDEX IF NOT EXISTS idx_ai_results_input_hash ON ai_results(input_hash);
      CREATE INDEX IF NOT EXISTS idx_credit_events_request_id ON credit_events(request_id);
    `);
  }

  async createRequest(entry: StoredAiRequest): Promise<StoredAiRequest> {
    this.db.prepare(`
      INSERT INTO ai_requests (
        request_id, action_id, input_hash, status, route_provider, model_tier,
        credits_reserved, credits_charged, cache_hit, error_type, latency_ms,
        created_at, updated_at
      ) VALUES (
        @requestId, @actionId, @inputHash, @status, @routeProvider, @modelTier,
        @creditsReserved, @creditsCharged, @cacheHit, @errorType, @latencyMs,
        @createdAt, @updatedAt
      )
    `).run({ ...entry, cacheHit: entry.cacheHit == null ? null : Number(entry.cacheHit) });
    return entry;
  }

  async updateRequest(requestId: string, patch: Partial<StoredAiRequest>): Promise<StoredAiRequest | null> {
    const existing = await this.getRequest(requestId);
    if (!existing) return null;

    const updated: StoredAiRequest = {
      ...existing,
      ...patch,
      requestId: existing.requestId,
      updatedAt: nowIso(),
    };

    this.db.prepare(`
      UPDATE ai_requests SET
        action_id = @actionId,
        input_hash = @inputHash,
        status = @status,
        route_provider = @routeProvider,
        model_tier = @modelTier,
        credits_reserved = @creditsReserved,
        credits_charged = @creditsCharged,
        cache_hit = @cacheHit,
        error_type = @errorType,
        latency_ms = @latencyMs,
        created_at = @createdAt,
        updated_at = @updatedAt
      WHERE request_id = @requestId
    `).run({ ...updated, cacheHit: updated.cacheHit == null ? null : Number(updated.cacheHit) });

    return updated;
  }

  private async getRequest(requestId: string): Promise<StoredAiRequest | null> {
    const row = this.db.prepare('SELECT * FROM ai_requests WHERE request_id = ?').get(requestId) as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      requestId: String(row.request_id),
      actionId: String(row.action_id),
      inputHash: String(row.input_hash),
      status: String(row.status),
      routeProvider: row.route_provider == null ? undefined : String(row.route_provider),
      modelTier: row.model_tier == null ? undefined : String(row.model_tier),
      creditsReserved: row.credits_reserved == null ? undefined : Number(row.credits_reserved),
      creditsCharged: row.credits_charged == null ? undefined : Number(row.credits_charged),
      cacheHit: row.cache_hit == null ? undefined : Boolean(row.cache_hit),
      errorType: row.error_type == null ? undefined : String(row.error_type),
      latencyMs: row.latency_ms == null ? undefined : Number(row.latency_ms),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }

  async getRecentRequests(limit: number): Promise<StoredAiRequest[]> {
    const rows = this.db.prepare('SELECT request_id FROM ai_requests ORDER BY created_at DESC LIMIT ?').all(limit) as Array<{ request_id: string }>;
    const requests = await Promise.all(rows.map((row) => this.getRequest(row.request_id)));
    return requests.filter((request): request is StoredAiRequest => Boolean(request));
  }

  async saveResult(entry: StoredAiResult): Promise<StoredAiResult> {
    this.db.prepare(`
      INSERT OR REPLACE INTO ai_results (
        result_id, request_id, action_id, input_hash, result_json, result_summary, created_at
      ) VALUES (
        @resultId, @requestId, @actionId, @inputHash, @resultJson, @resultSummary, @createdAt
      )
    `).run({ ...entry, resultJson: JSON.stringify(entry.resultJson) });
    return entry;
  }

  async getCacheEntry(inputHash: string): Promise<StoredAiCacheEntry | null> {
    const row = this.db.prepare('SELECT * FROM ai_cache WHERE input_hash = ?').get(inputHash) as Record<string, unknown> | undefined;
    if (!row) return null;

    const hits = Number(row.hits) + 1;
    this.db.prepare('UPDATE ai_cache SET hits = ? WHERE input_hash = ?').run(hits, inputHash);

    return {
      inputHash: String(row.input_hash),
      actionId: String(row.action_id),
      result: parseJson(String(row.result_json)),
      createdAt: String(row.created_at),
      hits,
    };
  }

  async setCacheEntry(entry: StoredAiCacheEntry): Promise<StoredAiCacheEntry> {
    this.db.prepare(`
      INSERT OR REPLACE INTO ai_cache (input_hash, action_id, result_json, created_at, hits)
      VALUES (@inputHash, @actionId, @resultJson, @createdAt, @hits)
    `).run({
      inputHash: entry.inputHash,
      actionId: entry.actionId,
      resultJson: JSON.stringify(entry.result),
      createdAt: entry.createdAt,
      hits: entry.hits,
    });
    return entry;
  }

  async recordCreditEvent(entry: StoredCreditEvent): Promise<StoredCreditEvent> {
    this.db.prepare(`
      INSERT OR REPLACE INTO credit_events (event_id, request_id, action_id, type, credits, created_at)
      VALUES (@eventId, @requestId, @actionId, @type, @credits, @createdAt)
    `).run(entry);
    return entry;
  }

  async getStats(): Promise<StorageStats> {
    const count = (table: string) => {
      const row = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
      return row.count;
    };

    return {
      requests: count('ai_requests'),
      results: count('ai_results'),
      cacheEntries: count('ai_cache'),
      creditEvents: count('credit_events'),
    };
  }
}
