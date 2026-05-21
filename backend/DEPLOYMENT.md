# GradSharp Mock Backend VPS Deployment Guide

This guide deploys the current mock AI backend only.

It does **not** enable live AI provider calls.

## Current deployment goal

Deploy:

```text
GradSharp Android app
→ HTTPS backend URL
→ mock AI Orchestrator backend
→ no live AI provider
```

This proves the Android app can call a real server before any OpenAI, Claude, Gemini, payments, or persistent credits are added.

## Guardrails

Do not add provider keys for this phase.

Keep:

```text
AI_LIVE_ENABLED=false
AI_PROVIDER=mock
```

Do not deploy live AI until:

- persistent credit ledger exists,
- real cost guard exists,
- provider adapter is behind environment flags,
- privacy policy is updated,
- Google Play Data Safety is updated,
- production backend is HTTPS,
- Android cleartext traffic is restricted before Play Store release.

See GitHub issue #19 for the Android cleartext release blocker.

## Option A — Docker deployment

### 1. SSH to VPS

```bash
ssh root@YOUR_SERVER_IP
```

### 2. Install Docker if needed

Use your VPS provider's recommended Docker install path. On Ubuntu, Docker's official installation guide is preferred.

### 3. Clone repo

```bash
git clone https://github.com/vanadiuminternational/HireReady.git GradSharp
cd GradSharp/backend
```

### 4. Create backend env file

```bash
cp .env.example .env
nano .env
```

For mock deployment:

```text
NODE_ENV=production
PORT=8787
CORS_ORIGIN=*
AI_LIVE_ENABLED=false
AI_PROVIDER=mock
PLATFORM_MONTHLY_COST_CAP_CENTS=2500
```

For production, tighten `CORS_ORIGIN` once the app/backend domain plan is final.

### 5. Start backend

```bash
docker compose -f docker-compose.example.yml up -d --build
```

### 6. Test locally on VPS

```bash
curl http://localhost:8787/api/health
curl http://localhost:8787/api/ai/actions
curl http://localhost:8787/api/ai/debug/stats
```

Expected:

```text
ok: true
mode: mock-ai-scaffold
liveAiEnabled: false
```

## Option B — Node + PM2 deployment

Use this if you do not want Docker.

```bash
git clone https://github.com/vanadiuminternational/HireReady.git GradSharp
cd GradSharp/backend
cp .env.example .env
npm install
npm run build
npm install -g pm2
pm2 start dist/server.js --name gradsharp-backend
pm2 save
pm2 startup
```

Test:

```bash
curl http://localhost:8787/api/health
```

## Nginx reverse proxy

Use HTTPS for any non-local Android testing.

Example Nginx server block:

```nginx
server {
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then use Certbot or your VPS panel to enable Let's Encrypt HTTPS.

Final backend URL should look like:

```text
https://api.yourdomain.com
```

## Android app configuration

For local emulator testing:

```text
VITE_GRADSHARP_API_URL=http://10.0.2.2:8787
```

For deployed VPS testing:

```text
VITE_GRADSHARP_API_URL=https://api.yourdomain.com
```

After changing `.env.local`, rebuild and sync Android:

```bash
npm run build
npm run android:sync
```

## Test mock X-Ray through deployed backend

```bash
curl -X POST https://api.yourdomain.com/api/ai/recruiter-xray \
  -H "Content-Type: application/json" \
  -d '{
    "cvText": "Experienced project officer with experience coordinating reporting, stakeholders, monitoring activities, and operational delivery across donor-funded programmes.",
    "jobDescription": "We are hiring a project officer to coordinate project reporting, stakeholder communication, monitoring, documentation, and delivery support for a funded programme.",
    "userTier": "starter"
  }'
```

Expected:

- `provider.id` is `mock` on first request,
- `cache.hit` is `false` on first request,
- `provider.id` is `cache` on repeated request,
- `scaffold.liveAi` is `false`,
- no provider key is required.

## Security reminders before Play Store release

Before production release:

- restrict Android cleartext traffic,
- remove global mixed-content allowance or make it debug-only,
- use HTTPS backend only,
- update privacy policy if live AI sends CV/job text to backend,
- update Google Play Data Safety if backend processing goes live,
- disable or protect debug endpoints if they expose sensitive logs in future.

Current debug endpoint is scaffold-only:

```text
GET /api/ai/debug/stats
```

It should not expose user CV content, but production observability should later require authentication or internal access only.
