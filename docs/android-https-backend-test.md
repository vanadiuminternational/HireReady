# Android HTTPS Backend Test Checklist

Use this after the mock backend is deployed to a VPS with HTTPS.

## Configure frontend build

Create or update `.env.local` in the repo root:

```text
VITE_HIREREADY_API_URL=https://api.example.com
```

Replace `api.example.com` with the real backend domain.

## Build and sync Android

```bash
npm install
npm run lint
npm run build
npm run android:sync
```

## Test on Android emulator or device

Open the Android project in Android Studio.

Run the app and test:

1. Open Recruiter X-Ray.
2. Paste CV text with at least 50 characters.
3. Paste job description with at least 50 characters.
4. Run X-Ray.
5. Confirm result renders.

Expected:

```text
provider.id = mock or cache
scaffold.liveAi = false
no API key prompt appears
no Failed to fetch error
```

## Test fallback mode

Clear the frontend env value:

```text
VITE_HIREREADY_API_URL=
```

Rebuild and sync Android.

Expected:

- Recruiter X-Ray shows backend-not-connected message,
- no crash,
- no API-key input appears.

## Production note

For Play Store release, Android should use HTTPS backend only.

Issue #19 must be resolved before production release:

```text
Restrict Android cleartext traffic before Play Store release
```
