// aiClient.js
// Frontend-safe AI client facade for HireReady.
//
// No provider API key is stored in the browser.
// No direct Anthropic/OpenAI/Gemini call is made from frontend code.
//
// Live AI calls must go through a future VPS backend that holds provider keys,
// enforces credits, applies caching, and routes to the selected provider/model.

import { planAiRequest } from '@/engine/ai-router';

export class BackendNotConfiguredError extends Error {
  constructor(message = 'AI backend is not connected yet.') {
    super(message);
    this.name = 'BackendNotConfiguredError';
  }
}

const API_BASE_URL = import.meta.env.VITE_HIREREADY_API_URL || '';

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

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/ai/actions/${actionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, plan }),
  });

  if (!response.ok) {
    let message = 'The AI service returned an error.';
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // keep generic message
    }
    throw new Error(message);
  }

  return response.json();
}

export async function runRecruiterXRay({ cv, jobDescription }) {
  if (!cv?.trim()) throw new Error('Paste your CV first.');
  if (!jobDescription?.trim()) throw new Error('Paste the job description first.');

  const result = await postAiAction('recruiterXRay', {
    cv: cv.trim(),
    jobDescription: jobDescription.trim(),
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
