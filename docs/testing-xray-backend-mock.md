# Testing Recruiter X-Ray with the Mock Backend

This guide tests the first frontend-to-backend wiring for the AI Orchestrator scaffold.

## 1. Start backend

```bash
cd backend
npm install
npm run dev
```

Expected backend URL:

```text
http://localhost:8787
```

Check:

```bash
curl http://localhost:8787/api/health
curl http://localhost:8787/api/ai/actions
```

## 2. Configure frontend

Create `.env.local` in the repo root:

```bash
VITE_HIREREADY_API_URL=http://localhost:8787
```

Then run:

```bash
npm install
npm run dev
```

## 3. Test X-Ray route

Open:

```text
/x-ray
```

Paste CV text and job description with at least 50 characters each.

Press:

```text
Recruiter X-Ray · 4 credits
```

Expected:

- frontend calls `POST /api/ai/recruiter-xray`
- backend returns mock result
- X-Ray result cards render verdict, questions, weakest line, rewritten bullet, and quick wins
- no live AI provider is called
- no API key is required

## 4. Test fallback

Remove or clear `VITE_HIREREADY_API_URL` and restart frontend.

Expected:

- X-Ray button shows the graceful backend-not-connected message
- no crash
- no API-key input appears

## 5. Android emulator note

When testing from Android emulator, `localhost` inside the Android WebView may not point to the host machine.

Use the emulator host alias:

```text
VITE_HIREREADY_API_URL=http://10.0.2.2:8787
```

For physical Android device testing, use the host computer LAN IP or deployed HTTPS backend URL.
