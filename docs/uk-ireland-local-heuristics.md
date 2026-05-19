# UK/Ireland Local Heuristic Engine

This is implementation-plan PR 2 under Issue #30.

## Purpose

The app should feel intelligent before any backend or live AI exists.

This PR adds:

```text
src/engine/rules/ukIrelandGrad.js
src/engine/heuristics/index.js
```

## Region decision

The v1 ruleset is UK/Ireland, not UK-only.

Reason:

- Ireland is a first-class target market for the app.
- UK and Ireland CV expectations are close enough for a shared v1 graduate/early-career ruleset.
- Later versions can split UK and Ireland if needed.

## Engine rules

The heuristic engine is deterministic:

- no LLM,
- no embeddings,
- no fuzzy matching,
- no network calls,
- regex and templates only,
- JSON-serialisable output.

## Public API

```js
analyzeCV({ cvText, jobDescription, rules })
```

Default rules:

```js
ukIrelandGradRules
```

## Output shape

The output is compatible with Recruiter X-Ray style results:

```text
source
ruleset
regionLabel
verdict
fit_score
score
top_concerns
questions
likely_interview_questions
weakest_line
rewritten_bullet
quick_wins
risk_flags
metrics
```

## What it checks locally

- page estimate,
- keyword coverage against job description,
- quantification ratio,
- strong verbs,
- weak verbs,
- generic forbidden phrases,
- British English spelling style,
- basic sector inference,
- basic contact/date presence.

## What this PR does not do

- It does not wire Recruiter X-Ray to the local engine yet.
- It does not rewrite `aiClient` yet.
- It does not remove backend code.
- It does not add live AI.
- It does not add payments or subscriptions.

Those are later Issue #30 PRs.
