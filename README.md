# HireReady

An independent CV builder web app. ATS-friendly templates, ATS readiness score,
cover letter generator, interview prep, and an AI-powered Recruiter X-Ray.

No Base44. No Stripe. Plain Vite + React — build and host anywhere.

## Run locally

Prerequisites: Node.js 18 or newer.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173

## Build for production

```bash
npm run build
```

Serve the `dist/` folder with nginx or any static file server on your VPS.

## Project layout

- src/pages/       — app screens (Build CV, Cover Letter, Recruiter X-Ray, etc.)
- src/components/  — shared UI components
- src/services/    — the rule-based CV and cover letter engines
- src/data/        — templates, job descriptions, word lists
- src/lib/         — utilities and the AI client

## AI feature — next step

The Recruiter X-Ray is at /x-ray. The next step is a small backend
service on the VPS that holds the Anthropic API key server-side — so
users never need their own key and pay-as-you-go limits live there.
