import { STOP_WORDS } from '../data/stopWords';

const HARD_SKILLS = ['python','javascript','sql','java','c++','c#','r','matlab','scala','ruby','php','swift','kotlin','typescript','html','css','machine learning','data analysis','statistical analysis','financial modelling','project management','agile','scrum','lean','six sigma','devops','ci/cd','cloud computing','cybersecurity','networking','blockchain','ux design','ui design','seo','ppc','content strategy','copywriting','procurement','logistics','supply chain','budgeting','forecasting','auditing','compliance'];

const TOOLS_SOFTWARE = ['excel','word','powerpoint','outlook','google docs','google sheets','tableau','power bi','salesforce','hubspot','jira','confluence','slack','trello','asana','notion','figma','sketch','adobe','photoshop','illustrator','indesign','xd','premiere','after effects','sap','oracle','quickbooks','xero','sage','servicenow','zendesk','aws','azure','gcp','docker','kubernetes','git','github','gitlab','jenkins','terraform','pandas','numpy','tensorflow','pytorch','scikit-learn'];

const QUALIFICATIONS = ["bachelor's",'bsc','ba','msc','ma','mba','phd','degree','diploma','certificate','hnd','hnc','level 5','level 6','level 7','level 8','nfq','qqi'];

const CERTIFICATIONS = ['pmp','prince2','agile','scrum master','cissp','ceh','aws certified','azure certified','google certified','comptia','ccna','ccnp','cpa','acca','cfa','cima','prince','itil','togaf','safe','six sigma','lean','iso','gdpr'];

const ROLE_TITLES = ['manager','director','analyst','engineer','developer','designer','coordinator','specialist','consultant','officer','administrator','executive','lead','head','chief','senior','junior','associate','graduate','intern','advisor','researcher','scientist'];

const SOFT_SKILLS_LIST = ['communication','leadership','teamwork','collaboration','problem-solving','critical thinking','adaptability','time management','attention to detail','organisational','stakeholder management','presentation','negotiation','mentoring','coaching','conflict resolution','decision making','creativity','innovation','emotional intelligence'];

const INDUSTRY_TERMS = ['roi','kpi','sla','crm','erp','api','saas','b2b','b2c','mvp','ipo','esg','gdpr','pci','hipaa','sox','ifrs','gaap','aml','kyc','nps','csat'];

const SECTION_WEIGHTS = { requirements: 2.0, essential: 2.0, 'must have': 2.0, 'must-have': 2.0, responsibilities: 1.5, 'nice to have': 1.0, 'nice-to-have': 1.0, preferred: 1.0, desirable: 1.0 };

const tokenize = (text) => {
  if (!text) return [];
  return text.toLowerCase().replace(/[^a-z0-9\s\-+#/.]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
};

const detectSection = (lines, index) => {
  for (let i = index; i >= Math.max(0, index - 10); i--) {
    const line = (lines[i] || '').toLowerCase();
    for (const [key, weight] of Object.entries(SECTION_WEIGHTS)) {
      if (line.includes(key)) return weight;
    }
  }
  return 1.0;
};

export const extractEnhancedKeywords = (jobDescription) => {
  if (!jobDescription?.trim()) return null;

  const lines = jobDescription.split('\n');
  const allTokens = tokenize(jobDescription);
  const freqMap = {};
  allTokens.forEach(t => { freqMap[t] = (freqMap[t] || 0) + 1; });

  // Weighted frequency
  const weightedMap = {};
  lines.forEach((line, idx) => {
    const sectionWeight = detectSection(lines, idx);
    const tokens = tokenize(line);
    tokens.forEach(t => {
      weightedMap[t] = (weightedMap[t] || 0) + sectionWeight;
    });
  });

  // Title-line boost
  const titleLine = lines[0] || '';
  tokenize(titleLine).forEach(t => { weightedMap[t] = (weightedMap[t] || 0) + 3; });

  const lower = jobDescription.toLowerCase();

  const hardSkills = HARD_SKILLS.filter(s => lower.includes(s));
  const tools = TOOLS_SOFTWARE.filter(t => lower.includes(t));
  const qualifications = QUALIFICATIONS.filter(q => lower.includes(q));
  const certifications = CERTIFICATIONS.filter(c => lower.includes(c));
  const roleTitles = ROLE_TITLES.filter(r => lower.includes(r));
  const softSkills = SOFT_SKILLS_LIST.filter(s => lower.includes(s));
  const industryTerms = INDUSTRY_TERMS.filter(i => lower.includes(i));

  // Repeated verbs
  const verbPattern = /\b(manage|develop|lead|deliver|analyse|support|coordinate|implement|drive|build|create|design|improve|maintain|monitor|report|collaborate|communicate|present|train|mentor)\w*\b/gi;
  const verbMatches = jobDescription.match(verbPattern) || [];
  const verbFreq = {};
  verbMatches.forEach(v => { const lv = v.toLowerCase(); verbFreq[lv] = (verbFreq[lv] || 0) + 1; });
  const repeatedVerbs = Object.entries(verbFreq).filter(([, c]) => c >= 2).map(([v]) => v);

  // High-priority keywords (weighted score >= 3 AND frequency >= 2)
  const highPriority = Object.entries(weightedMap)
    .filter(([w, ws]) => ws >= 3 && freqMap[w] >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w);

  const mediumPriority = Object.entries(weightedMap)
    .filter(([w, ws]) => ws >= 1.5 && freqMap[w] === 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);

  return {
    hardSkills,
    tools,
    qualifications,
    certifications,
    roleTitles,
    softSkills,
    industryTerms,
    repeatedVerbs,
    highPriority,
    mediumPriority,
    allWeighted: weightedMap,
  };
};

// ─── Truthful Keyword Suggestions ────────────────────────────────────────────
export const getTruthfulKeywordSuggestions = (keywordData, cvText) => {
  if (!keywordData || !cvText) return null;

  const cvLower = cvText.toLowerCase();
  const allJdKeywords = [
    ...keywordData.hardSkills,
    ...keywordData.tools,
    ...keywordData.certifications,
    ...keywordData.highPriority,
  ];

  const sectionMap = {
    'technical skill': 'Skills section',
    'tool': 'Skills section',
    'soft skill': 'Summary or Experience bullets',
    'qualification': 'Education section',
    'certification': 'Certifications section',
  };

  const matched = allJdKeywords.filter(k => cvLower.includes(k.toLowerCase()));
  const missing = allJdKeywords.filter(k => !cvLower.includes(k.toLowerCase()));

  const suggestions = missing.slice(0, 8).map(keyword => {
    let where = 'Skills, Summary, or Experience';
    if (keywordData.tools.includes(keyword)) where = 'Skills section (Tools & Software)';
    else if (keywordData.certifications.includes(keyword)) where = 'Certifications section';
    else if (keywordData.qualifications.includes(keyword)) where = 'Education section';
    else if (keywordData.hardSkills.includes(keyword)) where = 'Skills section (Technical Skills)';
    else if (keywordData.softSkills.includes(keyword)) where = 'Professional Summary or Experience bullets';
    return { keyword, where, priority: keywordData.highPriority.includes(keyword) ? 'high' : 'medium' };
  });

  return { matched, missing: missing.slice(0, 10), suggestions };
};