'use strict';

function _getBrandingSvg(industry = 'tech') {
  if (industry === 'health') {
    return `
      <svg viewBox="0 0 600 378" aria-hidden="true">
        <path d="M20 190 H220 L245 150 L265 230 L292 110 L324 190 H580" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <circle cx="300" cy="189" r="120" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 10"/>
      </svg>`;
  }

  if (industry === 'corporate' || industry === 'finance' || industry === 'legal') {
    return `
      <svg viewBox="0 0 600 378" aria-hidden="true">
        <rect x="44" y="44" width="512" height="290" rx="20" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M120 278 L240 148 L338 228 L470 98" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>`;
  }

  return `
    <svg viewBox="0 0 600 378" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="120" cy="84" r="22"/>
        <circle cx="265" cy="185" r="18"/>
        <circle cx="452" cy="112" r="20"/>
        <circle cx="503" cy="286" r="24"/>
        <path d="M140 94 L248 172 L430 124 L486 266"/>
      </g>
    </svg>`;
}

function applyBrandingOverlay(faceEl, data) {
  if (!faceEl) return;
  const old = faceEl.querySelector('.card-branding-overlay');
  if (old) old.remove();

  const industry = data.industry || data.template || 'tech';
  const wrap = document.createElement('div');
  wrap.className = `card-branding-overlay card-branding--${industry}`;
  wrap.innerHTML = _getBrandingSvg(industry);
  faceEl.appendChild(wrap);
}

window.BrandingModule = {
  applyBrandingOverlay,
};
