import { DEFAULT_STATE, FIELD_VALIDATORS } from './data.js';
import { persistState } from './storage.js';

let state = { ...DEFAULT_STATE };
const listeners = new Set();

export function initializeState(initialState) {
  state = { ...DEFAULT_STATE, ...initialState };
  notify();
}

export function getState() {
  return { ...state };
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function patchState(partial) {
  state = { ...state, ...partial };
  persistState(state);
  notify();
}

export function resetState() {
  state = { ...DEFAULT_STATE };
  persistState(state);
  notify();
}

export function validateField(name, value) {
  const rule = FIELD_VALIDATORS[name];
  if (!rule) return { valid: true, message: '' };
  const valid = rule(String(value ?? ''));
  return {
    valid,
    message: valid ? '' : `Please provide a valid ${name}.`,
  };
}

function notify() {
  const snapshot = getState();
  listeners.forEach((listener) => listener(snapshot));
}
