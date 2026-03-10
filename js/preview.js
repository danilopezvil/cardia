import { applyTemplate, applyTypography } from './templates.js';
import { renderQr } from './qrcode.js';

export function renderPreview(dom, state) {
  applyTemplate(dom.preview.frontCard, state.template);
  applyTemplate(dom.preview.backCard, state.template);
  applyTypography(dom.preview.frontCard, state.typography);
  applyTypography(dom.preview.backCard, state.typography);

  setThemeTokens(state);
  setText(dom, state);
  setImages(dom, state);
  setActiveSide(dom, state.side);
  renderQr(dom.preview, state);
}

export function setActiveSide(dom, side) {
  const showFront = side === 'front';
  dom.preview.frontPanel.hidden = !showFront;
  dom.preview.backPanel.hidden = showFront;
  dom.preview.frontToggle.setAttribute('aria-pressed', String(showFront));
  dom.preview.backToggle.setAttribute('aria-pressed', String(!showFront));
}

function setThemeTokens(state) {
  document.documentElement.style.setProperty('--color-primary', state.brandPrimary);
  document.documentElement.style.setProperty('--color-accent', state.brandAccent);
  document.documentElement.style.setProperty('--color-bg-soft', state.surfaceTone);
}

function setText(dom, state) {
  dom.preview.front.company.textContent = state.company;
  dom.preview.front.name.textContent = state.fullName;
  dom.preview.front.title.textContent = state.jobTitle;
  dom.preview.front.credential.textContent = state.credential;
  dom.preview.front.phone.textContent = state.phone;
  dom.preview.front.email.textContent = state.email;
  dom.preview.front.website.textContent = state.website;
  dom.preview.front.address.textContent = state.address;

  dom.preview.back.company.textContent = state.company;
  dom.preview.back.name.textContent = state.fullName;
  dom.preview.back.message.textContent = state.backMessage;
  dom.preview.back.profileLink.textContent = state.email;
  dom.preview.back.website.textContent = state.website;
}

function setImages(dom, state) {
  dom.preview.front.logo.src = state.logoData || '';
  dom.preview.front.logo.style.visibility = state.logoData ? 'visible' : 'hidden';

  dom.preview.front.profile.src = state.profileData || '';
  dom.preview.front.profile.style.visibility = state.profileData ? 'visible' : 'hidden';
}
