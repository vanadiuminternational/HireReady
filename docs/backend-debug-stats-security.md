# Backend Debug Stats Security

The backend debug stats endpoint is useful during development and VPS testing:

```text
GET /api/ai/debug/stats
```

It exposes cache, request, storage, and provider scaffold status.

## Current protection

In local non-production development, the endpoint remains open if `DEBUG_STATS_TOKEN` is blank.

In production:

- if `DEBUG_STATS_TOKEN` is blank, the endpoint returns `404 Not found`,
- if `DEBUG_STATS_TOKEN` is set, callers must provide it.

Supported headers:

```text
x-debug-token: YOUR_TOKEN
```

or:

```text
Authorization: Bearer YOUR_TOKEN
```

## Production configuration

In `backend/.env` on the VPS:

```text
NODE_ENV=production
DEBUG_STATS_TOKEN=use-a-long-random-secret
```

## Test

Without token:

```bash
curl https://api.yourdomain.com/api/ai/debug/stats
```

Expected:

```text
403 Debug access denied
```

With token:

```bash
curl https://api.yourdomain.com/api/ai/debug/stats \
  -H "x-debug-token: use-a-long-random-secret"
```

Expected:

```text
stats JSON response
```

## Guardrails

This change does not add live AI, provider API keys, payments, accounts, subscriptions, or frontend changes.

Before live AI, debug endpoints should either remain token-protected or move behind a proper admin/auth layer.
