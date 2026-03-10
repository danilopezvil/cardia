import { DEFAULT_STATE, SAMPLE_DATA } from './data.js';
import { getDom, fillForm, readFileAsDataUrl, setFieldError } from './dom.js';
import { exportPreviewAsPng, printPreview } from './export.js';
import { renderPreview } from './preview.js';
import { getState, initializeState, patchState, resetState, subscribe, validateField } from './state.js';
import { clearStoredState, loadStoredState } from './storage.js';

const dom = getDom();

initializeState(loadStoredState());
fillForm(dom.inputs, getState());

subscribe((state) => {
  fillForm(dom.inputs, state);
  renderPreview(dom, state);
});

renderPreview(dom, getState());
bindEvents();

function bindEvents() {
  dom.form.addEventListener('input', onFormInput);
  dom.form.addEventListener('change', onFormInput);

  dom.inputs.logoUpload.addEventListener('change', async (event) => {
    const logoData = await readFileAsDataUrl(event.target.files?.[0]);
    patchState({ logoData });
  });

  dom.inputs.profileUpload.addEventListener('change', async (event) => {
    const profileData = await readFileAsDataUrl(event.target.files?.[0]);
    patchState({ profileData });
  });

  dom.preview.frontToggle.addEventListener('click', () => patchState({ side: 'front' }));
  dom.preview.backToggle.addEventListener('click', () => patchState({ side: 'back' }));

  [dom.actions.sample, dom.actions.sampleAlt].forEach((btn) => btn?.addEventListener('click', applySampleData));
  [dom.actions.reset, dom.actions.resetAlt].forEach((btn) => btn?.addEventListener('click', resetAll));
  [dom.actions.export, dom.actions.exportAlt].forEach((btn) => btn?.addEventListener('click', () => exportPreviewAsPng(dom)));
  [dom.actions.print, dom.actions.printAlt].forEach((btn) => btn?.addEventListener('click', () => printPreview(dom)));
}

function onFormInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
    return;
  }

  if (target.type === 'file') return;

  const { valid, message } = validateField(target.name, target.value);
  setFieldError(target, message);

  if (!valid && target.value.trim() !== '') {
    target.reportValidity();
  }

  patchState({ [target.name]: target.value });
}

function applySampleData() {
  patchState({ ...getState(), ...SAMPLE_DATA });
}

function resetAll() {
  clearStoredState();
  resetState();
  patchState({ ...DEFAULT_STATE, logoData: '', profileData: '' });
  dom.inputs.logoUpload.value = '';
  dom.inputs.profileUpload.value = '';
}
