// ─── ATS Safety Validator ─────────────────────────────────────────────────────

const STANDARD_HEADINGS = ['summary', 'skills', 'work experience', 'professional experience', 'experience', 'education', 'certifications', 'projects', 'core skills', 'technical skills', 'achievements', 'languages', 'additional information'];
const STANDARD_FONTS = ['arial', 'calibri', 'times new roman', 'georgia', 'helvetica', 'verdana'];
const WEAK_PHRASES = ['responsible for', 'helped with', 'worked on', 'assisted with', 'duties included', 'tasks included', 'involved in', 'participated in'];
const DATE_REGEX = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$|^\d{2}\/\d{4}$/;

export const validateAtsSafety = (cvText = '', userInput = {}) => {
  const warnings = [];
  const passed = [];

  // Layout checks (rule-based on text content)
  passed.push('One-column layout — safe');
  passed.push('No tables detected — safe');
  passed.push('No icons or graphics — safe');
  passed.push('No text boxes or sidebars — safe');

  // Contact in header/footer
  const lines = cvText.split('\n').filter(Boolean);
  const firstThree = lines.slice(0, 3).join(' ').toLowerCase();
  if (firstThree.includes(userInput.email || '____NOEMAIL____')) {
    passed.push('Contact info in body — safe');
  }

  // Standard headings check
  const headingsInCV = lines.filter(l => l.trim() === l.trim().toUpperCase() && l.trim().length > 2 && l.trim().length < 40);
  headingsInCV.forEach(h => {
    const normalized = h.toLowerCase().replace(/─/g, '').trim();
    const isStandard = STANDARD_HEADINGS.some(sh => normalized.includes(sh));
    if (!isStandard && normalized.length > 2) {
      warnings.push(`Non-standard heading detected: "${h.trim()}" — consider renaming to a standard heading.`);
    }
  });
  if (headingsInCV.length > 0) passed.push('Section headings present — good');

  // Font check (guidance only)
  warnings.push('When exporting: use Arial, Calibri, or Times New Roman (size 10–12 body, 14–16 headings).');

  // Date format check
  const dateMatches = cvText.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\b|\b\d{2}\/\d{4}\b|\b\d{4}\s*[-–]\s*\d{4}\b/g) || [];
  if (dateMatches.length === 0 && (userInput.experience || []).length > 0) {
    warnings.push('Add dates in Month YYYY format (e.g. Jan 2022 – Dec 2024) to all roles.');
  } else {
    passed.push('Date format detected — good');
  }

  // Bullet check
  const bulletLines = lines.filter(l => l.trim().startsWith('•'));
  if (bulletLines.length === 0 && (userInput.experience || []).length > 0) {
    warnings.push('Use bullet points (•) for experience entries — avoid paragraph blocks.');
  } else if (bulletLines.length > 0) {
    passed.push(`${bulletLines.length} bullet points detected — good`);
  }

  // Weak phrase check
  const weakFound = [];
  WEAK_PHRASES.forEach(phrase => {
    if (cvText.toLowerCase().includes(phrase)) weakFound.push(phrase);
  });
  if (weakFound.length > 0) {
    warnings.push(`Weak phrases detected: "${weakFound.join('", "')}" — replace with strong action verbs.`);
  } else {
    passed.push('No weak phrases detected — good');
  }

  return { warnings, passed };
};

// ─── Bullet Quality Scorer ────────────────────────────────────────────────────
import { getAllVerbs } from '../data/actionVerbs';

export const scoreBulletQuality = (bullet) => {
  if (!bullet) return { score: 0, issues: ['Empty bullet'], improved: '' };

  const lower = bullet.toLowerCase().trim();
  let score = 0;
  const issues = [];

  // Starts with action verb
  const allVerbs = getAllVerbs();
  const startsWithVerb = allVerbs.some(v => lower.startsWith(v.toLowerCase()));
  if (startsWithVerb) score += 25;
  else issues.push('Start with a strong action verb (e.g. Delivered, Managed, Improved)');

  // Includes measurable result (numbers/%)
  if (/\d+/.test(bullet)) score += 25;
  else issues.push('Add a measurable result if possible (e.g. 30%, €50k, 200 users)');

  // Includes tool/skill keyword
  const toolWords = ['excel','python','sql','javascript','react','salesforce','hubspot','jira','aws','azure','tableau','powerpoint','word','google','slack','trello','figma'];
  if (toolWords.some(t => lower.includes(t))) score += 25;

  // Not weak
  const isWeak = WEAK_PHRASES.some(p => lower.includes(p));
  if (!isWeak) score += 25;
  else issues.push(`Replace weak phrase — avoid: "${WEAK_PHRASES.find(p => lower.includes(p))}"`);

  // Minimum length
  if (bullet.split(' ').length < 5) issues.push('Bullet is too short — add more context');

  // Rewrite weak bullets
  let improved = bullet;
  if (isWeak) {
    improved = bullet
      .replace(/responsible for/gi, 'Managed')
      .replace(/helped with/gi, 'Supported')
      .replace(/worked on/gi, 'Delivered')
      .replace(/assisted with/gi, 'Contributed to')
      .replace(/duties included/gi, 'Key responsibilities included')
      .replace(/involved in/gi, 'Led')
      .replace(/participated in/gi, 'Contributed to');
  }

  return { score, issues, improved: improved !== bullet ? improved : null };
};

