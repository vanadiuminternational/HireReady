# Backend Storage-Backed Cache

The backend now reads Recruiter X-Ray cache entries from the selected storage driver.

Supported storage drivers:

```text
memory
sqlite
```

When SQLite is enabled, repeated identical mock Recruiter X-Ray requests can be served from the SQLite cache after backend restart.

## Enable SQLite

Use this in `backend/.env`:

```text
STORAGE_DRIVER=sqlite
SQLITE_PATH=./data/gradsharp.sqlite
AI_LIVE_ENABLED=false
AI_PROVIDER=mock
```

## Test

Start backend:

```bash
cd backend
npm install
npm run build
npm run dev
```

Run a Recruiter X-Ray request once.

Expected first response:

```text
provider.id = mock
cache.hit = false
cache.source = selected-storage-driver
```

Run the same request again.

Expected repeated response:

```text
provider.id = cache
cache.hit = true
credits = 0 in scaffold
```

Restart backend and run the same request again.

Expected with SQLite:

```text
provider.id = cache
cache.hit = true
```

## Notes

This remains a mock-only backend step. It does not add live AI, payments, accounts, subscriptions, or frontend changes.

Before production live AI, debug endpoints should be protected or removed.
