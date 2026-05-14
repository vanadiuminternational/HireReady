import { STOP_WORDS } from '../data/stopWords';
import { ACTION_VERBS, getAllVerbs } from '../data/actionVerbs';
import { selectTemplate as selectTemplateRule } from '../data/templateRules';
import { validateAtsSafety, recruiterReadabilityScore, validateCvLength, validateContactInfo, getExportGuidance, scoreBulletQuality } from './atsValidatorService';
import { extractEnhancedKeywords, getTruthfulKeywordSuggestions } from './keywordEngineService';

// ─── Tokenize ────────────────────────────────────────────────────────────────
const tokenize = (text) => {
  if (!text) return [];
  return text.toLowerCase().replace(/[^a-z0-9\s\-+#/.]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
};
const countFrequency = (tokens) => {
  const freq = {};
  tokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
  return freq;
};

// ─── Job Description Analysis ─────────────────────────────────────────────────
export const analyseJobDescription = (jobDescription) => {
  if (!jobDescription?.trim()) return null;
  const enhanced = extractEnhancedKeywords(jobDescription);
  const tokens = tokenize(jobDescription);
  const freq = countFrequency(tokens);
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const topKeywords = sorted.slice(0, 30).map(([word]) => word);
  return { ...enhanced, topKeywords, rawFrequency: freq };
};

export const extractKeywords = (jobDescription) => {
  if (!jobDescription) return [];
  const tokens = tokenize(jobDescription);
  const freq = countFrequency(tokens);
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([word]) => word);
};

// ─── Template Selector (reverse-chron default) ────────────────────────────────
export const selectTemplate = (userInput, jobAnalysis) => {
  return selectTemplateRule(userInput.experienceLevel, userInput.industry);
};

// ─── Professional Summary ─────────────────────────────────────────────────────
export const buildProfessionalSummary = (userInput, jobAnalysis) => {
  const { currentRole, yearsExperience, topSkills, mainAchievement, careerGoal, targetJobTitle, experienceLevel } = userInput;
  if (!currentRole && !targetJobTitle) return '';

  const role = currentRole || targetJobTitle || 'professional';
  const years = yearsExperience ? `${yearsExperience} year${yearsExperience === '1' ? '' : 's'} of experience` : '';
  const skills = topSkills ? topSkills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3).join(', ') : '';

  let summary = '';
  if (experienceLevel === 'Student') {
    summary = `Motivated ${targetJobTitle || 'student'} with a strong academic foundation${skills ? ` in ${skills}` : ''}. `;
    if (mainAchievement) summary += `${mainAchievement}. `;
    if (careerGoal) summary += `Seeking ${careerGoal}.`;
  } else if (experienceLevel === 'Graduate') {
    summary = `Recent graduate with a background in ${role}${skills ? ` and skills in ${skills}` : ''}. `;
    if (mainAchievement) summary += `${mainAchievement}. `;
    if (careerGoal) summary += `Eager to ${careerGoal}.`;
  } else if (experienceLevel === 'Career Changer') {
    summary = `Experienced professional transitioning into ${targetJobTitle || 'a new field'} with transferable expertise in ${role}. `;
    if (skills) summary += `Core strengths include ${skills}. `;
    if (careerGoal) summary += `Committed to ${careerGoal}.`;
  } else {
    summary = `${years ? `${years.charAt(0).toUpperCase() + years.slice(1)} as a` : 'Experienced'} ${role}${skills ? ` with expertise in ${skills}` : ''}. `;
    if (mainAchievement) summary += `${mainAchievement}. `;
    if (careerGoal) summary += `${careerGoal}.`;
  }
  return summary.trim();
};

// ─── Core Skills ──────────────────────────────────────────────────────────────
export const buildCoreSkills = (userInput, jobAnalysis) => {
  const all = [
    ...(userInput.technicalSkills || '').split(','),
    ...(userInput.softSkills || '').split(','),
    ...(userInput.topSkills || '').split(','),
  ].map(s => s.trim()).filter(Boolean);

  if (jobAnalysis) {
    const jdSkills = [...(jobAnalysis.hardSkills || []), ...(jobAnalysis.tools || []), ...(jobAnalysis.topKeywords || [])];
    const matched = jdSkills.filter(k => all.some(s => s.toLowerCase().includes(k) || k.includes(s.toLowerCase())));
    return [...new Set([...matched, ...all])].slice(0, 12);
  }
  return [...new Set(all)].slice(0, 12);
};

