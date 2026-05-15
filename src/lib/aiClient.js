// aiClient.js
// Frontend-safe AI client facade for HireReady.
//
// No provider API key is stored in the browser.
// No direct Anthropic/OpenAI/Gemini call is made from frontend code.
//
// Live AI calls must go through the VPS backend that holds provider keys,
// enforces credits, applies caching, and routes to the selected provider/model.

import { planAiRequest } from '@/engine/ai-router';

export class BackendNotConfiguredError extends Error {
  constructor(message = 'AI backend is not connected yet.') {
    super(message);
    this.name = 'BackendNotConfiguredError';
  }
}

const API_BASE_URL = import.meta.env.VITE_HIREREADY_API_URL || '';

function getApiBaseUrl() {
  return API_BASE_URL.replace(/\/$/, '');
}

async function parseErrorResponse(response) {
  let message = 'The AI service returned an error.';
  try {
    const body = await response.json();
    if (body?.error) message = body.error;
    if (body?.message) message = body.message;
  } catch {
    // keep generic message
  }
  return message;
}

async function postJson(path, payload) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new BackendNotConfiguredError('HireReady AI backend is not connected yet.');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return response.json();
}

function normalizeRecruiterXrayResponse(body) {
  const result = body?.result || body;

  return {
    verdict: result?.verdict || '',
    fit_score: result?.fit_score,
    top_concerns: result?.top_concerns || [],
    questions: result?.likely_interview_questions || result?.questions || [],
    weakest_line: result?.weakest_line || '',
    rewritten_bullet: result?.rewritten_bullet || '',
    quick_wins: result?.quick_wins || [],
    risk_flags: result?.risk_flags || [],
    meta: {
      action: body?.action,
      route: body?.route,
      credits: body?.credits,
      provider: body?.provider,
      scaffold: body?.scaffold,
    },
  };
}

async function postAiAction(actionId, payload) {
  const plan = planAiRequest(actionId);

  if (plan.status === 'rule-only') {
    return { plan, data: null };
  }

  if (!API_BASE_URL) {
    throw new BackendNotConfiguredError(
      `${plan.action.label} is planned as a ${plan.credits}-credit AI action, but the HireReady VPS backend is not connected yet.`
    );
  }

  if (actionId === 'recruiterXRay') {
    const body = await postJson('/api/ai/recruiter-xray', {
      cvText: payload.cv,
      jobDescription: payload.jobDescription,
      userTier: payload.userTier || 'starter',
    });
    return { plan, data: normalizeRecruiterXrayResponse(body) };
  }

  throw new BackendNotConfiguredError(`${plan.action.label} is not wired to the backend yet.`);
}

export async function runRecruiterXRay({ cv, jobDescription, userTier = 'starter' }) {
  if (!cv?.trim()) throw new Error('Paste your CV first.');
  if (!jobDescription?.trim()) throw new Error('Paste the job description first.');

  const result = await postAiAction('recruiterXRay', {
    cv: cv.trim(),
    jobDescription: jobDescription.trim(),
    userTier,
  });

  return result?.data || result;
}

export async function improveBullet({ bullet, context = '' }) {
  if (!bullet?.trim()) throw new Error('Add a bullet point first.');
  const result = await postAiAction('improveBullet', { bullet: bullet.trim(), context });
  return result?.data || result;
}

export async function tailorCvToJob({ cv, jobDescription }) {
  if (!cv?.trim()) throw new Error('Add CV text first.');
  if (!jobDescription?.trim()) throw new Error('Paste the job description first.');
  const result = await postAiAction('tailorCvToJob', { cv: cv.trim(), jobDescription: jobDescription.trim() });
  return result?.data || result;
}
