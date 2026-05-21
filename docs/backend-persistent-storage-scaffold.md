# Backend Persistent Storage Scaffold

This document describes the first storage abstraction for the GradSharp AI backend.

## Current purpose

The backend currently uses in-memory request logs and cache. That is useful for local testing, but it disappears when the server restarts.

This scaffold introduces storage contracts so the backend can later move to SQLite or PostgreSQL without changing the AI route shape.

## Added contracts

```text
backend/src/storage/types.ts
backend/src/storage/memoryStorage.ts
```

The storage interface covers:

- AI requests
- AI results
- AI cache entries
- credit events
- storage statistics

## Current implementation

The current implementation is still in-memory:

```text
MemoryAiStorage
```

This is intentional. It keeps the mock backend simple while defining the future persistence boundary.

## Future implementation options

### Option A — SQLite first

Good for a small VPS and early paid beta.

Pros:

- cheap
- simple
- no separate database server
- easy backups

Cons:

- not ideal for high concurrency later

### Option B — PostgreSQL

Better for a more serious SaaS backend.

Pros:

- stronger multi-user foundation
- better analytics queries
- easier scaling path

Cons:

- more setup and maintenance

## Recommended next storage PR

Add SQLite implementation behind the same `AiStorage` interface.

Do not add live AI provider calls in the same PR.

## Production requirements before live AI

Before live AI is enabled, persistence should support:

- request status tracking
- credit reservation and charge records
- AI result storage
- provider usage records
- cache lookup by input hash
- error tracking
- audit-friendly timestamps

## Guardrails

This scaffold does not add:

- live AI
- provider keys
- payment logic
- user accounts
- subscriptions
- provider SDKs