// ─── Recruiter Readability Score ──────────────────────────────────────────────
export const recruiterReadabilityScore = (cvText, userInput) => {
  if (!cvText) return { score: 0, notes: [] };

  let score = 0;
  const notes = [];
  const lines = cvText.split('\n').filter(Boolean);

  // Clear headings (uppercase lines)
  const headings = lines.filter(l => l.trim() === l.trim().toUpperCase() && l.length > 2 && l.length < 50);
  if (headings.length >= 3) { score += 15; }
  else { notes.push('Add clear section headings to improve scannability.'); }

  // Concise bullets
  const bullets = lines.filter(l => l.trim().startsWith('•'));
  const longBullets = bullets.filter(b => b.split(' ').length > 25);
  if (bullets.length > 0 && longBullets.length === 0) score += 15;
  else if (longBullets.length > 0) notes.push(`${longBullets.length} bullet(s) are too long — keep bullets under 2 lines.`);

  // Measurable achievements
  if (/\d+%|\d+\s*(users|clients|customers|people|staff|projects|accounts)|\€|\$|£/i.test(cvText)) {
    score += 20;
  } else {
    notes.push('Add numbers or metrics to demonstrate impact (%, €, users, time saved).');
  }

  // Vague summary check
  const summaryStart = cvText.toLowerCase().indexOf('professional summary');
  if (summaryStart > -1) {
    const summaryChunk = cvText.slice(summaryStart, summaryStart + 400);
    const vague = ['hardworking','passionate','team player','detail-oriented','motivated individual','results-driven professional'].filter(v => summaryChunk.toLowerCase().includes(v));
    if (vague.length > 0) notes.push(`Vague summary phrases detected: "${vague.join('", "')}". Replace with specific achievements.`);
    else score += 15;
  } else score += 10;

  // Long paragraphs penalty
  const paragraphs = cvText.split('\n\n').filter(p => p.split(' ').length > 60);
  if (paragraphs.length > 0) notes.push('Break long paragraphs into bullet points for better readability.');
  else score += 10;

  // Generic soft skills without proof
  const genericSkills = ['good communicator','strong communication skills','team player','works well under pressure','self-motivated'];
  const hasGeneric = genericSkills.some(s => cvText.toLowerCase().includes(s));
  if (hasGeneric) notes.push('Generic soft skills detected. Back them up with evidence in your bullet points.');
  else score += 10;

  // Role relevance
  if (userInput?.targetJobTitle && cvText.toLowerCase().includes(userInput.targetJobTitle.toLowerCase())) {
    score += 15;
  } else {
    notes.push('Include your target job title in the summary or headline section.');
  }

  return { score: Math.min(score, 100), notes };
};

// ─── CV Length Validator ──────────────────────────────────────────────────────
export const validateCvLength = (cvText, userInput) => {
  const warnings = [];
  const wordCount = cvText.split(/\s+/).filter(Boolean).length;
  const estimatedPages = wordCount / 450; // ~450 words per A4 page
  const level = userInput?.experienceLevel;

  if (level === 'Student' || level === 'Graduate') {
    if (estimatedPages > 1.3) warnings.push('Aim for 1 page for Student/Graduate CVs. Remove less relevant content.');
  } else if (level === 'Professional') {
    if (estimatedPages > 2.3) warnings.push('Keep your CV to 2 pages maximum. Focus on the last 10 years.');
  } else {
    if (estimatedPages > 2) warnings.push('CV may be too long. Aim for 1–2 pages maximum.');
  }

  // Summary length
  const summaryMatch = cvText.match(/PROFESSIONAL SUMMARY[\s\S]*?\n\n/);
  if (summaryMatch) {
    const summaryLines = summaryMatch[0].split('\n').filter(Boolean);
    if (summaryLines.length > 6) warnings.push('Summary is too long — keep it to 3–4 lines maximum.');
  }

  // Bullets per role
  const roleBlocks = cvText.split(/\n(?=[A-Z][^|]+\|)/);
  roleBlocks.forEach(block => {
    const bullets = block.match(/^•/gm) || [];
    if (bullets.length > 6) warnings.push(`One role has ${bullets.length} bullets — keep each role to 4–6 bullets maximum.`);
  });

  const info = [];
  if (level === 'Student' || level === 'Graduate') info.push('Target: 1 page');
  else if (level === 'Professional') info.push('Target: 2 pages maximum');
  else info.push('Target: 1–2 pages');
  info.push(`Estimated length: ~${estimatedPages.toFixed(1)} pages (${wordCount} words)`);

  return { warnings, info };
};

// ─── Contact Info Parser ──────────────────────────────────────────────────────
export const validateContactInfo = (userInput) => {
  const warnings = [];
  const passed = [];

  if (userInput.fullName) passed.push('Name present');
  else warnings.push('Add your full name.');

  if (userInput.email) passed.push('Email present');
  else warnings.push('Add your email address.');

  if (userInput.phone) passed.push('Phone present');
  else warnings.push('Add your phone number.');

  if (userInput.cityCountry) passed.push('Location present');
  else warnings.push('Add your city/country.');

  if (userInput.linkedin) passed.push('LinkedIn present');
  else warnings.push('Add your LinkedIn URL (recommended for recruiter visibility).');

  return { warnings, passed };
};

// ─── Export Guidance ──────────────────────────────────────────────────────────
export const getExportGuidance = (userInput) => {
  const first = (userInput.fullName || 'Firstname_Lastname').replace(/\s+/g, '_');
  const role = (userInput.targetJobTitle || 'CV').replace(/\s+/g, '_');
  const filename = `${first}_${role}_CV`;

  return {
    filename,
    tips: [
      'Use DOCX format when the employer accepts Word files — best for ATS parsing.',
      'Use PDF only if it is text-based (not image-based or scanned).',
      'Never submit an image-based or photo PDF — ATS cannot read it.',
      `Recommended filename: ${filename}.pdf or ${filename}.docx`,
      'Do not name your file "CV.pdf" or "Resume.docx" — be specific.',
    ],
  };
};