/**
 * appConfig.js
 * Central configuration for HireReady CV Engine.
 * Edit this file to adjust app-wide settings.
 */

export const APP_CONFIG = {
  name: 'HireReady CV Engine',
  version: '1.0.0',

  // Storage
  storageKeys: {
    cvs: 'hirereready_cvs',
    coverLetters: 'hirereready_cover_letters',
    appPacks: 'hirereready_app_packs',
    settings: 'hirereready_settings',
  },

  // Limits for free tier
  free: {
    maxSavedCVs: 3,
    maxSavedCoverLetters: 3,
    maxSavedPacks: 1,
    basicAtsOnly: true,
    coverLetterTones: ['professional'],
  },

  // Pro tier (future billing integration)
  pro: {
    maxSavedCVs: Infinity,
    maxSavedCoverLetters: Infinity,
    maxSavedPacks: Infinity,
    allTones: true,
    aiRewrite: true,
    linkedInSummary: true,
    interviewAnswerGenerator: true,
    pdfExport: true,
    docxExport: true,
  },

  // Cover letter word count targets
  coverLetter: {
    minWords: 250,
    maxWords: 400,
    idealWords: 320,
  },

  // ATS score thresholds
  atsScore: {
    excellent: 80,
    good: 60,
    fair: 40,
  },
};

export const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Formal and structured. Best for corporate or public sector roles.' },
  { id: 'warm', label: 'Warm', desc: 'Friendly and approachable. Good for SMEs, nonprofits, and team-focused roles.' },
  { id: 'confident', label: 'Confident', desc: 'Direct and assertive. Best for senior or sales-oriented roles.' },
  { id: 'graduate', label: 'Graduate-Friendly', desc: 'Enthusiastic and forward-looking. Best for entry-level and graduate roles.' },
  { id: 'careerChanger', label: 'Career Changer', desc: 'Emphasises transferable skills. Best for career transitions.' },
];

export const COVER_LETTER_TYPES = [
  { id: 'general', label: 'General Application' },
  { id: 'graduate', label: 'Graduate Role' },
  { id: 'partTime', label: 'Part-Time Job' },
  { id: 'careerChanger', label: 'Career Change' },
  { id: 'admin', label: 'Admin Role' },
  { id: 'customerService', label: 'Customer Service' },
  { id: 'retail', label: 'Retail' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'itSupport', label: 'IT Support' },
  { id: 'research', label: 'Research / Project' },
  { id: 'healthcare', label: 'Healthcare Assistant' },
];