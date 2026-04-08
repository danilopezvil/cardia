'use strict';

const QR_MAX_PAYLOAD_LENGTH = 2400;

function buildVCard(data) {
  const name = data.name || '';
  const role = data.role || data.title || '';
  const organization = data.organization || data.company || '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:4.0',
    `FN:${name}`,
  ];

  if (role)          lines.push(`TITLE:${role}`);
  if (organization)  lines.push(`ORG:${organization}`);
  if (data.phone) {
    const tel = [data.phoneCountry, data.phone].filter(Boolean).join(' ');
    lines.push(`TEL;TYPE=CELL:${tel}`);
  }
  if (data.email)    lines.push(`EMAIL:${data.email}`);
  if (data.website)  lines.push(`URL:${data.website}`);
  if (data.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/${data.linkedin}`);
  if (data.github)   lines.push(`X-SOCIALPROFILE;TYPE=github:https://github.com/${data.github}`);

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

function _getQRSize(container, face) {
  const parent = container.closest('.card-face');
  const usable = Math.min(parent?.clientWidth || 0, parent?.clientHeight || 0) || 180;
  const ratio = face === 'back' ? 0.58 : 0.24;
  const raw = Math.floor(usable * ratio);
  const min = face === 'back' ? 110 : 68;
  const max = face === 'back' ? 210 : 92;
  return Math.max(min, Math.min(max, raw));
}

function _resolveECC(level) {
  if (typeof QRCode === 'undefined') return null;
  return level === 'Q' ? QRCode.CorrectLevel.Q : QRCode.CorrectLevel.M;
}

function generateQR(container, data, face) {
  if (typeof QRCode === 'undefined') return;
  container.innerHTML = '';

  const size = _getQRSize(container, face);
  const content = (data.qrMode === 'digital' && data.digitalUrl)
    ? data.digitalUrl.trim()
    : buildVCard(data);

  if (!content) return;
  if (content.length > QR_MAX_PAYLOAD_LENGTH) {
    console.warn('[QR] Payload demasiado largo para QR estable:', content.length);
    return;
  }

  const isZine = data.template === 'zine';
  const darkColor  = isZine ? '#1a1a1a' : (data.primaryColor || '#1f2937');
  const lightColor = '#ffffff';

  try {
    new QRCode(container, {
      text:         content,
      width:        size,
      height:       size,
      colorDark:    darkColor,
      colorLight:   lightColor,
      correctLevel: _resolveECC(data.qrEcc || 'Q'),
    });
  } catch (e) {
    console.warn('[QR] Error generando QR:', e);
  }
}

window.generateQR  = generateQR;
window.buildVCard  = buildVCard;
