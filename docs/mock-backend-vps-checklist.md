# Mock Backend VPS Checklist

Use this checklist before enabling any live AI provider.

## Repository checks

```bash
npm install
npm run lint
npm run build
npm run android:sync

cd backend
npm install
npm run typecheck
npm run build
```

## Backend deployment checks

- backend starts successfully
- `/api/health` returns `ok: true`
- `/api/ai/actions` returns registered actions
- `/api/ai/recruiter-xray` returns mock result
- repeated same request returns cache hit
- `/api/ai/debug/stats` shows request/cache stats
- `AI_LIVE_ENABLED=false`
- `AI_PROVIDER=mock`
- no provider API keys are configured

## HTTPS checks

- backend is available through HTTPS
- Android app can call HTTPS backend URL
- local HTTP testing remains documented separately
- production does not depend on cleartext HTTP

## Android checks

Set for deployed backend:

```text
VITE_GRADSHARP_API_URL=https://api.yourdomain.com
```

Then:

```bash
npm run build
npm run android:sync
```

Test on emulator or device:

- open X-Ray
- paste CV text
- paste job description
- run X-Ray
- mock result renders
- no API-key input appears
- no live AI provider is called

## Release blocker reminder

Do not submit to Play Store until issue #19 is resolved:

```text
Restrict Android cleartext traffic before Play Store release
```

## Do not proceed to live AI until

- persistent credit ledger exists
- production cost guard exists
- provider adapter is behind disabled env flag first
- privacy policy is updated for backend AI processing
- Google Play Data Safety is updated
- HTTPS backend is working
- debug endpoints are protected or removed for production
