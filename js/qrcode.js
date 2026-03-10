let frontQr;
let backQr;

function ensureQr(container, previousInstance, color) {
  if (!container || !window.QRious) return previousInstance;
  if (previousInstance) return previousInstance;

  const canvas = document.createElement('canvas');
  canvas.width = 88;
  canvas.height = 88;
  container.replaceChildren(canvas);

  return new window.QRious({
    element: canvas,
    value: 'https://example.com',
    foreground: color,
    background: '#ffffff',
    level: 'H',
    size: 176,
  });
}

export function renderQr(previewDom, state) {
  if (!window.QRious) return;

  frontQr = ensureQr(previewDom.front.qr, frontQr, state.brandPrimary);
  backQr = ensureQr(previewDom.back.qr, backQr, state.brandPrimary);

  const value = state.qrValue || state.website || 'https://example.com';
  if (frontQr) {
    frontQr.value = value;
    frontQr.foreground = state.brandPrimary;
  }
  if (backQr) {
    backQr.value = value;
    backQr.foreground = state.brandPrimary;
  }

  const showFront = state.qrPlacement === 'front';
  const showBack = state.qrPlacement === 'back';

  if (previewDom.front.qr) previewDom.front.qr.hidden = !showFront;
  if (previewDom.back.qr) previewDom.back.qr.hidden = !showBack;
}
