'use strict';

/* ══════════════════════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════════════════════ */

const ZINE_BADGES = {
  tech: 'TECH', finance: 'FIN', legal: 'LAW',
  creative: 'ART', health: 'MED', education: 'EDU',
};

const TEMPLATE_DEFAULTS = {
  tech:      { bg: '#0f172a', accent: '#38bdf8' },
  finance:   { bg: '#0d2b1a', accent: '#4ade80' },
  legal:     { bg: '#1c1408', accent: '#d4a017' },
  creative:  { bg: '#0f0a1e', accent: '#a855f7' },
  health:    { bg: '#ffffff', accent: '#e11d48' },
  zine:      { bg: '#1a1a1a', accent: '#ff3b00' },
};

/* ══════════════════════════════════════════════════════════
   MODELO DE DATOS
   ══════════════════════════════════════════════════════════ */

const CardData = {
  name: '', title: '', company: '', tagline: '',
  specialty: '', registration: '',
  phoneCountry: '+34', phone: '', email: '',
  website: '', linkedin: '', github: '', instagram: '',
  primaryColor: '',
  secondaryColor: '',
  font: 'Space Grotesk',
  template: 'tech',
  orientation: 'horizontal',
  logo: null,
  industry: 'tech',
  showQR: false,
  qrMode: 'vcard',
  digitalUrl: '',
};

/* ══════════════════════════════════════════════════════════
   NORMALIZACIÓN DE CAMPOS (backward compat con app.js)
   ══════════════════════════════════════════════════════════ */

const TEMPLATE_ALIAS = {
  minimal: 'tech', corporate: 'finance',
  bold: 'legal', pure: 'creative',
};

function _normalize(updates) {
  const o = {};
  for (const [k, v] of Object.entries(updates)) {
    switch (k) {
      case 'role':           o.title          = v; break;
      case 'colorPrimary':   o.primaryColor   = v; break;
      case 'colorSecondary': o.secondaryColor = v; break;
      case 'fontFamily':     o.font           = v; break;
      case 'logoSrc':        o.logo           = v; break;
      case 'showQr':         o.showQR         = v; break;
      case 'template':
        o.template = TEMPLATE_ALIAS[v] || v;
        break;
      default: o[k] = v;
    }
  }
  return o;
}

/* ══════════════════════════════════════════════════════════
   ESCAPE HTML
   ══════════════════════════════════════════════════════════ */

