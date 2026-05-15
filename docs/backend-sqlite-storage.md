# Backend SQLite Storage

This document explains the SQLite storage option for the HireReady AI backend.

## Purpose

SQLite gives the mock AI backend file-backed persistence before we introduce live AI, payments, subscriptions, or user accounts.

It is suitable for:

- early VPS testing
- request logs
- AI result records
- cache entries
- simulated credit events

It is not the final multi-user SaaS data model.

## Enable SQLite

In `backend/.env`:

```text
STORAGE_DRIVER=sqlite
SQLITE_PATH=./data/hireready.sqlite
```

Then run:

```bash
cd backend
npm install
npm run build
npm run dev
```

The backend will create the SQLite file and required tables automatically.

## Tables created

```text
ai_requests
ai_results
ai_cache
credit_events
```

## Test persistence

1. Start backend with SQLite enabled.
2. Run a Recruiter X-Ray request.
3. Check stats:

```bash
curl http://localhost:8787/api/ai/debug/stats
```

4. Stop backend.
5. Start backend again.
6. Check stats again.

Expected:

- storage counts remain available after restart,
- cache entries remain available after restart,
- repeated identical request can return cache behaviour using SQLite-backed storage in future route upgrades.

## Important note

The current route still keeps a lightweight in-memory cache for immediate response speed, while also writing cache records to the selected storage driver.

A future PR should make cache lookup read from the selected storage driver first, then fall back to memory.

## Guardrails

This SQLite storage PR does not add:

- live AI provider calls
- provider API keys
- Stripe
- subscriptions
- user accounts
- Android/frontend changes

## Before live AI

Before enabling live AI, SQLite storage should support:

- durable credit reservation and charge records
- provider usage records
- error records
- cache lookup from durable storage
- backup strategy on VPS
- privacy and retention policy

For a higher-scale release, PostgreSQL should be considered later.
