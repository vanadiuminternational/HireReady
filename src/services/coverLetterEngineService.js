/**
 * coverLetterEngineService.js
 * Rule-based cover letter generation engine.
 *
 * FUTURE AI INTEGRATION NOTE:
 * - This service can later be connected to OpenAI API or similar LLM services.
 * - API keys must NEVER be stored in the frontend or mobile app.
 * - Future AI calls must go through a secure backend or serverless function.
 * - User consent must be requested before sending CV or personal data to any AI service.
 * - Privacy policy and Play Store Data Safety declarations must be updated before
 *   enabling AI, analytics, ads, or cloud storage features.
 * - See aiAdapterService.js for the AI integration boundary.
 */

import { STOP_WORDS } from '../data/stopWords';

// ─── Tone Profiles ────────────────────────────────────────────────────────────
const TONES = {
  professional: {
    opener: 'I am writing to apply for',
    enthusiasm: 'I am confident that my background aligns well with',
    closing: 'I would welcome the opportunity to discuss my application at your convenience.',
  },
  warm: {
    opener: 'I am delighted to apply for',
    enthusiasm: 'I am genuinely excited about the opportunity to contribute to',
    closing: 'I would love the chance to discuss how I can contribute to your team.',
  },
  confident: {
    opener: 'I am applying for',
    enthusiasm: 'My track record demonstrates strong alignment with',
    closing: 'I look forward to discussing how my experience can add immediate value to your organisation.',
  },
  graduate: {
    opener: 'I am writing to express my interest in',
    enthusiasm: 'As a recent graduate, I am eager to apply my academic knowledge to',
    closing: 'I would welcome the opportunity to discuss how my enthusiasm and skills can contribute to your team.',
  },
  careerChanger: {
    opener: 'I am writing to apply for',
    enthusiasm: 'While my background is in a different field, my transferable skills are directly relevant to',
    closing: 'I would welcome the chance to demonstrate how my transferable skills and fresh perspective can benefit your organisation.',
  },
};

// ─── Cover Letter Type Selector ───────────────────────────────────────────────
export const selectCoverLetterTemplate = (userInput, jobAnalysis) => {
  const level = (userInput.experienceLevel || '').toLowerCase();
  const industry = (userInput.industry || userInput.targetJobTitle || '').toLowerCase();
  const type = (userInput.coverLetterType || '').toLowerCase();

  if (type) return type;
  if (level === 'student' || level === 'graduate') return 'graduate';
  if (level === 'career changer') return 'careerChanger';
  if (['admin', 'administrator', 'coordinator', 'assistant'].some(k => industry.includes(k))) return 'admin';
  if (['customer service', 'customer support', 'call centre', 'advisor'].some(k => industry.includes(k))) return 'customerService';
  if (['retail', 'shop', 'store', 'sales assistant'].some(k => industry.includes(k))) return 'retail';
  if (['hotel', 'hospitality', 'restaurant', 'bar', 'catering'].some(k => industry.includes(k))) return 'hospitality';
  if (['it support', 'helpdesk', 'technical support', 'systems'].some(k => industry.includes(k))) return 'itSupport';
  if (['research', 'analyst', 'data', 'academic', 'project officer'].some(k => industry.includes(k))) return 'research';
  if (['care', 'healthcare', 'hca', 'nursing', 'hospital'].some(k => industry.includes(k))) return 'healthcare';
  return 'general';
};

// ─── Paragraph Builders ───────────────────────────────────────────────────────

export const buildOpeningParagraph = (userInput, jobAnalysis, tone = 'professional') => {
  const t = TONES[tone] || TONES.professional;
  const { targetJobTitle, companyName, motivationForApplying } = userInput;
  const role = targetJobTitle || 'the advertised position';
  const company = companyName ? ` at ${companyName}` : '';

  let para = `${t.opener} the ${role} role${company}.`;

  if (motivationForApplying?.trim()) {
    para += ` ${motivationForApplying.trim()}`;
  } else if (companyName) {
    para += ` I have followed ${companyName}'s work with interest and am drawn to the values and direction of the organisation.`;
  } else {
    para += ` Having reviewed the role requirements carefully, I am confident this position aligns closely with my skills and professional goals.`;
  }

  return para;
};

