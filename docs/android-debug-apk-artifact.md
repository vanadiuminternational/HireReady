# Android Debug APK Artifact

This project has a GitHub Actions workflow that builds a debug APK for testing.

Workflow:

```text
Build Android Debug APK
```

Artifact name:

```text
HireReady-debug-apk
```

## When it runs

The workflow runs when:

- it is manually triggered from GitHub Actions,
- changes are pushed to `main` that affect the frontend, Android project, Capacitor config, or the workflow itself.

## How to download the APK

1. Open the GitHub repository.
2. Go to **Actions**.
3. Open the latest successful **Build Android Debug APK** run.
4. Scroll to **Artifacts**.
5. Download:

```text
HireReady-debug-apk
```

6. Extract the ZIP.
7. Install:

```text
app-debug.apk
```

## What this APK is for

This is a debug APK for internal testing only.

It is not a Play Store release build.

## Before Play Store release

For Play Store release, create a signed release build or Android App Bundle later:

```text
.aab preferred for Play Store
```

Also resolve issue #19 before production release:

```text
Restrict Android cleartext traffic before Play Store release
```

## Backend note

The APK uses whatever backend URL was present at build time through:

```text
VITE_HIREREADY_API_URL
```

If this is blank, Recruiter X-Ray will show the backend-not-connected fallback.
