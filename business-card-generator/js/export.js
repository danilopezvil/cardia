'use strict';

async function _captureCard(showFront) {
  const preview = document.getElementById('card-preview');
  const front   = preview.querySelector('.card-front');
  const back    = preview.querySelector('.card-back');

  if (showFront) {
    front.classList.remove('hidden');
    back.classList.add('hidden');
  } else {
    front.classList.add('hidden');
    back.classList.remove('hidden');
  }

  await new Promise(r => setTimeout(r, 200));

  return html2canvas(preview, {
    scale: 4,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });
}

function _slug(name) {
  return (name || 'card').replace(/\s+/g, '-').toLowerCase();
}

function _restoreFront() {
  const preview = document.getElementById('card-preview');
  const front   = preview?.querySelector('.card-front');
  const back    = preview?.querySelector('.card-back');
  if (front) front.classList.remove('hidden');
  if (back)  back.classList.add('hidden');
}

async function exportPNG() {
  const data = window.CardData || {};
  const btn  = document.getElementById('btn-export-png');
  if (btn) btn.disabled = true;

  try {
    const canvas = await _captureCard(true);
    const url    = canvas.toDataURL('image/png');
    const a      = document.createElement('a');
    a.href       = url;
    a.download   = `${_slug(data.name)}-front.png`;
    a.click();
  } finally {
    _restoreFront();
    if (btn) btn.disabled = false;
  }
}

async function exportPDF() {
  const data = window.CardData || {};
  const btn  = document.getElementById('btn-export-pdf');
  if (btn) btn.disabled = true;

  try {
    const isV    = data.orientation === 'vertical';
    const W      = isV ? 54 : 85.6;
    const H      = isV ? 85.6 : 54;
    const orient = isV ? 'portrait' : 'landscape';

    const frontCanvas = await _captureCard(true);
    const frontImg    = frontCanvas.toDataURL('image/png');

    const backCanvas  = await _captureCard(false);
    const backImg     = backCanvas.toDataURL('image/png');

    _restoreFront();

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: orient, unit: 'mm', format: [W, H], compress: true });
    pdf.addImage(frontImg, 'PNG', 0, 0, W, H);
    pdf.addPage([W, H], orient);
    pdf.addImage(backImg, 'PNG', 0, 0, W, H);
    pdf.save(`${_slug(data.name)}-print.pdf`);
  } catch(e) {
    _restoreFront();
    throw e;
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ExportModule — app.js llama ExportModule.exportPng() / ExportModule.exportPdf() */
const ExportModule = {
  exportPng: exportPNG,
  exportPdf: exportPDF,
  exportPdfSheet: exportPDF,  /* fallback */
};

window.ExportModule = ExportModule;
window.exportPNG    = exportPNG;
window.exportPDF    = exportPDF;
