export const APPLICATION_CONTEXT_VERSION = 1;

export function emptyApplicationContext() {
  return {
    version: APPLICATION_CONTEXT_VERSION,
    updatedAt: null,
    smartStart: {
      targetRole: '',
      targetRegion: 'uk-ie',
      cvFormat: 'ukIrelandGrad',
      careerStage: '',
      primaryWorry: '',
      jobDescription: '',
      targetSector: '',
      answers: {},
      completedAt: null,
    },
    recommendation: {
      generatedAt: null,
      output: null,
    },
    cv: {
      profile: '',
      roles: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      selectedTemplate: 'clean-ats',
      lastSavedId: null,
    },
    coverLetter: {
      draft: '',
      updatedAt: null,
    },
    reviews: {
      lastReview: null,
      byHash: {},
    },
    preferences: {
      localFirstAcknowledged: false,
    },
  };
}

function mergeDefaults(value, defaults) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults;

  return Object.entries(defaults).reduce(
    (merged, [key, defaultValue]) => ({
      ...merged,
      [key]: mergeDefaults(value[key], defaultValue),
    }),
    { ...value }
  );
}

export function migrateApplicationContext(rawContext) {
  const defaults = emptyApplicationContext();
  const context = mergeDefaults(rawContext, defaults);

  return {
    ...context,
    smartStart: {
      ...context.smartStart,
      targetRegion: context.smartStart.targetRegion === 'uk' ? 'uk-ie' : context.smartStart.targetRegion,
      cvFormat: context.smartStart.cvFormat === 'ukGrad' ? 'ukIrelandGrad' : context.smartStart.cvFormat,
    },
    version: APPLICATION_CONTEXT_VERSION,
  };
}
