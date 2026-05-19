const JSON_PREFIX = 'json:';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function readStorage(key, fallback = null) {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;

    if (raw.startsWith(JSON_PREFIX)) {
      return JSON.parse(raw.slice(JSON_PREFIX.length));
    }

    return raw;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (!canUseStorage()) return false;

  try {
    const payload = typeof value === 'string' ? value : `${JSON_PREFIX}${JSON.stringify(value)}`;
    window.localStorage.setItem(key, payload);
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key) {
  if (!canUseStorage()) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function updateStorage(key, updater, fallback = null) {
  const current = readStorage(key, fallback);
  const next = updater(current);
  writeStorage(key, next);
  return next;
}
