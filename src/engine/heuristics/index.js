import { ukIrelandGradRules } from '../rules/ukIrelandGrad';

const NUMBER_PATTERN = /\b(\d+%?|one|two|three|four|five|six|seven|eight|nine|ten|weekly|monthly|quarterly|annual|annually)\b/i;
const DATE_PATTERN = /\b(20\d{2}|19\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i;
const EMAIL_PATTERN = /\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/i;
const PHONE_PATTERN = /\b(?:\+?\d[\d\s().-]{7,}\d)\b/;

const SECTOR_KEYWORDS = {
  tech: ['software', 'developer', 'javascript', 'react', 'python', 'data', 'cloud', 'cyber', 'security', 'api', 'frontend', 'backend'],
  public: ['policy', 'public', 'government', 'stakeholder', 'programme', 'compliance', 'grant', 'reporting', 'monitoring'],
  research: ['research', 'evaluation', 'analysis', 'dataset', 'ethics', 'publication', 'survey', 'qualitative', 'quantitative'],
  consulting: ['consulting', 'client', 'strategy', 'advisory', 'proposal', 'delivery', 'implementation', 'recommendation'],
  finance: ['finance', 'banking', 'audit', 'risk', 'accounting', 'investment', 'budget', 'financial'],
  healthcare: ['health', 'clinical', 'patient', 'hospital', 'care', 'medical', 'nursing', 'safety'],
};

function normalise(text) {
  return String(text || '').replace(/\r/g, '').trim();
}

function words(text) {
  return normalise(text).toLowerCase().match(/[a-z][a-z+-]*/g) || [];
}

function unique(list) {
  return Array.from(new Set(list.filter(Boolean)));
}

export function extractBullets(cvText) {
  return normalise(cvText)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /^[-•*–—]\s+/.test(line) || /^\d+[.)]\s+/.test(line))
    .map((line) => line.replace(/^[-•*–—]\s+/, '').replace(/^\d+[.)]\s+/, '').trim())
    .filter(Boolean);
}

export function detectQuantification(text) {
  return NUMBER_PATTERN.test(text);
}

export function detectStrongVerb(text, rules = ukIrelandGradRules) {
  const lower = text.toLowerCase();
  return rules.bullet.strongVerbs.find((verb) => lower.startsWith(`${verb} `) || lower.includes(` ${verb} `)) || null;
}

export function detectWeakVerbs(text, rules = ukIrelandGradRules) {
  const lower = text.toLowerCase();
  return rules.bullet.weakVerbs.filter((phrase) => lower.includes(phrase));
}

export function detectForbiddenPhrases(text, rules = ukIrelandGradRules) {
  const lower = text.toLowerCase();
  return rules.bullet.forbiddenPhrases.filter((phrase) => lower.includes(phrase));
}

export function detectSpellingIssues(text) {
  const lower = text.toLowerCase();
  const issues = [];

  const americanToBritish = [
    ['analyze', 'analyse'],
    ['analyzed', 'analysed'],
    ['organize', 'organise'],
    ['organized', 'organised'],
    ['program ', 'programme '],
    ['center', 'centre'],
    ['behavior', 'behaviour'],
  ];

  americanToBritish.forEach(([found, preferred]) => {
    if (lower.includes(found)) {
      issues.push({ found: found.trim(), preferred: preferred.trim(), type: 'british_english' });
    }
  });

  return issues;
}

export function estimatePages(cvText) {
  const count = words(cvText).length;
  return Math.max(1, Math.ceil(count / 430));
}

