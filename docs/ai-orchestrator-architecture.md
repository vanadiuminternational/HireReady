# HireReady AI Orchestrator Architecture

_Last updated: May 2026_

This document defines the planned AI backbone for HireReady.

The goal is not to call an AI provider directly from the Android app. The goal is to build a server-side AI orchestration layer that gives users premium results while protecting platform cost, privacy, reliability, and provider credentials.

## Product principle

HireReady should feel simple to the user:

```text
Tap an action → see credit cost → get a useful result
```

The user should not need to understand:

- tokens
- providers
- prompt engineering
- API keys
- model names
- retry rules
- cost controls

Those are handled by the backend.

## Non-negotiable guardrails

The Android app must never contain:

- OpenAI, Anthropic, Gemini, or other provider API keys
- browser-side direct AI provider calls
- user-supplied API-key flow
- hidden AI usage without a clear credit cost
- unlimited AI usage without server-side caps

All live AI must go through the backend.

## High-level architecture

```text
Android App
  ↓
HireReady Backend API
  ↓
AI Orchestrator
  ↓
Action Engine
  ↓
Cost Guard
  ↓
Credit Ledger
  ↓
Prompt Builder
  ↓
Model Router
  ↓
Provider Adapter
  ↓
Response Validator
  ↓
Result Cache
  ↓
Android App
```

## Key backend modules

### 1. Action Engine

Defines every AI action and its policy.

Example actions:

```text
recruiter_xray
cv_tailor_to_job
bullet_improve
summary_rewrite
cover_letter_rewrite
interview_questions_from_job
full_application_pack
executive_cv_audit
```

Each action should define:

```text
action_id
label
credit_cost
min_user_tier
max_input_chars
max_output_tokens
allowed_model_tiers
requires_job_description
cacheable
refund_policy
```

### 2. Credit Ledger

Credits are the user-facing unit. Tokens are internal.

The ledger records:

```text
user_id
action_id
credits_reserved
credits_charged
credits_refunded
status
request_id
created_at
```

Credits should be reserved before execution and charged only after a valid result is produced.

### 3. Cost Guard

Protects the business from runaway cost.

Rules:

```text
max input length per action
max output tokens per action
max requests per user per hour
max credits per user per day
max actual provider cost per request
monthly platform AI spend cap
retry cap
premium model cap
```

If a request is too large, the backend should ask the app to reduce input instead of silently spending more.

### 4. Prompt Builder

Builds compact, structured prompts.

Rules:

- use short system prompts
- avoid repeated long instructions where possible
- compress CV/job text before expensive calls
- request strict JSON output
- separate extraction from final writing
- avoid asking the model to invent facts

### 5. Evidence Engine

Pre-processes user input before expensive AI.

It extracts:

```text
candidate facts
role target
job requirements
keywords
missing evidence
weak phrases
measurable achievements
risk flags
```

This can use local server rules first, then cheap AI only when needed.

### 6. Model Router

Chooses model tier and provider based on action, user tier, complexity, budget, and current provider status.

The app must not choose provider or model.

Model tiers:

```text
T0 — no AI, rule-based only
T1 — cheap/fast model for extraction and simple rewriting
T2 — balanced premium model for user-facing results
T3 — high-reasoning model for complex audits only
```

Routing examples:

```text
bullet_improve → T1
cover_letter_rewrite → T1 extraction + T2 final
recruiter_xray → T1 pre-check + T2 verdict
cv_tailor_to_job → T1 extraction + T2 rewrite + validator
executive_cv_audit → T1 extraction + T3 reasoning + T2 final formatting
```

### 7. Provider Adapter

All providers must implement the same interface.

```ts
interface AiProvider {
  id: string;
  run(request: ProviderRequest): Promise<ProviderResponse>;
  estimateCost(request: ProviderRequest): CostEstimate;
}
```

Provider adapters can later include:

```text
openai
gemini
anthropic
local/mock
```

The first implementation should include a mock provider so the flow can be tested without spending money.

### 8. Response Validator

Every AI response must be validated before charging credits.

Checks:

```text
valid JSON
required fields present
field length limits
no forbidden guarantees
no unsupported claims
no irrelevant generic output
no provider error text leaked to user
```

