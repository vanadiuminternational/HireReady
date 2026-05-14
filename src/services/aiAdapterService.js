/**
 * aiAdapterService.js
 * AI Integration Boundary — Rule-based implementations now, AI-ready for later.
 *
 * ─── IMPORTANT ARCHITECTURE NOTES ──────────────────────────────────────────────
 *
 * This service acts as the ONLY point of contact between the app and any future AI.
 *
 * SECURITY RULES (NEVER BREAK THESE):
 * - API keys must NEVER be stored in the frontend, mobile app, or localStorage.
 * - AI calls must NEVER be made directly from the mobile/browser client.
 * - All future AI requests must go through a secure backend function or
 *   serverless endpoint (e.g. Supabase Edge Function, Firebase Function, AWS Lambda).
 * - The backend holds the API key and validates the user's request before forwarding to AI.
 *
 * PRIVACY RULES (MUST FOLLOW BEFORE ENABLING AI):
 * - User consent must be explicitly requested before sending CV data to any AI service.
 * - The Privacy Policy must be updated to describe what data is sent, to whom, and why.
 * - Google Play Store Data Safety section must be updated before launch.
 * - If using OpenAI, Anthropic, or similar, link their data processing agreements.
 *
 * TO ENABLE AI IN FUTURE:
 * 1. Set up a secure backend endpoint (e.g. /api/enhance-cv).
 * 2. Replace the rule-based logic below with a fetch() call to your backend.
 * 3. The backend calls the AI API with the user's text and returns the result.
 * 4. Add a user consent screen before the first AI call.
 * 5. Update the privacy policy and app store data safety declaration.
 *
 * ────────────────────────────────────────────────────────────────────────────────
 */

import { getAllVerbs } from '../data/actionVerbs';

// Placeholder — returns rule-based improvements.
// Future: replace with fetch('/api/enhance-cv', { method: 'POST', body: JSON.stringify({ cvText, userInput, jobAnalysis }) })
export const enhanceCv = async (cvText, userInput, jobAnalysis) => {
  // Rule-based: ensure action verbs at start of bullets
  const verbs = getAllVerbs();
  const lines = cvText.split('\n').map(line => {
    if (!line.trim().startsWith('•')) return line;
    const bullet = line.trim().slice(1).trim();
    const hasVerb = verbs.some(v => bullet.toLowerCase().startsWith(v.toLowerCase()));
    if (!hasVerb && bullet.length > 0) {
      return `• Delivered ${bullet.charAt(0).toLowerCase() + bullet.slice(1)}`;
    }
    return line;
  });
  return lines.join('\n');
};

// Placeholder — returns rule-based cover letter with readability pass.
// Future: replace with fetch('/api/enhance-cover-letter', ...)
export const enhanceCoverLetter = async (letterText, userInput, jobAnalysis) => {
  if (!letterText) return letterText;
  // Rule-based: remove double spaces and tighten paragraphs
  return letterText
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Placeholder — improves bullet points using action verbs and structure hints.
// Future: replace with AI rewrite endpoint
export const rewriteBulletPoints = async (bullets, jobAnalysis) => {
  const verbs = getAllVerbs();
  return bullets.map(bullet => {
    const hasVerb = verbs.some(v => bullet.toLowerCase().startsWith(v.toLowerCase()));
    if (!hasVerb) {
      return `Delivered ${bullet.charAt(0).toLowerCase() + bullet.slice(1)}`;
    }
    return bullet;
  });
};

// Placeholder — generates a rule-based LinkedIn summary.
// Future: replace with AI generation endpoint
export const generateLinkedInSummary = async (userInput, jobAnalysis) => {
  const { currentRole, yearsExperience, topSkills, mainAchievement, careerGoal, fullName } = userInput;
  const skills = topSkills ? topSkills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3).join(', ') : '';

  let summary = '';
  if (currentRole && yearsExperience) {
    summary += `${currentRole} with ${yearsExperience} year${yearsExperience === '1' ? '' : 's'} of experience`;
    if (skills) summary += ` specialising in ${skills}`;
    summary += '. ';
  }
  if (mainAchievement) summary += `${mainAchievement} `;
  if (careerGoal) summary += `${careerGoal}.`;
  if (!summary) summary = 'Experienced professional with a strong background in my field. Open to new opportunities.';

  return summary.trim();
};

// Placeholder — generates rule-based STAR interview answers.
// Future: replace with AI generation endpoint
export const generateInterviewAnswers = async (userInput, jobAnalysis) => {
  const { currentRole, mainAchievement, topSkills } = userInput;
  const skills = topSkills ? topSkills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return [
    {
      question: 'Tell me about yourself.',
      answer: `I am a ${currentRole || 'professional'} with experience in ${skills.slice(0, 2).join(' and ') || 'my field'}. ${mainAchievement || 'I have a strong track record of delivering results.'}`,
    },
    {
      question: 'What is your greatest strength?',
      answer: skills.length > 0
        ? `One of my key strengths is ${skills[0]}. I have consistently applied this throughout my career to deliver strong outcomes.`
        : 'I am highly organised and results-driven, with a consistent track record of meeting targets.',
    },
  ];
};