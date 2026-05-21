# GradSharp VPS HTTPS Deployment Runbook

This runbook deploys the mock AI backend to a VPS over HTTPS.

It does not enable live AI.

## Target architecture

```text
Android app
→ https://api.example.com
→ Nginx HTTPS reverse proxy
→ Node backend on 127.0.0.1:8787
→ mock AI Orchestrator
→ SQLite storage
```

## Production guardrails

Keep these values until the live provider roadmap is complete:

```text
AI_LIVE_ENABLED=false
AI_PROVIDER=mock
```

Do not add provider API keys yet.

## 1. Prepare DNS

Create an A record:

```text
api.example.com → YOUR_VPS_IP
```

Wait for DNS to resolve.

Check:

```bash
ping api.example.com
```

## 2. Clone repo on VPS

```bash
ssh root@YOUR_VPS_IP
cd /opt
git clone https://github.com/vanadiuminternational/HireReady.git GradSharp
cd GradSharp/backend
```

## 3. Configure backend env

```bash
cp .env.production.example .env
nano .env
```

Minimum safe mock values:

```text
NODE_ENV=production
PORT=8787
CORS_ORIGIN=*
AI_LIVE_ENABLED=false
AI_PROVIDER=mock
STORAGE_DRIVER=sqlite
SQLITE_PATH=./data/gradsharp.sqlite
DEBUG_STATS_TOKEN=use-a-long-random-secret
```

## 4. Run backend with Docker

```bash
docker compose -f docker-compose.example.yml up -d --build
```

Check:

```bash
curl http://127.0.0.1:8787/api/health
```

Expected:

```text
ok: true
mode: mock-ai-scaffold
liveAiEnabled: false
```

## 5. Install Nginx

```bash
apt update
apt install nginx -y
```

Copy the example config:

```bash
cp /opt/GradSharp/deploy/nginx/gradsharp-api.example.conf /etc/nginx/sites-available/gradsharp-api.conf
nano /etc/nginx/sites-available/gradsharp-api.conf
```

Replace:

```text
api.example.com
```

with the real backend domain.

Enable site:

```bash
ln -s /etc/nginx/sites-available/gradsharp-api.conf /etc/nginx/sites-enabled/gradsharp-api.conf
nginx -t
systemctl reload nginx
```

## 6. Enable HTTPS

Use Certbot:

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.example.com
```

Check:

```bash
curl https://api.example.com/api/health
```

## 7. Test protected debug stats

Without token:

```bash
curl https://api.example.com/api/ai/debug/stats
```

Expected:

```text
403 Debug access denied
```

With token:

```bash
curl https://api.example.com/api/ai/debug/stats \
  -H "x-debug-token: YOUR_DEBUG_STATS_TOKEN"
```

Expected:

```text
stats JSON
```

## 8. Test mock Recruiter X-Ray endpoint

```bash
curl -X POST https://api.example.com/api/ai/recruiter-xray \
  -H "Content-Type: application/json" \
  -d '{
    "cvText": "Experienced project officer with experience coordinating reporting, stakeholders, monitoring activities, and operational delivery across donor-funded programmes.",
    "jobDescription": "We are hiring a project officer to coordinate project reporting, stakeholder communication, monitoring, documentation, and delivery support for a funded programme.",
    "userTier": "starter"
  }'
```

Expected:

```text
provider.id = mock
scaffold.liveAi = false
```

Run it again.

Expected:

```text
provider.id = cache
cache.hit = true
```

## 9. Configure Android build

In frontend `.env.local`:

```text
VITE_GRADSHARP_API_URL=https://api.example.com
```

Then:

```bash
npm run build
npm run android:sync
```

Test Android:

- open Recruiter X-Ray,
- paste CV text,
- paste job description,
- run X-Ray,
- confirm mock result renders.

## 10. Release blocker reminder

Before Play Store release, resolve issue #19:

```text
Restrict Android cleartext traffic before Play Store release
```

Production Android should call HTTPS backend only.

## Do not proceed to live AI until

- live provider adapter is implemented behind env flags,
- cost guard is enforced against actual provider cost,
- persistent credits are real,
- privacy policy is updated,
- Google Play Data Safety is updated,
- debug endpoints remain protected,
- Android cleartext release blocker is resolved.
