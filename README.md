**Welcome to your Base44 project**

**About**

View and Edit your app on [Base44.com](http://Base44.com)

This project contains everything you need to run your app locally.

---

## AI Recruiter X-Ray (new feature)

This repo adds a novel AI-powered feature on top of the original HireReady
CV Engine: the **Recruiter X-Ray** (`/x-ray`).

Paste your CV and a target job description, and a blunt-but-fair AI hiring
manager tells you:

- the **verdict** -- would they shortlist you, and why
- the **three questions** a skeptical interviewer would grill you on
- the **single line** on your CV that's hurting you most
- a **sharpened rewrite** of your weakest bullet point
- a few **ten-minute fixes**

### How the AI is wired up

The feature uses a **bring-your-own-key** model:

- The user pastes their own Anthropic API key into the app.
- The key is stored **only in the user's browser** (localStorage).
- API calls go **directly from the user's browser to the AI provider** --
  nothing passes through any server you run, so there is no infrastructure
  to host and no usage cost to you.
- Get a key at [console.anthropic.com](https://console.anthropic.com/).

Relevant files:

- src/lib/aiClient.js -- key storage + the API call (swap providers here)
- src/pages/RecruiterXRay.jsx -- the feature screen
- wired into src/App.jsx, src/components/BottomNav.jsx, src/pages/Home.jsx

To later move to a hosted / paid model, replace the direct fetch in
aiClient.js with a call to a Base44 backend function that holds the key
server-side.

---

**Edit the code in your local development environment**

**Prerequisites:**

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

Run the app: `npm run dev`

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)
