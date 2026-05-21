export const SMART_START_KEY = 'gradsharp_smart_start';

export const DEFAULT_SMART_START = {
  targetRole: '',
  jobDescription: '',
  regionId: 'uk-ireland',
  categoryId: 'professional',
  careerStage: 'professional',
  recommendationTimestamp: null,
};

export function getStoredSmartStart() {
  if (typeof window === 'undefined') return DEFAULT_SMART_START;

  try {
    const raw = window.localStorage.getItem(SMART_START_KEY);
    if (!raw) return DEFAULT_SMART_START;
    return { ...DEFAULT_SMART_START, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SMART_START;
  }
}

export function saveSmartStart(values) {
  const next = {
    ...DEFAULT_SMART_START,
    ...values,
    recommendationTimestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SMART_START_KEY, JSON.stringify(next));
  }

  return next;
}