If invalid:

```text
attempt repair once with cheap model
or return safe partial result
or refund credits
```

### 9. Result Cache

Avoid repeated cost for identical or near-identical requests.

Cache key should include:

```text
action_id
input_hash
app_version
prompt_version
model_tier
```

Cache behaviour:

- exact repeated input can return cached result
- cached result should not charge full credits again, or should charge reduced credits if policy allows
- cached result must respect user ownership and privacy boundaries

## Recommended first live action

First live AI feature should be:

```text
Recruiter X-Ray
```

Reason:

- strongest novelty
- easy to explain
- clear value to job seekers
- bounded output
- good fit for credit pricing
- already has frontend preview screen

Expected output:

```json
{
  "verdict": "...",
  "fit_score": 72,
  "top_concerns": ["..."],
  "likely_interview_questions": ["..."],
  "weakest_line": "...",
  "rewritten_bullet": "...",
  "quick_wins": ["..."],
  "risk_flags": ["..."]
}
```

## Recruiter X-Ray pipeline

```text
1. Validate user and action availability
2. Validate CV and job description length
3. Reserve credits
4. Hash input and check cache
5. Run rule-based extraction
6. Run cheap model for gap classification if needed
7. Run balanced model for final verdict
8. Validate JSON response
9. Store request, result, provider usage, and cost
10. Charge credits or refund on failure
11. Return result to app
```

## Credit model draft

Suggested actions and credit prices:

```text
Improve one bullet: 1 credit
Rewrite summary: 2 credits
Cover letter rewrite: 3 credits
Recruiter X-Ray: 4 credits
Tailor CV to one job: 5 credits
Full application pack: 8 credits
Executive CV audit: 12 credits
```

Suggested subscriptions:

```text
Free
- local CV builder
- local cover letter
- local interview prep
- no or very small trial AI credit allowance

Starter — low monthly price
- 50 credits/month
- basic AI actions

Pro
- 150 credits/month
- Recruiter X-Ray
- CV tailoring
- cover letter rewrite

Career Sprint
- 300 credits/month
- active job-seeker bundle
- higher monthly cap

Pay-as-you-go
- small credit packs
```

Do not offer unlimited AI unless there is a strict fair-use cap.

## Database draft

Minimum tables:

```text
users
credit_accounts
credit_ledger
ai_actions
ai_requests
ai_results
ai_cache
provider_usage
subscription_events
```

`ai_requests` fields:

```text
id
user_id
action_id
input_hash
prompt_version
model_tier
provider
estimated_cost
actual_cost
credits_reserved
credits_charged
status
latency_ms
error_type
created_at
```

`ai_results` fields:

```text
id
request_id
result_json
result_summary
created_at
```

`provider_usage` fields:

```text
id
request_id
provider
model
input_tokens
output_tokens
cached_input_tokens
cost
latency_ms
created_at
```

## Backend endpoints draft

```text
GET  /api/ai/actions
GET  /api/ai/credits
GET  /api/ai/history
POST /api/ai/run
POST /api/ai/recruiter-xray
```

First backend PR can expose only:

```text
GET  /api/ai/actions
POST /api/ai/recruiter-xray
```

with a mock provider.

## Privacy and Play Store impact

Before live AI is enabled:

- privacy policy must be updated
- Google Play Data Safety form must be updated
- user consent wording should be added near AI actions
- app must explain that CV/job text is sent to HireReady backend for processing
- provider data-retention policy must be reviewed

Do not enable live AI silently.

## Implementation order

```text
PR A — AI Orchestrator architecture docs
PR B — backend scaffold with mock provider
PR C — Recruiter X-Ray backend endpoint with mock response
PR D — frontend X-Ray wired to backend URL
PR E — first live provider adapter behind environment variable
PR F — credit ledger and cost guard
PR G — subscriptions/pay-as-you-go
PR H — more AI actions
```

## Success criteria

The AI backbone is successful if:

- users see simple credit-based actions
- provider keys remain server-side only
- every request has a cost cap
- repeated requests can be cached
- invalid AI output is caught before reaching users
- credits are charged only for valid output
- model routing can change without Android app updates
- the business can track actual cost per action
- premium results are produced without always using premium models
