'use strict';

function buildVCard(data) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:4.0',
    `FN:${data.name || ''}`,
  ];
  if (data.title)     lines.push(`TITLE:${data.title}`);
  if (data.company)   lines.push(`ORG:${data.company}`);
  if (data.phone) {
    const tel = [data.phoneCountry, data.phone].filter(Boolean).join(' ');
    lines.push(`TEL;TYPE=CELL:${tel}`);
  }
  if (data.email)    lines.push(`EMAIL:${data.email}`);
  if (data.website)  lines.push(`URL:${data.website}`);
  if (data.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/${data.linkedin}`);
  if (data.github)   lines.push(`X-SOCIALPROFILE;TYPE=github:https://github.com/${data.github}`);
  if (data.logo && /^data:image/.test(data.logo)) {
    const m = data.logo.match(/^data:image\/(\w+);base64,(.+)$/);
    if (m) lines.push(`PHOTO;ENCODING=b;TYPE=${m[1].toUpperCase()}:${m[2]}`);
  }
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

function generateQR(container, data, face) {
  if (typeof QRCode === 'undefined') return;
  container.innerHTML = '';

  const isVertical = data.orientation === 'vertical';
  const isBack     = face === 'back';

  let size;
  if (isBack) {
    size = isVertical ? 140 : 110;
  } else {
    size = isVertical ? 80 : 70;
  }

  const content = (data.qrMode === 'digital' && data.digitalUrl)
    ? data.digitalUrl
    : buildVCard(data);

  if (!content) return;

  const isZine = data.template === 'zine';
  const darkColor  = isZine ? '#1a1a1a' : (data.primaryColor  || '#000000');
  const lightColor = isZine ? '#f5f0e8' : '#ffffff';

  try {
    new QRCode(container, {
      text:         content,
      width:        size,
      height:       size,
      colorDark:    darkColor,
      colorLight:   lightColor,
      correctLevel: QRCode.CorrectLevel.M,
    });
  } catch(e) {
    console.warn('[QR] Error generando QR:', e);
  }
}

window.generateQR  = generateQR;
window.buildVCard  = buildVCard;
