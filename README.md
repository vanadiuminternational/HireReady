# HireReady

HireReady is an independent smart CV and cover-letter web app.

The goal is not to be another generic template builder. HireReady is being shaped into a **CV Intelligence Engine**: it recommends the right CV structure for the user's region, job category, and career stage, then uses AI only where AI adds real value.

## Current stack

- Vite + React
- Local-first CV, cover-letter, saved CV, template, interview prep, and Recruiter X-Ray screens
- Rule-based CV and cover-letter engine
- Frontend knowledge engine for regions, categories, recommendations, AI action costs, and future provider routing

## Product direction

HireReady should answer:

```text
What kind of CV does this person actually need?
Which regional rules apply?
Which sections should appear?
What order should they appear in?
What should be avoided?
Which template is safest?
Where is AI genuinely useful?
How many credits will an AI action cost before the user clicks?
```

## Independence

No Base44 runtime dependency should remain in the app.

No Stripe payment flow is active in this phase. Pay-as-you-go credits and subscriptions will be designed later and enforced by a VPS backend.

## AI model

The frontend must not store or expose provider API keys.

AI features are being prepared through a backend-safe facade and provider-agnostic router. Future AI calls should go through a HireReady VPS backend that handles:

- provider keys,
- model routing,
- credit enforcement,
- caching,
- usage logs,
- rate limits,
- pay-as-you-go logic.

The frontend can show AI actions and credit costs now, but live AI activation comes later.

## Run locally

Prerequisites: Node.js 18 or newer.

```bash
npm install
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

## Build for production

```bash
npm run build
```

Serve the `dist/` folder with nginx or any static file server on a VPS.

## Project layout

```text
src/pages/        app screens
src/components/   shared UI components
src/services/     current rule-based CV, cover-letter, storage, export engines
src/data/         existing templates, job samples, word lists
src/engine/       HireReady v2 knowledge engine and future AI/credit planning
src/lib/          frontend utilities and backend-safe AI facade
```

## Roadmap issue

The v2 roadmap is tracked in GitHub Issue #1:

```text
HireReady v2 Roadmap — Independent Smart CV Intelligence Engine
```

## Immediate implementation direction

1. Keep the current app usable.
2. Remove Base44 and Stripe remnants.
3. Add the full region and category knowledge engine.
4. Add a basic recommendation engine.
5. Add AI action and credit definitions.
6. Redesign the frontend flow after the foundation is stable.
7. Add VPS backend later to activate AI and pay-as-you-go credits.
