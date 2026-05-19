# ApplicationContext Spine

This is PR 1 under Issue #30.

## Purpose

ApplicationContext is the local-first spine of HireReady.

The target architecture is:

```text
frontend → local ApplicationContext + deterministic rule engine → user
frontend → optional backend enhancement when reachable
```

The backend must enhance the experience later, not gate it.

## Files added

```text
src/lib/storage.js
src/lib/hash.js
src/lib/applicationContext.migrations.js
src/lib/applicationContext.js
src/hooks/useApplicationContext.js
```

## Current context areas

```text
smartStart
recommendation
cv
coverLetter
reviews
preferences
```

## Rules

- Spine screens should read context through `useApplicationContext()`.
- New direct localStorage access should not be added in spine screens.
- New context fields must be added to `emptyApplicationContext()`.
- Context shape changes must bump `APPLICATION_CONTEXT_VERSION` and add migration behaviour.
- Review results can be stored by hash for local-first caching.

## This PR does not do yet

- It does not rewrite existing screens.
- It does not remove older storage helpers yet.
- It does not add the UK Grad rule pack.
- It does not add the heuristic engine.
- It does not rewrite `aiClient`.
- It does not touch backend live AI.

Those are follow-up PRs under Issue #30.
