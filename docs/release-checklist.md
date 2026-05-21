# GradSharp Android Release Checklist

Use this before building the first Play Store AAB.

## 1. Repository checks

```bash
npm install
npm run lint
npm run build
npm run android:sync
npm audit
```

Expected:

- lint passes
- build passes
- Capacitor Android sync passes
- npm audit reports 0 vulnerabilities

## 2. Forbidden dependency check

Confirm these do not appear in active app code or package files:

```text
@base44
base44Client
createCheckout
verifyProAccess
@stripe
stripe-js
anthropic-dangerous-direct-browser-access
```

## 3. Android identity

Confirm:

```text
Package ID: com.vanadiumdigital.gradsharp
App name: GradSharp
Version code: 1
Version name: 1.0
```

## 4. Android Studio checks

- open Android project
- sync Gradle
- run emulator
- run physical device if available
- test app icon launch
- test Android back button
- test screen rotation or locked orientation behaviour
- test keyboard on textareas
- test app after force close/reopen

## 5. Core app flows

- Home
- Smart Start
- Recommendation
- Build CV
- CV Result
- Cover Letter
- Saved CVs
- Templates
- Interview Prep
- Recruiter X-Ray preview
- Privacy
- 404 route

## 6. Store assets

Prepare:

- 512 x 512 app icon
- feature graphic if required
- phone screenshots
- short description
- full description
- privacy policy URL
- support email
- developer name

## 7. Privacy and Data Safety

Confirm before submission:

- no account required
- no live AI upload in current release
- no third-party analytics SDK
- no ads SDK
- no cloud sync
- CV drafts are local-only
- Data Safety answers match actual app behaviour

## 8. First release notes

```text
First GradSharp Android release. Includes Smart Start CV guidance, ATS-safe CV builder, cover-letter drafts, CV scoring, keyword review, saved CVs, templates, interview prep, and local-first privacy design.
```

## 9. Final decision gate

Do not submit if any of these are true:

- app crashes during main CV flow
- app asks for an API key
- Base44/Stripe dependencies are present
- Data Safety wording does not match app behaviour
- privacy policy URL is missing
- icon/splash looks unfinished
- generated CV cannot be copied or saved