export function extractKeywordsFromJD(jobDescription) {
  const stopWords = new Set([
    'and', 'the', 'for', 'with', 'you', 'your', 'our', 'are', 'will', 'this', 'that', 'from', 'have', 'has', 'job', 'role',
    'work', 'team', 'skills', 'experience', 'candidate', 'required', 'preferred', 'within', 'about', 'their', 'they', 'them',
  ]);

  const counts = words(jobDescription)
    .filter((word) => word.length > 3)
    .filter((word) => !stopWords.has(word))
    .reduce((acc, word) => ({ ...acc, [word]: (acc[word] || 0) + 1 }), {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([word]) => word);
}

export function keywordCoverage(cvText, jobDescription) {
  const keywords = extractKeywordsFromJD(jobDescription);
  const cvWords = new Set(words(cvText));
  const matched = keywords.filter((keyword) => cvWords.has(keyword));
  const missing = keywords.filter((keyword) => !cvWords.has(keyword));
  const ratio = keywords.length ? matched.length / keywords.length : 0;

  return {
    keywords,
    matched,
    missing,
    ratio,
    percentage: Math.round(ratio * 100),
  };
}

export function inferSector(text) {
  const lower = normalise(text).toLowerCase();
  const match = Object.entries(SECTOR_KEYWORDS).find(([, terms]) => terms.some((term) => lower.includes(term)));
  return match?.[0] || 'general';
}

function classifyBullet(bullet, rules = ukIrelandGradRules) {
  const hasNumber = detectQuantification(bullet);
  const weakVerbs = detectWeakVerbs(bullet, rules);
  const forbiddenPhrases = detectForbiddenPhrases(bullet, rules);
  const strongVerb = detectStrongVerb(bullet, rules);
  const wordCount = words(bullet).length;
  const achievementShaped = Boolean(strongVerb && hasNumber);
  const dutyShaped = weakVerbs.length > 0 || /\b(responsible for|duties included|worked on|helped with)\b/i.test(bullet);

  return {
    text: bullet,
    wordCount,
    hasNumber,
    strongVerb,
    weakVerbs,
    forbiddenPhrases,
    achievementShaped,
    dutyShaped,
  };
}

function selectWeakestLine(classifiedBullets, cvText) {
  const weakBullet = classifiedBullets.find((bullet) => bullet.forbiddenPhrases.length || bullet.weakVerbs.length || bullet.dutyShaped);
  if (weakBullet) return weakBullet.text;

  const lines = normalise(cvText).split('\n').map((line) => line.trim()).filter((line) => line.length > 35);
  return lines[0] || 'Your CV needs one clearer evidence-led bullet that shows action, context, and result.';
}

function rewriteBullet(line) {
  const clean = normalise(line).replace(/^[-•*–—]\s+/, '');
  if (!clean) return 'Delivered a clearly defined task, using relevant skills, and improved the outcome for the team or service.';

  return `Delivered ${clean.charAt(0).toLowerCase()}${clean.slice(1).replace(/\.$/, '')}, adding clearer evidence of scope, method, and result.`;
}

function selectTopConcern({ classifiedBullets, coverage, pageEstimate, spellingIssues, cvText }) {
  if (!normalise(cvText)) return 'The CV text is missing, so the review cannot judge evidence yet.';
  if (pageEstimate > ukIrelandGradRules.cv.pageTargetMax) return 'The CV may be too long for a normal UK/Ireland graduate or early-career application.';
  if (coverage.percentage < 35) return 'The CV does not yet mirror enough important language from the target job description.';
  if (classifiedBullets.filter((bullet) => bullet.hasNumber).length === 0) return 'The CV needs more measurable evidence, such as scale, frequency, results, or volume.';
  if (classifiedBullets.some((bullet) => bullet.weakVerbs.length)) return 'Some bullets sound like duties rather than achievements.';
  if (spellingIssues.length) return 'Some spelling choices may not match UK/Ireland CV expectations.';
  return 'The CV is broadly on track, but it can still make the strongest evidence easier to see.';
}

function generateInterviewQuestion({ coverage, weakestLine, sector }) {
  const missingKeyword = coverage.missing[0];
  if (missingKeyword) return `Can you give a specific example that proves your experience with ${missingKeyword}?`;
  if (sector !== 'general') return `Which example best proves you are ready for a ${sector} role?`;
  return `Can you talk me through the evidence behind this line: “${weakestLine.slice(0, 90)}”?`;
}

function selectOneThingToDo({ coverage, classifiedBullets, spellingIssues, pageEstimate }) {
  if (coverage.percentage < 35 && coverage.missing[0]) return `Add one honest example that uses the job description term “${coverage.missing[0]}”.`;
  if (classifiedBullets.some((bullet) => !bullet.hasNumber)) return 'Add one number to your strongest bullet: scale, frequency, percentage, budget, users, cases, or time saved.';
  if (pageEstimate > ukIrelandGradRules.cv.pageTargetMax) return 'Cut repeated lines so the CV fits one to two A4 pages.';
  if (spellingIssues.length) return `Change “${spellingIssues[0].found}” to “${spellingIssues[0].preferred}” for UK/Ireland style.`;
  return 'Move the strongest achievement closer to the top of the CV.';
}

function generateVerdict({ score, sector, coverage, quantifiedRatio }) {
  const sectorText = sector === 'general' ? 'the target role' : `a ${sector} role`;
  if (score >= 80) return `Strong early signal for ${sectorText}. The CV has relevant language and enough evidence to support a focused application.`;
  if (score >= 65) return `Promising but not yet sharp enough for ${sectorText}. The CV needs clearer evidence and closer alignment with the job description.`;
  return `The CV is not ready for ${sectorText} yet. It needs stronger proof, more relevant keywords, and less duty-shaped wording before sending.`;
}

function scoreReview({ coverage, quantifiedRatio, strongVerbRatio, weakCount, forbiddenCount, spellingIssues, pageEstimate }, rules = ukIrelandGradRules) {
  let score = rules.scoring.base;
  score += Math.round(coverage.ratio * rules.scoring.keywordCoverageBonus);
  score += Math.round(quantifiedRatio * rules.scoring.quantificationBonus);
  score += Math.round(strongVerbRatio * rules.scoring.strongVerbBonus);
  if (pageEstimate > rules.cv.pageTargetMax) score -= rules.scoring.pagePenalty;
  if (weakCount > 0) score -= rules.scoring.weakVerbPenalty;
  if (forbiddenCount > 0) score -= rules.scoring.forbiddenPhrasePenalty;
  if (spellingIssues.length > 0) score -= rules.scoring.spellingPenalty;
  return Math.max(0, Math.min(100, score));
}

export function analyzeCV({ cvText = '', jobDescription = '', rules = ukIrelandGradRules } = {}) {
  const cv = normalise(cvText);
  const jd = normalise(jobDescription);
  const bullets = extractBullets(cv);
  const classifiedBullets = bullets.map((bullet) => classifyBullet(bullet, rules));
  const pageEstimate = estimatePages(cv);
  const coverage = keywordCoverage(cv, jd);
  const spellingIssues = detectSpellingIssues(cv);
  const sector = inferSector(`${jd} ${cv}`);
  const quantifiedCount = classifiedBullets.filter((bullet) => bullet.hasNumber).length;
  const strongVerbCount = classifiedBullets.filter((bullet) => bullet.strongVerb).length;
  const weakCount = classifiedBullets.filter((bullet) => bullet.weakVerbs.length).length;
  const forbiddenCount = classifiedBullets.filter((bullet) => bullet.forbiddenPhrases.length).length;
  const quantifiedRatio = classifiedBullets.length ? quantifiedCount / classifiedBullets.length : 0;
  const strongVerbRatio = classifiedBullets.length ? strongVerbCount / classifiedBullets.length : 0;
  const score = scoreReview({ coverage, quantifiedRatio, strongVerbRatio, weakCount, forbiddenCount, spellingIssues, pageEstimate }, rules);
  const weakestLine = selectWeakestLine(classifiedBullets, cv);
  const topConcern = selectTopConcern({ classifiedBullets, coverage, pageEstimate, spellingIssues, cvText: cv });
  const interviewQuestion = generateInterviewQuestion({ coverage, weakestLine, sector });
  const oneThingToDo = selectOneThingToDo({ coverage, classifiedBullets, spellingIssues, pageEstimate });
  const verdict = generateVerdict({ score, sector, coverage, quantifiedRatio });

  return {
    source: 'local-heuristic',
    ruleset: rules.id,
    regionLabel: rules.regionLabel,
    verdict,
    fit_score: score,
    score,
    top_concerns: unique([
      topConcern,
      coverage.percentage < 50 ? 'Important job-description terms are missing or under-evidenced.' : '',
      quantifiedRatio < 0.35 ? 'Too many bullets lack measurable evidence.' : '',
      weakCount > 0 ? 'Some bullets use weak or duty-shaped wording.' : '',
    ]).slice(0, 4),
    questions: [interviewQuestion],
    likely_interview_questions: [interviewQuestion],
    weakest_line: weakestLine,
    rewritten_bullet: rewriteBullet(weakestLine),
    quick_wins: unique([
      oneThingToDo,
      'Keep the CV to one or two A4 pages for normal UK/Ireland applications.',
      'Remove photo, date of birth, marital status, and full address unless a role specifically requires them.',
    ]),
    risk_flags: unique([
      coverage.percentage < 35 ? 'low_keyword_coverage' : '',
      quantifiedRatio < 0.35 ? 'low_quantification' : '',
      weakCount > 0 ? 'weak_verbs' : '',
      forbiddenCount > 0 ? 'generic_phrases' : '',
      spellingIssues.length ? 'spelling_style' : '',
      pageEstimate > rules.cv.pageTargetMax ? 'too_long' : '',
    ]),
    metrics: {
      bulletCount: classifiedBullets.length,
      quantifiedCount,
      quantifiedRatio,
      strongVerbCount,
      weakCount,
      forbiddenCount,
      pageEstimate,
      keywordCoverage: coverage,
      spellingIssues,
      sector,
      hasEmail: EMAIL_PATTERN.test(cv),
      hasPhone: PHONE_PATTERN.test(cv),
      hasDates: DATE_PATTERN.test(cv),
    },
  };
}

export default analyzeCV;
