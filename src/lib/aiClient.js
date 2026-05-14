// aiClient.js
// Lightweight client for the Recruiter X-Ray feature.
//
// Privacy model: the user's API key is stored ONLY in their own browser
// (localStorage). It is never sent anywhere except directly to the AI
// provider from the user's own machine. Nothing touches a server you run.
//
// Currently wired for Anthropic's Messages API. Swapping to OpenAI is a
// small change isolated to callModel() below.

const STORAGE_KEY = 'xray_api_key';
const MODEL = 'claude-sonnet-4-20250514';

export const apiKeyStore = {
  get() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  },
  set(key) {
    try {
      if (key) localStorage.setItem(STORAGE_KEY, key.trim());
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable - ignore */
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};

const SYSTEM_PROMPT = `You are a blunt but fair senior hiring manager reviewing a candidate's CV against a specific job description. You are not a cheerleader. You have read thousands of CVs and you can spot weak, vague, or inflated claims instantly.

Respond ONLY with a valid JSON object, no markdown, no preamble, in exactly this shape:
{
  "verdict": "one short sentence: would you shortlist this person for this role, yes/no/maybe, and why",
  "questions": ["three specific, probing questions a skeptical interviewer would ask THIS candidate about THIS role - reference real details from their CV"],
  "weakest_line": "quote the single line or phrase from the CV that is most hurting them, and one sentence on why",
  "rewritten_bullet": "take their weakest experience bullet and rewrite it as a strong, specific, results-driven bullet point - invent nothing, only sharpen what is there",
  "quick_wins": ["two or three concrete, small changes they could make in ten minutes"]
}

Be specific to the actual content. Never give generic advice that could apply to any CV.`;

function buildUserMessage(cv, jobDescription) {
  return `JOB DESCRIPTION:
${jobDescription.trim()}

CANDIDATE'S CV:
${cv.trim()}

Review this candidate for this exact role. Respond with the JSON object only.`;
}

function extractJson(text) {
  // Models sometimes wrap JSON in ```json fences or add stray text.
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('The AI did not return readable JSON. Try again.');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function runRecruiterXRay({ cv, jobDescription, apiKey }) {
  if (!apiKey) throw new Error('No API key set.');
  if (!cv?.trim()) throw new Error('Paste your CV first.');
  if (!jobDescription?.trim()) throw new Error('Paste the job description first.');

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserMessage(cv, jobDescription) }],
      }),
    });
  } catch {
    throw new Error('Could not reach the AI service. Check your connection.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('That API key was rejected. Check it and try again.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit or quota reached on your API account.');
    }
    let detail = '';
    try {
      const err = await response.json();
      detail = err?.error?.message ? ` (${err.error.message})` : '';
    } catch {
      /* ignore */
    }
    throw new Error(`The AI service returned an error${detail}.`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  return extractJson(text);
}
