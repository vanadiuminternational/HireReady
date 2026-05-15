# HireReady Play Store Readiness Guide

_Last updated: May 2026_

This document prepares HireReady for a first Google Play release as a local-first Android app.

## Current release position

HireReady is currently positioned as a local-first Android CV and application-preparation app.

Core tools in this release:

- Smart Start CV recommendation flow
- CV builder
- CV result, preview, score, keywords, and cover-letter tab
- Standalone cover-letter builder
- Saved CVs
- ATS-safe template guidance
- Interview prep
- Recruiter X-Ray preview screen for future backend AI
- Privacy policy screen

Not live in this release:

- live AI provider calls
- cloud account system
- cloud sync
- Stripe payments
- subscriptions
- ads
- third-party analytics SDKs
- user-supplied API keys

## Package and app identity

Current Android package:

```text
com.vanadiumdigital.hireready
```

Current app name:

```text
HireReady
```

Recommended store title:

```text
HireReady: CV Builder & Job Prep
```

Short store name shown on device should remain:

```text
HireReady
```

## Google Play short description

```text
Build ATS-safe CVs, cover letters, and interview prep from your phone.
```

## Google Play full description draft

```text
HireReady helps job seekers build stronger, cleaner, and more targeted application documents directly on their Android phone.

Start with Smart Start: answer a few quick questions about your target role, market, career stage, and CV type. HireReady then recommends a suitable CV structure before you begin writing.

Use HireReady to:

• Build ATS-safe CVs
• Get region-aware CV guidance
• Create cover-letter drafts
• Review CV score and keyword alignment
• Save and duplicate CV versions locally
• Explore practical CV template structures
• Prepare for interviews with STAR prompts and checklists
• Preview future Recruiter X-Ray AI review features

This first release is local-first. Your CV drafts and cover letters are stored on your device. No account is required for the core tools.

Future versions may add optional AI-powered features through a secure backend, but provider API keys are not stored in the app and users will not be asked to provide their own API keys.
```

## Data Safety draft for current local-first release

Use this only after confirming the final APK/AAB does not include analytics, ads, account login, cloud sync, or live AI network uploads.

### Data collection

Current position:

```text
The app does not collect or transmit user CV content, cover letters, personal profile data, or job descriptions to a HireReady server in this release.
```

### Data sharing

Current position:

```text
The app does not share user data with third parties in this release.
```

### Data processed locally

Current position:

```text
CV drafts, cover letters, and saved application data are stored locally on the device using app storage. Users can delete saved CVs from the app. Clearing app storage or uninstalling the app removes local app data from the device.
```

### Network access

The Android manifest includes INTERNET permission because Capacitor apps commonly include it and future backend features will require it. For the current local-first release, app-store wording should not claim live cloud sync or live AI.

## Privacy policy wording checklist

The in-app privacy page should continue to state:

- local-first release
- no account required
- no CV upload in current release
- no third-party analytics or advertising SDKs in current release
- saved drafts are stored on device
- future AI/cloud/payment features require privacy and Data Safety updates before launch

Before store submission, add:

- public privacy-policy URL
- support email
- developer name
- contact details required by Play Console

## Screenshot plan

Recommended screenshots:

1. Home screen with Smart Start CTA
2. Smart Start role/market question
3. Recommendation screen showing recommended CV path
4. Build CV with Smart Start plan card
5. CV result screen with score and tabs
6. Cover letter result screen
7. Recruiter X-Ray preview screen
8. Saved CVs or Interview Prep screen

Screenshot captions:

- Start with the right CV plan
- Build ATS-safe CVs on your phone
- Get region-aware guidance
- Review score and keywords
- Create cover-letter drafts
- Prepare for interviews
- Future AI review, safely designed
- Save drafts locally

## Pre-release manual QA checklist

Run on Android emulator and ideally one physical Android device.

### Core checks

- app launches from icon
- splash screen appears cleanly
- no blank white screen
- bottom navigation works
- Android back button behaviour is acceptable
- no horizontal overflow
- keyboard does not block primary actions badly
- app works after force close and reopen

### Flow checks

- complete Smart Start
- view Recommendation
- Build this CV
- generate CV
- edit CV preview
- copy CV text
- save CV
- open Saved CVs
- rename saved CV
- duplicate saved CV
- delete saved CV
- generate standalone cover letter
- copy cover letter
- save cover letter
- open Templates and expand examples
- open Interview Prep and use all tabs
- open Recruiter X-Ray and confirm no API-key request appears
- open Privacy
- open unknown route and confirm 404 works

### Build commands

```bash
npm install
npm run lint
npm run build
npm run android:sync
```

Then build an AAB through Android Studio or Gradle.

## AAB release notes draft

```text
First HireReady Android release.

Includes Smart Start CV guidance, ATS-safe CV builder, cover-letter drafts, CV scoring, keyword review, saved CVs, templates, interview prep, and local-first privacy design.
```

## Risks before submission

- Confirm app icon and splash are production quality.
- Confirm Play Console privacy policy URL exists.
- Confirm Data Safety answers match actual final build.
- Confirm app does not include unused analytics/ad SDKs.
- Confirm no Base44 or Stripe remnants.
- Confirm no live AI provider keys or browser-side AI API headers.
- Confirm PDF/export behaviour is acceptable for current release.
- Confirm local data limitations are clear to users.
