# HireReady AI Orchestrator Implementation Roadmap

This roadmap turns the AI Orchestrator architecture into controlled implementation PRs.

The main rule is simple:

```text
Do not add live AI provider calls until the backend, cost guard, and mock-provider path exist.
```

## Phase 0 — Current state

Current app state:

- Android app exists through Capacitor
- frontend has premium flows
- Recruiter X-Ray UI exists as a future AI feature
- live AI is not enabled
- no user API keys
- no backend
- no subscriptions
- no credit ledger

## Phase 1 — Backend scaffold with mock AI

Goal:

Create a backend foundation that can run locally and return mock AI results without spending money.

Suggested branch:

```text
backend-ai-orchestrator-scaffold
```

Suggested additions:

```text
backend/
  package.json
  src/
    server.ts
    config.ts
    routes/
      ai.ts
    orchestrator/
      actions.ts
      credits.ts
      router.ts
      costGuard.ts
      promptBuilder.ts
      validator.ts
      cache.ts
      ledger.ts
    providers/
      mockProvider.ts
      providerTypes.ts
    schemas/
      recruiterXray.ts
```

Endpoints:

```text
GET  /api/health
GET  /api/ai/actions
POST /api/ai/recruiter-xray
```

Acceptance:

- backend starts locally
- mock Recruiter X-Ray returns valid structured JSON
- no real provider API key required
- frontend can be configured to call backend URL later
- no payment logic yet
- no live AI yet

## Phase 2 — Frontend-to-backend wiring

Goal:

Wire existing `runRecruiterXRay` facade to call the backend when a backend URL is configured.

Rules:

- keep graceful backend-not-connected fallback
- no provider keys in frontend
- no user API-key inputs
- clear error messages
- Android WebView compatible networking

Acceptance:

- if backend URL is missing, X-Ray shows planned/offline message
- if backend URL exists, X-Ray calls `/api/ai/recruiter-xray`
- mock result renders in current X-Ray result cards

## Phase 3 — Cost guard and credit reserve simulation

Goal:

Add real request policy before live AI.

Features:

- action registry
- credit cost per action
- max input chars
- max output tokens
- rate limit placeholder
- request ID
- input hash
- cache lookup placeholder
- simulated credit reservation
- simulated credit charge/refund

Acceptance:

- oversized CV/job input is rejected before provider call
- repeated identical input can return cached mock result
- failed validation does not charge simulated credits
- request log records status

## Phase 4 — First live provider adapter

Goal:

Enable one live AI provider behind server-side environment variables.

Rules:

- provider key stored only in backend environment
- provider can be disabled by env flag
- mock provider remains available
- live provider only handles Recruiter X-Ray initially
- strict output JSON schema
- validator blocks malformed output

Acceptance:

- live call works locally/staging
- cost estimate logged
- actual token usage logged where provider returns it
- invalid output is repaired once or safely rejected

## Phase 5 — Real credit ledger and user identity

Goal:

Add a basic user/account model for paid AI.

Options:

- anonymous device ID for beta
- email/password later
- magic link later
- Google sign-in later

Do not overbuild auth before validating paid demand.

Acceptance:

- each request is linked to a user/device record
- credits can be granted
- credits can be reserved
- credits can be charged
- credits can be refunded
- monthly reset can be simulated

## Phase 6 — Subscription and pay-as-you-go

Goal:

Add monetisation after the AI action is technically stable.

Preferred model:

- monthly credit allowance
- pay-as-you-go top-up packs
- no unlimited AI
- clear credit cost before action

Possible plans:

```text
Free: local tools only or tiny trial credits
Starter: 50 credits/month
Pro: 150 credits/month
Career Sprint: 300 credits/month
Top-up packs: 30, 80, 180 credits
```

Acceptance:

- user sees credit balance
- user sees cost before running AI
- insufficient credits blocks action before provider call
- payment success grants credits
- refunds or provider failures do not charge credits

## Phase 7 — Additional AI actions

Only after Recruiter X-Ray is stable.

Candidate actions:

```text
bullet_improve
summary_rewrite
cover_letter_rewrite
cv_tailor_to_job
interview_questions_from_job
full_application_pack
executive_cv_audit
```

Each action must define:

- credit cost
- max input
- model tier
- output schema
- validator
- cache policy

## Phase 8 — Observability and financial control

Add dashboards or logs for:

```text
requests per action
cost per action
credits charged
provider errors
validation failures
cache hit rate
latency
user conversion
refund rate
```

This decides whether the app is profitable.

## Hard stop rules

Do not launch live AI if:

- provider key is in frontend
- there is no cost cap
- there is no input length limit
- there is no output validation
- there is no usage logging
- there is no credit/reservation logic
- privacy/Data Safety wording is not updated
- app still says data never leaves device

## First coding PR after this documentation

Recommended next coding PR:

```text
Backend AI Orchestrator scaffold with mock Recruiter X-Ray
```

It should not call a live provider. It should create the backend shape and prove the orchestration flow safely.
