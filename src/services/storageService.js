import { APP_CONFIG } from '../config/appConfig';

const STORAGE_KEY = APP_CONFIG.storageKeys.cvs;
const CL_KEY = APP_CONFIG.storageKeys.coverLetters;
const PACK_KEY = APP_CONFIG.storageKeys.appPacks;

export const getAllCVs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const saveCV = (cv) => {
  const cvs = getAllCVs();
  const existing = cvs.findIndex(c => c.id === cv.id);
  if (existing >= 0) {
    cvs[existing] = { ...cv, updatedAt: new Date().toISOString() };
  } else {
    cvs.unshift({ ...cv, id: cv.id || Date.now().toString(), createdAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
  return cv;
};

export const deleteCV = (id) => {
  const cvs = getAllCVs().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
};

export const duplicateCV = (id) => {
  const cvs = getAllCVs();
  const original = cvs.find(c => c.id === id);
  if (!original) return null;
  const copy = { ...original, id: Date.now().toString(), name: `${original.name} (Copy)`, createdAt: new Date().toISOString() };
  cvs.unshift(copy);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
  return copy;
};

export const getCVById = (id) => getAllCVs().find(c => c.id === id) || null;

export const renameCV = (id, newName) => {
  const cvs = getAllCVs();
  const idx = cvs.findIndex(c => c.id === id);
  if (idx < 0) return;
  cvs[idx] = { ...cvs[idx], name: newName, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
};

// ─── Cover Letters ────────────────────────────────────────────────────────────
export const getAllCoverLetters = () => {
  try { return JSON.parse(localStorage.getItem(CL_KEY) || '[]'); } catch { return []; }
};
export const saveCoverLetter = (cl) => {
  const items = getAllCoverLetters();
  const idx = items.findIndex(c => c.id === cl.id);
  if (idx >= 0) { items[idx] = { ...cl, updatedAt: new Date().toISOString() }; }
  else { items.unshift({ ...cl, id: cl.id || Date.now().toString(), createdAt: new Date().toISOString() }); }
  localStorage.setItem(CL_KEY, JSON.stringify(items));
};
export const deleteCoverLetter = (id) => {
  localStorage.setItem(CL_KEY, JSON.stringify(getAllCoverLetters().filter(c => c.id !== id)));
};

// ─── Application Packs (CV + Cover Letter) ────────────────────────────────────
export const getAllPacks = () => {
  try { return JSON.parse(localStorage.getItem(PACK_KEY) || '[]'); } catch { return []; }
};
export const savePack = (pack) => {
  const items = getAllPacks();
  items.unshift({ ...pack, id: Date.now().toString(), createdAt: new Date().toISOString() });
  localStorage.setItem(PACK_KEY, JSON.stringify(items));
};
export const deletePack = (id) => {
  localStorage.setItem(PACK_KEY, JSON.stringify(getAllPacks().filter(p => p.id !== id)));
};