// ─── Experience Bullets (reverse-chron default) ───────────────────────────────
export const buildExperienceBullets = (expEntry, jobAnalysis) => {
  const bullets = [];
  const verb = ACTION_VERBS.achievement[Math.floor(Math.random() * ACTION_VERBS.achievement.length)];

  if (expEntry.achievements) {
    expEntry.achievements.split('\n').filter(Boolean).forEach(line => {
      if (!line.trim()) return;
      const hasVerb = getAllVerbs().some(v => line.trim().toLowerCase().startsWith(v.toLowerCase()));
      bullets.push(hasVerb ? line.trim() : `${verb} ${line.trim()}`);
    });
  }
  if (expEntry.responsibilities) {
    expEntry.responsibilities.split('\n').filter(Boolean).forEach(line => {
      if (!line.trim()) return;
      const hasVerb = getAllVerbs().some(v => line.trim().toLowerCase().startsWith(v.toLowerCase()));
      bullets.push(hasVerb ? line.trim() : `${ACTION_VERBS.operations[Math.floor(Math.random() * ACTION_VERBS.operations.length)]} ${line.trim()}`);
    });
  }
  if (expEntry.metrics) bullets.push(`Delivered measurable results: ${expEntry.metrics}`);

  return bullets.slice(0, 6);
};

export const buildEducationSection = (userInput) => {
  return (userInput.education || []).map(edu => ({
    degree: edu.degree, institution: edu.institution, location: edu.location,
    dates: `${edu.startDate || ''} – ${edu.endDate || 'Present'}`,
    modules: edu.modules, project: edu.project,
  }));
};

export const buildProjectsSection = (userInput, jobAnalysis) => {
  return (userInput.projects || []).map(proj => ({
    name: proj.name, context: proj.context, action: proj.action, result: proj.result, skills: proj.skills,
    bullet: proj.action && proj.result ? `${proj.action}. ${proj.result ? `Result: ${proj.result}` : ''}` : proj.context || '',
  }));
};

// ─── ATS Score (enhanced 5-category) ─────────────────────────────────────────
export const calculateAtsScore = (userInput, jobAnalysis, generatedCv) => {
  let atsFormatting = 25; // Always safe since we generate safe format
  let keywordScore = 0;
  let readabilityScore = 0;
  let achievementScore = 0;
  let contactScore = 0;
  const warnings = [];
  const tips = [];

  // Keywords (25)
  if (jobAnalysis && generatedCv) {
    const cvLower = generatedCv.toLowerCase();
    const allKw = [...new Set([...(jobAnalysis.highPriority || []), ...(jobAnalysis.topKeywords || [])])];
    const matched = allKw.filter(k => cvLower.includes(k));
    keywordScore = Math.round((matched.length / Math.max(allKw.length, 1)) * 25);
    if (keywordScore < 10) { warnings.push('Low keyword match. Review the Keywords tab.'); tips.push('Add relevant job keywords naturally to your Skills and Summary.'); }
  } else {
    keywordScore = 12;
    tips.push('Paste a job description to get a precise keyword match score.');
  }

  // Readability (20)
  if (generatedCv) {
    const readResult = recruiterReadabilityScore(generatedCv, userInput);
    readabilityScore = Math.round((readResult.score / 100) * 20);
    readResult.notes.forEach(n => tips.push(n));
  } else {
    readabilityScore = 10;
  }

  // Achievements (20)
  const allText = JSON.stringify(userInput).toLowerCase();
  const hasNumbers = /\d+/.test(allText);
  const hasVerbs = getAllVerbs().some(v => allText.includes(v.toLowerCase()));
  if (hasNumbers) achievementScore += 10;
  if (hasVerbs) achievementScore += 10;
  if (!hasNumbers) warnings.push('Add measurable results (%, €, numbers) to strengthen achievements.');

  // Contact (10)
  const contactResult = validateContactInfo(userInput);
  contactScore = Math.round((contactResult.passed.length / 5) * 10);
  contactResult.warnings.forEach(w => warnings.push(w));

  const score = Math.min(atsFormatting + keywordScore + readabilityScore + achievementScore + contactScore, 100);
  return {
    score,
    categories: { ats: atsFormatting, keywords: keywordScore, readability: readabilityScore, achievements: achievementScore, contact: contactScore },
    warnings,
    tips,
  };
};