export const buildExperienceParagraph = (userInput, jobAnalysis, tone = 'professional') => {
  const { currentRole, yearsExperience, topStrengths, mainAchievement, relevantExperience } = userInput;
  const strengths = topStrengths ? topStrengths.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3) : [];

  let para = '';

  if (currentRole && yearsExperience) {
    para += `With ${yearsExperience} year${yearsExperience === '1' ? '' : 's'} of experience as a ${currentRole}, `;
  } else if (currentRole) {
    para += `In my role as a ${currentRole}, `;
  }

  if (strengths.length > 0) {
    para += `I have developed strong competencies in ${strengths.join(', ')}.`;
  } else {
    para += `I have built a solid foundation of professional skills directly applicable to this role.`;
  }

  if (relevantExperience?.trim()) {
    para += ` ${relevantExperience.trim()}`;
  }

  if (mainAchievement?.trim()) {
    para += `\n\n${mainAchievement.trim()}`;
  }

  return para.trim();
};

export const buildMotivationParagraph = (userInput, jobAnalysis, tone = 'professional') => {
  const t = TONES[tone] || TONES.professional;
  const { targetJobTitle, companyName } = userInput;
  const role = targetJobTitle || 'this role';
  const company = companyName || 'your organisation';

  // Match JD keywords if available
  const jdSkills = jobAnalysis ? [
    ...(jobAnalysis.hardSkills || []),
    ...(jobAnalysis.tools || []),
    ...(jobAnalysis.softSkills || []),
  ].slice(0, 3) : [];

  let para = `${t.enthusiasm} ${role} at ${company}.`;

  if (jdSkills.length > 0) {
    para += ` I was particularly drawn to this opportunity given the emphasis on ${jdSkills.join(', ')}, areas where I have directly relevant experience.`;
  } else {
    para += ` I am confident that my background, combined with my commitment to continuous professional development, makes me a strong candidate for this position.`;
  }

  return para;
};

export const buildClosingParagraph = (userInput, tone = 'professional') => {
  const t = TONES[tone] || TONES.professional;
  const { fullName } = userInput;
  return `${t.closing}\n\nYours sincerely,\n${fullName || 'Your Name'}`;
};

// ─── Full Generator ───────────────────────────────────────────────────────────
export const generateCoverLetter = (userInput, jobAnalysis) => {
  const tone = userInput.tone || 'professional';
  const hiringManager = userInput.hiringManagerName?.trim()
    ? `Dear ${userInput.hiringManagerName.trim()},`
    : 'Dear Hiring Manager,';

  const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  const contact = [userInput.email, userInput.phone].filter(Boolean).join(' | ');

  const header = [
    userInput.fullName || 'Your Name',
    contact,
    today,
    '',
    userInput.companyName || '',
    '',
    hiringManager,
    '',
  ].filter((line, i) => !(line === '' && i === 4 && !userInput.companyName)).join('\n');

  const opening = buildOpeningParagraph(userInput, jobAnalysis, tone);
  const experience = buildExperienceParagraph(userInput, jobAnalysis, tone);
  const motivation = buildMotivationParagraph(userInput, jobAnalysis, tone);
  const closing = buildClosingParagraph(userInput, tone);

  const body = [opening, experience, motivation, closing].filter(Boolean).join('\n\n');
  const fullLetter = `${header}\n${body}`;

  return improveCoverLetterReadability(fullLetter);
};

// ─── Readability Improver ─────────────────────────────────────────────────────
export const improveCoverLetterReadability = (letterText) => {
  if (!letterText) return '';
  // Remove doubled spaces, triple newlines, trim trailing whitespace per line
  return letterText
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
};

// ─── Cover Letter Scorer ──────────────────────────────────────────────────────
const WEAK_PHRASES = [
  'I am the perfect candidate',
  'I have always been passionate',
  'I am a hard worker',
  'I am a team player',
  'I am a fast learner',
  'to whom it may concern',
  'I feel I would be',
  'I believe I would be a great fit',
  'I am very interested',
];

