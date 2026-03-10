import { DEFAULT_STATE, STORAGE_KEY } from './data.js';

export function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function persistState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearStoredState() {
  localStorage.removeItem(STORAGE_KEY);
}
