export const ukIrelandGradRules = {
  id: 'ukIrelandGrad',
  label: 'UK/Ireland Graduate CV',
  regionLabel: 'UK/Ireland',
  documentName: 'CV',
  paperSize: 'A4',
  spelling: 'British English',
  cv: {
    pageTargetMin: 1,
    pageTargetMax: 2,
    preferredSections: ['Profile', 'Education', 'Experience', 'Projects', 'Skills', 'Certifications'],
    sectionOrder: ['Profile', 'Education', 'Experience', 'Projects', 'Skills', 'Certifications', 'Volunteering', 'Interests'],
  },
  personalDetails: {
    photo: 'avoid',
    dateOfBirth: 'avoid',
    maritalStatus: 'avoid',
    nationality: 'usually_avoid',
    fullAddress: 'avoid_full_address',
    visaStatus: 'include_only_if_relevant',
    phoneEmailLocation: 'recommended',
  },
  ats: {
    avoid: ['tables for core content', 'text boxes', 'photos', 'icons used as labels', 'two-column layouts for important information'],
    prefer: ['clear headings', 'plain bullets', 'standard dates', 'role and organisation names', 'measurable evidence'],
  },
  bullet: {
    minWords: 7,
    maxWords: 32,
    strongVerbs: ['built', 'led', 'delivered', 'improved', 'coordinated', 'analysed', 'created', 'managed', 'reduced', 'increased', 'supported', 'implemented', 'designed'],
    weakVerbs: ['helped', 'worked on', 'responsible for', 'involved in', 'assisted with', 'participated in', 'dealt with', 'various'],
    forbiddenPhrases: ['team player', 'hard worker', 'go getter', 'results driven', 'detail oriented', 'good communication skills', 'works well under pressure'],
  },
  scoring: {
    base: 62,
    quantificationBonus: 12,
    keywordCoverageBonus: 14,
    strongVerbBonus: 6,
    pagePenalty: 8,
    weakVerbPenalty: 8,
    forbiddenPhrasePenalty: 8,
    spellingPenalty: 5,
  },
  sectorOverrides: {
    tech: {
      preferredSections: ['Profile', 'Technical Skills', 'Projects', 'Experience', 'Education', 'Certifications'],
      evidence: ['projects', 'tools', 'GitHub or portfolio', 'technical outcomes'],
    },
    public: {
      preferredSections: ['Profile', 'Experience', 'Education', 'Skills', 'Volunteering', 'Certifications'],
      evidence: ['stakeholder coordination', 'documentation', 'compliance', 'service outcomes'],
    },
    research: {
      preferredSections: ['Profile', 'Research Experience', 'Projects', 'Publications', 'Education', 'Skills'],
      evidence: ['methods', 'outputs', 'datasets', 'ethics or compliance', 'stakeholders'],
    },
    consulting: {
      preferredSections: ['Profile', 'Experience', 'Projects', 'Skills', 'Education', 'Certifications'],
      evidence: ['clients', 'analysis', 'recommendations', 'delivery', 'measurable impact'],
    },
  },
  guidance: [
    'Keep the CV to one or two A4 pages unless the role specifically asks for more.',
    'Do not include a photo, date of birth, marital status, or full home address for normal UK/Ireland applications.',
    'Use evidence-led bullets: action, context, result.',
    'Mirror important job-description terms naturally, but do not keyword-stuff.',
  ],
};

export default ukIrelandGradRules;