export const scoreCoverLetter = (letterText, jobAnalysis) => {
  if (!letterText) return { overall: 0, categories: {}, weakPhrases: [], matched: [], missing: [] };

  const lower = letterText.toLowerCase();
  const wordCount = letterText.split(/\s+/).filter(Boolean).length;

  // Role relevance (25) — does it mention the role and have substance
  let roleRelevance = 10;
  if (wordCount >= 200) roleRelevance += 5;
  if (wordCount >= 250) roleRelevance += 5;
  if (wordCount <= 450) roleRelevance += 5;

  // Keyword alignment (20)
  let keywordAlignment = 10;
  let matched = [];
  let missing = [];
  if (jobAnalysis) {
    const allKw = [...new Set([
      ...(jobAnalysis.hardSkills || []),
      ...(jobAnalysis.tools || []),
      ...(jobAnalysis.topKeywords || []),
    ])].slice(0, 20);
    matched = allKw.filter(k => lower.includes(k.toLowerCase()));
    missing = allKw.filter(k => !lower.includes(k.toLowerCase())).slice(0, 8);
    keywordAlignment = Math.min(20, Math.round((matched.length / Math.max(allKw.length, 1)) * 20));
  }

  // Evidence and achievements (20) — has numbers or specific examples
  const hasNumbers = /\d+/.test(letterText);
  const hasAchievement = /achiev|deliver|increas|reduc|improv|manag|led|built|developed/i.test(letterText);
  let evidence = 0;
  if (hasNumbers) evidence += 10;
  if (hasAchievement) evidence += 10;

  // Motivation and fit (15) — mentions company or role-specific language
  const hasFitLanguage = /drawn to|values|mission|team|contribute|opportunity/i.test(letterText);
  const motivationFit = hasFitLanguage ? 15 : 7;

  // Readability (10) — paragraph length, no wall of text
  const paragraphs = letterText.split('\n\n').filter(p => p.trim().length > 0);
  const avgParaLength = paragraphs.reduce((a, p) => a + p.split(/\s+/).length, 0) / Math.max(paragraphs.length, 1);
  const readability = avgParaLength < 80 ? 10 : avgParaLength < 120 ? 7 : 4;

  // Professional tone (10) — weak phrase check
  const foundWeak = WEAK_PHRASES.filter(phrase => lower.includes(phrase.toLowerCase()));
  const tone = Math.max(0, 10 - foundWeak.length * 3);

  const overall = Math.min(100, roleRelevance + keywordAlignment + evidence + motivationFit + readability + tone);

  return {
    overall,
    categories: {
      roleRelevance,
      keywordAlignment,
      evidence,
      motivationFit,
      readability,
      tone,
    },
    weakPhrases: foundWeak,
    matched,
    missing,
    wordCount,
  };
};

// ─── Tips Generator ───────────────────────────────────────────────────────────
export const generateCoverLetterTips = (letterText, jobAnalysis) => {
  const tips = [];
  if (!letterText) return tips;

  const lower = letterText.toLowerCase();
  const wordCount = letterText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 200) tips.push('Your letter is too short. Aim for 250–400 words to give enough evidence of your suitability.');
  if (wordCount > 450) tips.push('Your letter is too long. Trim to 400 words maximum — recruiters spend under 30 seconds on cover letters.');
  if (!/\d+/.test(letterText)) tips.push('Add at least one specific number, metric, or result to make your achievements concrete.');
  if (!lower.includes('dear')) tips.push('Start with a proper greeting: "Dear Hiring Manager," or the hiring manager\'s name if known.');
  if (WEAK_PHRASES.some(p => lower.includes(p.toLowerCase()))) tips.push('Remove cliche phrases such as "I am a hard worker" or "I am a team player". Show, don\'t tell.');
  if (jobAnalysis) {
    const topKw = (jobAnalysis.topKeywords || []).slice(0, 5);
    const missingKw = topKw.filter(k => !lower.includes(k));
    if (missingKw.length > 0) tips.push(`Naturally include these keywords from the job description if truthful: ${missingKw.join(', ')}.`);
  }
  if (!lower.includes('interview') && !lower.includes('discuss') && !lower.includes('welcome')) {
    tips.push('End with a clear call to action — invite the reader to contact you or mention your availability for interview.');
  }
  if (lower.includes('i am the perfect candidate')) tips.push('Remove "I am the perfect candidate" — it sounds presumptuous. Let your evidence speak.');
  tips.push('Always personalise the letter with the company name and a specific reason for applying to that organisation.');
  tips.push('Read your letter aloud before sending — if it sounds unnatural, revise it.');

  return tips.slice(0, 5);
};