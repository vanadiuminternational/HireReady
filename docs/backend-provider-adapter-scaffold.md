# Backend Provider Adapter Scaffold

This document explains the disabled live provider scaffold.

## Purpose

The backend now has a provider registry and a disabled live provider placeholder.

This prepares the codebase for a future real provider adapter without enabling live AI yet.

## Current providers

```text
mock
```

Used for safe backend testing.

```text
disabled-live
```

A placeholder that refuses execution if live mode is switched on before a real provider is implemented.

## Current behaviour

When:

```text
AI_LIVE_ENABLED=false
```

The backend uses the mock provider.

When:

```text
AI_LIVE_ENABLED=true
```

The backend routes to `disabled-live` and returns a controlled 503 response.

This prevents accidental live AI calls before cost controls, privacy wording, Data Safety updates, and credit logic are ready.

## API visibility

`GET /api/ai/actions` now returns provider metadata:

```text
providers
configuredProvider
```

`GET /api/ai/debug/stats` also includes provider status.

## Guardrails

This scaffold does not add:

- provider SDKs
- provider API keys
- live OpenAI, Claude, Gemini, or other AI calls
- payment logic
- user accounts
- subscriptions
- frontend changes

## Future provider adapter requirements

A future live provider PR must include:

- server-side environment key only
- live flag gate
- provider usage logging
- token/cost tracking
- output JSON validation
- credit charge/refund flow
- privacy and Data Safety updates before production use

Do not add a real provider adapter until the VPS HTTPS backend and cost controls have been tested.