export const generateImprovementTips = (userInput, jobAnalysis, generatedCv) => {
  const tips = [];
  if (jobAnalysis) {
    const cvLower = (generatedCv || '').toLowerCase();
    const missing = (jobAnalysis.highPriority || []).filter(k => !cvLower.includes(k)).slice(0, 5);
    if (missing.length > 0) tips.push(`Consider adding these high-priority keywords if relevant: ${missing.join(', ')}`);
  }
  if (!(userInput.experience || []).some(e => e.achievements)) tips.push('Add specific achievements to each role, not just responsibilities.');
  if (!userInput.linkedin) tips.push('Add a LinkedIn URL to your contact details.');
  if ((userInput.experience || []).length === 0) tips.push('Add at least one work experience entry, even part-time or volunteer work.');
  if (userInput.experienceLevel === 'Student' && (userInput.projects || []).length === 0) tips.push('Add academic or personal projects to demonstrate your skills.');
  tips.push('Use Month YYYY date format consistently (e.g. Jan 2023 – Dec 2024).');
  tips.push('Keep bullet points concise: aim for 1–2 lines each.');
  return tips;
};

// ─── Full CV Generator ────────────────────────────────────────────────────────
export const generateCv = (userInput) => {
  const jobAnalysis = userInput.jobDescription ? analyseJobDescription(userInput.jobDescription) : null;
  const template = selectTemplate(userInput, jobAnalysis);
  const summary = buildProfessionalSummary(userInput, jobAnalysis);
  const coreSkills = buildCoreSkills(userInput, jobAnalysis);

  // Reverse-chronological order for experience (default for professionals)
  const experiences = [...(userInput.experience || [])];
  if (userInput.experienceLevel !== 'Student' && userInput.experienceLevel !== 'Graduate') {
    experiences.sort((a, b) => {
      const aYear = parseInt((a.startDate || '').match(/\d{4}/)?.[0] || '0');
      const bYear = parseInt((b.startDate || '').match(/\d{4}/)?.[0] || '0');
      return bYear - aYear;
    });
  }

  let cvText = '';
  cvText += `${userInput.fullName || 'Your Name'}\n`;
  const contactParts = [userInput.email, userInput.phone, userInput.cityCountry, userInput.linkedin].filter(Boolean);
  cvText += contactParts.join(' | ') + '\n';
  if (userInput.portfolio) cvText += `Portfolio: ${userInput.portfolio}\n`;
  cvText += '\n';

  if (userInput.targetJobTitle) cvText += `${userInput.targetJobTitle.toUpperCase()}\n\n`;

  if (summary) cvText += `PROFESSIONAL SUMMARY\n${'─'.repeat(40)}\n${summary}\n\n`;

  if (coreSkills.length > 0) cvText += `CORE SKILLS\n${'─'.repeat(40)}\n${coreSkills.join(' • ')}\n\n`;

  if (experiences.length > 0) {
    cvText += `PROFESSIONAL EXPERIENCE\n${'─'.repeat(40)}\n`;
    experiences.forEach(exp => {
      const dates = `${exp.startDate || ''} – ${exp.currentRole ? 'Present' : (exp.endDate || '')}`;
      cvText += `${exp.jobTitle || 'Role'} | ${exp.company || 'Company'} | ${exp.location || ''} | ${dates}\n`;
      buildExperienceBullets(exp, jobAnalysis).forEach(b => { cvText += `• ${b}\n`; });
      cvText += '\n';
    });
  }

  const projects = buildProjectsSection(userInput, jobAnalysis);
  if (projects.length > 0) {
    cvText += `PROJECTS & ACHIEVEMENTS\n${'─'.repeat(40)}\n`;
    projects.forEach(p => {
      cvText += `${p.name || 'Project'}\n`;
      if (p.bullet) cvText += `• ${p.bullet}\n`;
      if (p.skills) cvText += `Skills: ${p.skills}\n`;
      cvText += '\n';
    });
  }

  const education = buildEducationSection(userInput);
  if (education.length > 0) {
    cvText += `EDUCATION\n${'─'.repeat(40)}\n`;
    education.forEach(edu => {
      cvText += `${edu.degree || 'Degree'} | ${edu.institution || 'Institution'} | ${edu.dates}\n`;
      if (edu.modules) cvText += `Key Modules: ${edu.modules}\n`;
      if (edu.project) cvText += `Project: ${edu.project}\n`;
      cvText += '\n';
    });
  }

  if (userInput.certifications) cvText += `CERTIFICATIONS\n${'─'.repeat(40)}\n${userInput.certifications}\n\n`;
  if (userInput.languages) cvText += `LANGUAGES\n${'─'.repeat(40)}\n${userInput.languages}\n\n`;

  // Enhanced scoring
  const atsResult = calculateAtsScore(userInput, jobAnalysis, cvText);
  const tips = generateImprovementTips(userInput, jobAnalysis, cvText);
  const atsValidation = validateAtsSafety(cvText, userInput);
  const lengthValidation = validateCvLength(cvText, userInput);
  const exportGuidance = getExportGuidance(userInput);

  // Keyword analysis
  const keywordSuggestions = jobAnalysis ? getTruthfulKeywordSuggestions(jobAnalysis, cvText) : null;
  const keywordAnalysis = jobAnalysis ? {
    matched: (jobAnalysis.topKeywords || []).filter(k => cvText.toLowerCase().includes(k)),
    missing: (jobAnalysis.topKeywords || []).filter(k => !cvText.toLowerCase().includes(k)).slice(0, 10),
    jobKeywords: jobAnalysis.topKeywords || [],
  } : null;

  // Bullet quality scoring
  const bullets = cvText.split('\n').filter(l => l.trim().startsWith('•')).map(b => b.trim().slice(1).trim());
  const bulletSuggestions = bullets.slice(0, 5).map(b => ({ original: b, ...scoreBulletQuality(b) }));

  // Full score breakdown
  const top5Fixes = [
    ...atsResult.warnings,
    ...atsValidation.warnings.slice(0, 2),
    ...lengthValidation.warnings,
    ...tips.slice(0, 2),
  ].filter(Boolean).slice(0, 5);

  const fullBreakdown = {
    overall: atsResult.score,
    categories: atsResult.categories,
    top5Fixes,
    bulletSuggestions,
    atsWarnings: [...atsValidation.warnings, ...lengthValidation.warnings],
    exportGuidance,
    lengthInfo: lengthValidation.info,
  };

  return { cvText, template, atsResult, tips, keywordAnalysis, keywordSuggestions, jobAnalysis, fullBreakdown, atsValidation };
};

