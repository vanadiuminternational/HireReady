import { emptyApplicationContext, migrateApplicationContext, APPLICATION_CONTEXT_VERSION } from './applicationContext.migrations';
import { readStorage, writeStorage } from './storage';

export const APPLICATION_CONTEXT_STORAGE_KEY = 'hireready.applicationContext';

export { APPLICATION_CONTEXT_VERSION, emptyApplicationContext };

export function getApplicationContext() {
  const raw = readStorage(APPLICATION_CONTEXT_STORAGE_KEY, null);
  return migrateApplicationContext(raw);
}

export function saveApplicationContext(context) {
  const migrated = migrateApplicationContext(context);
  const next = {
    ...migrated,
    updatedAt: new Date().toISOString(),
  };
  writeStorage(APPLICATION_CONTEXT_STORAGE_KEY, next);
  return next;
}

export function patchApplicationContext(patch) {
  const current = getApplicationContext();
  const next = typeof patch === 'function' ? patch(current) : deepMerge(current, patch);
  return saveApplicationContext(next);
}

export function resetApplicationContext() {
  return saveApplicationContext(emptyApplicationContext());
}

export function storeReviewResult(inputHash, review) {
  return patchApplicationContext((current) => ({
    ...current,
    reviews: {
      ...current.reviews,
      lastReview: {
        inputHash,
        review,
        updatedAt: new Date().toISOString(),
      },
      byHash: {
        ...current.reviews.byHash,
        [inputHash]: {
          review,
          updatedAt: new Date().toISOString(),
        },
      },
    },
  }));
}

export function getCachedReview(inputHash) {
  const context = getApplicationContext();
  return context.reviews.byHash[inputHash]?.review || null;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function deepMerge(target, source) {
  if (!isPlainObject(source)) return target;

  return Object.entries(source).reduce((merged, [key, value]) => {
    if (isPlainObject(value) && isPlainObject(merged[key])) {
      return {
        ...merged,
        [key]: deepMerge(merged[key], value),
      };
    }

    return {
      ...merged,
      [key]: value,
    };
  }, { ...target });
}
