# HireReady AI Backend Scaffold

This backend is the first implementation step for the HireReady AI Orchestrator.

Current status:

- mock provider only
- no live AI provider calls
- no provider API keys required
- no payment logic
- no persistent database
- simulated credit reservation and charge flow
- in-memory cache for repeated mock requests
- in-memory request log for local development visibility

## Run locally

```bash
cd backend
npm install
npm run dev
```

Default port:

```text
8787
```

## Endpoints

```text
GET  /api/health
GET  /api/ai/actions
GET  /api/ai/debug/stats
POST /api/ai/recruiter-xray
```

## Example Recruiter X-Ray request

```bash
curl -X POST http://localhost:8787/api/ai/recruiter-xray \
  -H "Content-Type: application/json" \
  -d '{
    "cvText": "Experienced project officer with experience coordinating reporting, stakeholders, monitoring activities, and operational delivery across donor-funded programmes.",
    "jobDescription": "We are hiring a project officer to coordinate project reporting, stakeholder communication, monitoring, documentation, and delivery support for a funded programme.",
    "userTier": "starter"
  }'
```

Expected first response:

- `provider.id` is `mock`
- `cache.hit` is `false`
- simulated credits are charged
- `scaffold.liveAi` is `false`

Run the same request again.

Expected second response:

- `provider.id` is `cache`
- `cache.hit` is `true`
- simulated credits charged are `0`
- no mock provider generation is needed

## Debug stats

```bash
curl http://localhost:8787/api/ai/debug/stats
```

Expected:

- cache entry count
- request totals
- cache hit count
- recent in-memory request logs

This is scaffold-only visibility. It is not production persistence.

## Guardrails

Do not add live provider calls until:

- cost guard is active
- credit ledger is persistent
- response validation is strict
- privacy and Data Safety wording are updated
- provider keys are stored server-side only

The Android app must never contain AI provider keys.
