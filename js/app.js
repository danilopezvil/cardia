import { defaults } from './modules/config.js';
import { loadState, saveState, clearState } from './modules/storage.js';
import { fileToDataUrl } from './modules/file.js';
import { renderQr } from './modules/qr.js';
import { renderCard, toggleSide } from './modules/render.js';
import { exportAsPng } from './modules/export.js';

const form = document.getElementById('cardForm');
const elements = {
  cardFront: document.getElementById('cardFront'),
  cardBack: document.getElementById('cardBack'),
  captureArea: document.getElementById('captureArea'),
  logoPreview: document.getElementById('logoPreview'),
  avatarPreview: document.getElementById('avatarPreview'),
  qrContainer: document.getElementById('qrContainer'),
  namePreview: document.getElementById('namePreview'),
  titlePreview: document.getElementById('titlePreview'),
  companyPreview: document.getElementById('companyPreview'),
  taglinePreview: document.getElementById('taglinePreview'),
  phonePreview: document.getElementById('phonePreview'),
  emailPreview: document.getElementById('emailPreview'),
  webPreview: document.getElementById('webPreview'),
  addressPreview: document.getElementById('addressPreview'),
  credentialPreview: document.getElementById('credentialPreview'),
  backCompanyPreview: document.getElementById('backCompanyPreview'),
  backNamePreview: document.getElementById('backNamePreview'),
  backWebsitePreview: document.getElementById('backWebsitePreview'),
  profilePreview: document.getElementById('profilePreview'),
  backNotePreview: document.getElementById('backNotePreview'),
};

let state = loadState();

hydrateForm(state);
paint();

form.addEventListener('input', () => {
  const formData = new FormData(form);
  state = { ...state, ...Object.fromEntries(formData.entries()) };
  paint();
});

document.getElementById('logoInput').addEventListener('change', async (event) => {
  state.logoData = await fileToDataUrl(event.target.files[0]);
  paint();
});

document.getElementById('avatarInput').addEventListener('change', async (event) => {
  state.avatarData = await fileToDataUrl(event.target.files[0]);
  paint();
});

document.querySelectorAll('.preview-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preview-toggle').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    toggleSide(btn.dataset.side, elements);
  });
});

document.getElementById('savePreset').addEventListener('click', () => saveState(state));

document.getElementById('resetCard').addEventListener('click', () => {
  state = { ...defaults };
  clearState();
  form.reset();
  hydrateForm(state);
  paint();
});

document.getElementById('printCard').addEventListener('click', () => {
  elements.cardFront.classList.remove('is-hidden');
  elements.cardBack.classList.remove('is-hidden');
  window.print();
  toggleSide(getActiveSide(), elements);
});

document.getElementById('exportCard').addEventListener('click', async () => {
  const currentSide = getActiveSide();
  toggleSide('front', elements);
  await exportAsPng(elements.cardFront, 'business-card-front.png');
  toggleSide('back', elements);
  await exportAsPng(elements.cardBack, 'business-card-back.png');
  toggleSide(currentSide, elements);
});

function paint() {
  renderCard(state, elements);
  renderQr(elements.qrContainer, state.qrValue || state.website || 'https://example.com', state.brandPrimary);
  saveState(state);
}

function hydrateForm(values) {
  Object.entries(values).forEach(([key, value]) => {
    if (!(key in form.elements)) return;
    form.elements[key].value = value;
  });
}

function getActiveSide() {
  const active = document.querySelector('.preview-toggle.active');
  return active?.dataset.side || 'front';
}
