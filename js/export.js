export async function exportPreviewAsPng(dom) {
  if (!window.html2canvas) return;

  const originalFrontHidden = dom.preview.frontPanel.hidden;
  const originalBackHidden = dom.preview.backPanel.hidden;

  dom.preview.frontPanel.hidden = false;
  dom.preview.backPanel.hidden = true;
  await downloadCanvas(dom.preview.frontCard, 'card-front.png');

  dom.preview.frontPanel.hidden = true;
  dom.preview.backPanel.hidden = false;
  await downloadCanvas(dom.preview.backCard, 'card-back.png');

  dom.preview.frontPanel.hidden = originalFrontHidden;
  dom.preview.backPanel.hidden = originalBackHidden;
}

export function printPreview(dom) {
  const originalFrontHidden = dom.preview.frontPanel.hidden;
  const originalBackHidden = dom.preview.backPanel.hidden;

  dom.preview.frontPanel.hidden = false;
  dom.preview.backPanel.hidden = false;

  window.print();

  dom.preview.frontPanel.hidden = originalFrontHidden;
  dom.preview.backPanel.hidden = originalBackHidden;
}

async function downloadCanvas(target, filename) {
  const canvas = await window.html2canvas(target, { backgroundColor: null, scale: 3 });
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