function _e(s) {
  return String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function _fmtUrl(u) {
  return (u || '').replace(/^https?:\/\//,'').replace(/\/$/,'');
}

/* ══════════════════════════════════════════════════════════
   FONDO TEMÁTICO — drawThemeBackground
   ══════════════════════════════════════════════════════════ */

function drawThemeBackground(el, template, data) {
  /* Creative: blobs CSS (no canvas) */
  if (template === 'creative') {
    const old1 = el.querySelector('.card-blob1');
    const old2 = el.querySelector('.card-blob2');
    if (old1) old1.remove();
    if (old2) old2.remove();
    const b1 = document.createElement('div');
    b1.className = 'card-blob1';
    const b2 = document.createElement('div');
    b2.className = 'card-blob2';
    el.appendChild(b1);
    el.appendChild(b2);
    return;
  }

  /* Health: SVG ECG inline */
  if (template === 'health') {
    const existing = el.querySelector('.card-ecg-svg');
    if (existing) existing.remove();
    const W = el.offsetWidth || 600;
    const H = el.offsetHeight || 378;
    const midY = H / 2;
    const seg = 60;
    let d = `M 0 ${midY}`;
    for (let x = 0; x < W + seg; x += seg) {
      d += ` L ${x+10} ${midY}`;
      d += ` L ${x+16} ${midY - H * 0.25}`;
      d += ` L ${x+20} ${midY + H * 0.15}`;
      d += ` L ${x+28} ${midY - H * 0.40}`;
      d += ` L ${x+32} ${midY}`;
      d += ` L ${x+seg} ${midY}`;
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','card-ecg-svg');
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio','none');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', d);
    path.setAttribute('stroke','#e11d48');
    path.setAttribute('stroke-width','1.2');
    path.setAttribute('fill','none');
    svg.appendChild(path);
    el.appendChild(svg);
    return;
  }

  /* Zine: sin fondo extra */
  if (template === 'zine') return;

  /* Canvas-based backgrounds */
  const canvas = el.querySelector('.card-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 600;
  const H = canvas.offsetHeight || 378;
  canvas.width  = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  if (template === 'tech') {
    _drawTechBg(ctx, W, H);
  } else if (template === 'finance') {
    _drawFinanceBg(ctx, W, H);
  } else if (template === 'legal') {
    _drawLegalBg(ctx, W, H);
  }
}

function _drawTechBg(ctx, W, H) {
  const cols = Math.ceil(W / 18);
  const rows = Math.ceil(H / 18);
  ctx.font = '9px "Courier New", monospace';
  ctx.fillStyle = '#38bdf8';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const alpha = 0.04 + Math.random() * 0.12;
      ctx.globalAlpha = alpha;
      ctx.fillText(Math.random() < 0.5 ? '0' : '1', c * 18 + 2, r * 18 + 12);
    }
  }
  ctx.globalAlpha = 1;
}

function _drawFinanceBg(ctx, W, H) {
  const spacing = 40;
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.12;
  for (let x = 0; x < W; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.fillStyle = '#4ade80';
  for (let x = 0; x < W; x += spacing) {
    for (let y = 0; y < H; y += spacing) {
      ctx.globalAlpha = 0.18;
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function _drawLegalBg(ctx, W, H) {
  const cx = W / 2, cy = H / 2;
  ctx.strokeStyle = '#d4a017';
  ctx.globalAlpha = 0.10;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, H * 0.58, 0, Math.PI*2); ctx.stroke();
  ctx.setLineDash([4,3]);
  ctx.beginPath(); ctx.arc(cx, cy, H * 0.46, 0, Math.PI*2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 0.06;
  ctx.font = `${H * 0.55}px serif`;
  ctx.fillStyle = '#d4a017';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚖', cx, cy + 4);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = 1;
}

/* ══════════════════════════════════════════════════════════
   RENDER FRONTS — por template
   ══════════════════════════════════════════════════════════ */

const renderFront = {

  tech(front, data) {
    const year = new Date().getFullYear();
    const badge = ZINE_BADGES[data.industry] || 'DEV';
    const titleWord = (data.title || '').trim().split(/\s+/)[0].toUpperCase().slice(0,6);
    const contacts = _buildContacts(data);
    const qrHtml = data.showQR ? `
      <div class="qr-area">
        <div class="qr-frame-outer"><div class="qr-frame"><div id="qr-front"></div></div></div>
        <div class="qr-wrapper"><span class="qr-label">scan</span></div>
      </div>` : '';
    front.querySelector('.card-content-layer').innerHTML = `
      <div>
        <div class="badge-row">
          <span class="badge badge-solid">${_e(badge)}</span>
          ${titleWord ? `<span class="badge">${_e(titleWord)}</span>` : ''}
          <span class="badge">${year}</span>
        </div>
        <div class="card-name">${_e(data.name || 'Tu Nombre')}</div>
        <div class="card-title">${_e(data.title || '')}</div>
        <div class="card-company">${_e(data.company || '')}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative;">
        <div style="display:flex;flex-direction:column;gap:3px;">${contacts}</div>
        ${qrHtml}
      </div>`;
  },

  finance(front, data) {
    const contacts = _buildContacts(data);
    const qrHtml = data.showQR ? `
      <div class="qr-area">
        <div class="qr-frame-outer"><div class="qr-frame"><div id="qr-front"></div></div></div>
        <div class="qr-wrapper"><span class="qr-label">scan</span></div>
      </div>` : '';
    front.querySelector('.card-content-layer').innerHTML = `
      <div>
        <div class="card-name">${_e(data.name || 'Tu Nombre')}</div>
        <div class="card-title">${_e(data.title || '')}</div>
        <div class="card-company">${_e(data.company || '')}</div>
        ${data.registration ? `<div class="card-reg">${_e(data.registration)}</div>` : ''}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative;">
        <div style="display:flex;flex-direction:column;gap:3px;">${contacts}</div>
        ${qrHtml}
      </div>`;
  },

  legal(front, data) {
    const contacts = _buildContacts(data);
    const qrHtml = data.showQR ? `
      <div class="qr-area">
        <div class="qr-frame-outer"><div class="qr-frame"><div id="qr-front"></div></div></div>
        <div class="qr-wrapper"><span class="qr-label">scan</span></div>
      </div>` : '';
    front.querySelector('.card-content-layer').innerHTML = `
      <div>
        ${data.company ? `<div class="card-firm">${_e(data.company)}</div>` : ''}
        <div class="card-name">${_e(data.name || 'Tu Nombre')}</div>
        <div class="card-title">${_e(data.title || '')}</div>
        ${data.specialty ? `<div class="card-title" style="color:rgba(212,160,23,0.6)">${_e(data.specialty)}</div>` : ''}
        ${data.registration ? `<div class="card-reg">${_e(data.registration)}</div>` : ''}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative;">
        <div style="display:flex;flex-direction:column;gap:3px;">${contacts}</div>
        ${qrHtml}
      </div>`;
  },

  creative(front, data) {
    const contacts = _buildContacts(data);
    const qrHtml = data.showQR ? `
      <div class="qr-area">
        <div class="qr-frame-outer"><div class="qr-frame"><div id="qr-front"></div></div></div>
        <div class="qr-wrapper"><span class="qr-label">scan</span></div>
      </div>` : '';
    front.querySelector('.card-content-layer').innerHTML = `
      <div>
        ${data.industry ? `<span class="card-tag">${_e(ZINE_BADGES[data.industry] || data.industry).toUpperCase()}</span>` : ''}
        <div class="card-name">${_e(data.name || 'Tu Nombre')}</div>
        <div class="card-title">${_e(data.title || '')}</div>
        ${data.specialty ? `<div class="card-portfolio">${_e(data.specialty)}</div>` : ''}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative;">
        <div style="display:flex;flex-direction:column;gap:3px;">${contacts}</div>
        ${qrHtml}
      </div>`;
  },

  health(front, data) {
    const contacts = _buildContacts(data);
    const qrHtml = data.showQR ? `
      <div class="qr-area">
        <div class="qr-frame-outer"><div class="qr-frame"><div id="qr-front"></div></div></div>
        <div class="qr-wrapper"><span class="qr-label">scan</span></div>
      </div>` : '';
    front.querySelector('.card-content-layer').innerHTML = `
      <div>
        <div class="card-name">${_e(data.name || 'Tu Nombre')}</div>
        <div class="card-title">${_e(data.title || '')}</div>
        ${data.specialty ? `<div class="card-spec">${_e(data.specialty)}</div>` : ''}
        ${data.company   ? `<div class="card-hosp">${_e(data.company)}</div>` : ''}
        ${data.registration ? `<div class="card-reg">${_e(data.registration)}</div>` : ''}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative;">
        <div style="display:flex;flex-direction:column;gap:3px;">${contacts}</div>
        ${qrHtml}
      </div>`;
  },

  zine(front, data) {
    const year = new Date().getFullYear();
    const badge = ZINE_BADGES[data.industry] || 'DEV';
    const roleWord = (data.title || '').trim().split(/\s+/)[0].toUpperCase().slice(0,6);
    const contacts = _buildZineContacts(data);
    const qrHtml = data.showQR ? `
      <div class="qr-area" style="position:absolute;bottom:0;right:0;">
        <div class="qr-frame-outer"><div class="qr-frame"><div id="qr-front"></div></div></div>
      </div>` : '';
    front.querySelector('.card-content-layer').innerHTML = `
      <div>
        <div class="zine-tags">
          <span class="zine-tag zine-tag-acc">${_e(badge)}</span>
          ${roleWord ? `<span class="zine-tag">${_e(roleWord)}</span>` : ''}
          <span class="zine-tag zine-tag-ghost">${year}</span>
        </div>
        <div class="card-name">${_e(data.name || 'TU NOMBRE')}</div>
        <div class="card-title">${_e(data.title || '')}</div>
      </div>
      <div style="position:relative;">
        <div class="zine-rule"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
          <div style="display:flex;flex-direction:column;gap:3px;">${contacts}</div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;">
            <div class="card-company">${_e(data.company || '')}</div>
            <div class="zine-num">01</div>
          </div>
        </div>
        ${qrHtml}
      </div>`;
  },
};

/* ── Helpers de contacto ── */
function _buildContacts(data) {
  const lines = [];
  if (data.phone)    lines.push(`${data.phoneCountry||''} ${data.phone}`.trim());
  if (data.email)    lines.push(data.email);
  if (data.website)  lines.push(_fmtUrl(data.website));
  if (data.linkedin) lines.push(`in/${data.linkedin}`);
  if (data.github)   lines.push(data.github);
  return lines.slice(0,4).map(l => `<div class="card-ci">${_e(l)}</div>`).join('');
}

function _buildZineContacts(data) {
  const lines = [];
  if (data.phone)    lines.push(`${data.phoneCountry||''} ${data.phone}`.trim());
  if (data.email)    lines.push(data.email);
  if (data.website)  lines.push(_fmtUrl(data.website));
  if (data.linkedin) lines.push(`in/${data.linkedin}`);
  return lines.slice(0,4).map(l => `<div class="card-ci">${_e(l)}</div>`).join('');
}

/* ══════════════════════════════════════════════════════════
   RENDER REVERSO
   ══════════════════════════════════════════════════════════ */

function renderBack(back, data) {
  const wordmark = data.company || data.name || '';
  back.querySelector('.card-content-layer').innerHTML = `
    <div class="card-back-content">
      <div>
        <div class="back-wordmark">${_e(wordmark.toUpperCase())}</div>
        ${data.tagline ? `<div class="back-tagline">${_e(data.tagline)}</div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;justify-content:center;">
        <div class="back-scan-hint">— escanear para guardar contacto —</div>
        <div class="qr-frame-outer">
          <div class="qr-frame">
            <div id="qr-back"></div>
          </div>
        </div>
      </div>
      <div class="back-url">${_e(_fmtUrl(data.website))}</div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   renderCard — función principal
   ══════════════════════════════════════════════════════════ */

function renderCard(data) {
  const preview = document.getElementById('card-preview');
  if (!preview) return;

  /* 1. Orientación */
  const orient = data.orientation || 'horizontal';
  preview.className = 'orient-' + orient;

  /* 2. Recuperar caras */
  const front = preview.querySelector('.card-front');
  const back  = preview.querySelector('.card-back');
  if (!front || !back) return;

  /* 3. Aplicar tema */
  const tpl = data.template || 'tech';
  const def = TEMPLATE_DEFAULTS[tpl] || TEMPLATE_DEFAULTS.tech;
  const accent = data.secondaryColor || def.accent;

  front.className = `card-face card-front theme-${tpl}`;
  back.className  = `card-face card-back theme-${tpl} hidden`;

  preview.style.setProperty('--card-accent',  accent);
  preview.style.setProperty('--card-primary', data.primaryColor || def.bg);

  /* 4. Fondo temático */
  drawThemeBackground(front, tpl, data);
  drawThemeBackground(back,  tpl, data);

  /* 5. Renderizar anverso */
  const frontFn = renderFront[tpl] || renderFront.tech;
  frontFn(front, data);

  /* 6. Renderizar reverso */
  renderBack(back, data);

  /* 7. QR */
  if (data.showQR && typeof generateQR === 'function') {
    const qrFront = front.querySelector('#qr-front');
    if (qrFront) { qrFront.innerHTML = ''; generateQR(qrFront, data, 'front'); }
    const qrBack  = back.querySelector('#qr-back');
    if (qrBack)  { qrBack.innerHTML  = ''; generateQR(qrBack,  data, 'back'); }
  }

  /* Sync flip toggle */
  const toggle = document.getElementById('toggle-back-side');
  if (toggle && !toggle.checked) {
    front.classList.remove('hidden');
    back.classList.add('hidden');
  }
}

/* ══════════════════════════════════════════════════════════
   DEBOUNCE RENDER
   ══════════════════════════════════════════════════════════ */

let _renderTimer = null;
function _scheduleRender() {
  clearTimeout(_renderTimer);
  _renderTimer = setTimeout(() => renderCard(CardData), 16);
}

/* ══════════════════════════════════════════════════════════
   CardModule API (compatible con app.js)
   ══════════════════════════════════════════════════════════ */

const CardModule = {

  init() {
    /* Asegurar que #card-preview tiene la estructura correcta */
    const preview = document.getElementById('card-preview');
    if (preview) {
      if (!preview.querySelector('.card-front')) {
        preview.innerHTML = `
          <div class="card-face card-front theme-tech">
            <canvas class="card-bg-canvas"></canvas>
            <div class="card-content-layer"></div>
          </div>
          <div class="card-face card-back theme-tech hidden">
            <canvas class="card-bg-canvas"></canvas>
            <div class="card-content-layer"></div>
          </div>`;
      }
    }
    renderCard(CardData);
  },

  update(updates) {
    const normalized = _normalize(updates);
    Object.assign(CardData, normalized);
    _scheduleRender();
  },

  render() {
    renderCard(CardData);
  },

  getData() {
    /* Devolver con aliases legacy para app.js / localStorage */
    return {
      ...CardData,
      role:           CardData.title,
      colorPrimary:   CardData.primaryColor,
      colorSecondary: CardData.secondaryColor,
      fontFamily:     CardData.font,
      logoSrc:        CardData.logo,
      showQr:         CardData.showQR,
      qrDataUrl:      null,
    };
  },

  reset() {
    const defaults = {
      name: '', title: '', company: '', tagline: '',
      specialty: '', registration: '',
      phoneCountry: '+34', phone: '', email: '',
      website: '', linkedin: '', github: '', instagram: '',
      primaryColor: '', secondaryColor: '',
      font: 'Space Grotesk', template: 'tech',
      orientation: 'horizontal', logo: null,
      industry: 'tech', showQR: false,
      qrMode: 'vcard', digitalUrl: '',
    };
    Object.assign(CardData, defaults);
    renderCard(CardData);
  },
};

/* ── Exposición global ── */
window.CardModule = CardModule;
window.CardData   = CardData;
window.renderCard = renderCard;