// ─── Cover Letter ─────────────────────────────────────────────────────────────
export const generateCoverLetter = (userInput, jobAnalysis) => {
  const { fullName, targetJobTitle, currentRole, yearsExperience, topSkills, mainAchievement } = userInput;
  const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  let letter = `${fullName || 'Your Name'}\n${[userInput.email, userInput.phone].filter(Boolean).join(' | ')}\n${today}\n\nHiring Manager\n\nDear Hiring Manager,\n\n`;
  letter += `I am writing to express my interest in the ${targetJobTitle || 'position'} role. `;
  if (currentRole && yearsExperience) letter += `With ${yearsExperience} year${yearsExperience === '1' ? '' : 's'} of experience as a ${currentRole}, `;
  const skills = topSkills ? topSkills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3) : [];
  letter += skills.length > 0 ? `I bring strong expertise in ${skills.join(', ')}.\n\n` : `I am confident I can contribute effectively to your team.\n\n`;
  if (mainAchievement) letter += `${mainAchievement}\n\n`;
  if (jobAnalysis?.hardSkills?.length > 0) letter += `I was particularly drawn to this role given the emphasis on ${jobAnalysis.hardSkills.slice(0, 3).join(', ')}, areas where I have developed strong capability.\n\n`;
  letter += `I would welcome the opportunity to discuss how my background aligns with your requirements. Thank you for considering my application.\n\nYours sincerely,\n${fullName || 'Your Name'}`;
  return letter;
};