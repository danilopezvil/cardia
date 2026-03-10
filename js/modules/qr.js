let qr;

export function renderQr(container, value, brandPrimary = '#111') {
  if (!window.QRious || !container) return;
  if (!qr) {
    const canvas = document.createElement('canvas');
    container.replaceChildren(canvas);
    qr = new window.QRious({
      element: canvas,
      value,
      size: 168,
      foreground: brandPrimary,
      background: '#ffffff',
      level: 'H',
    });
    return;
  }
  qr.value = value;
  qr.foreground = brandPrimary;
}
