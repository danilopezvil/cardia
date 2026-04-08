import type { CardDocument } from '../../domain/card';
import { createQrPresentation } from '../qr';

const DPI = 300;
const CARD_WIDTH_IN = 3.5;
const CARD_HEIGHT_IN = 2;
const WIDTH = Math.round(CARD_WIDTH_IN * DPI);
const HEIGHT = Math.round(CARD_HEIGHT_IN * DPI);

interface ExportResult {
  frontDataUrl: string;
  backDataUrl: string;
}

function drawCardBackground(ctx: CanvasRenderingContext2D, theme: CardDocument['style']['theme'], side: 'front' | 'back') {
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);

  if (theme === 'light') {
    gradient.addColorStop(0, side === 'front' ? '#ffffff' : '#eef2ff');
    gradient.addColorStop(1, side === 'front' ? '#eff3ff' : '#dbe5ff');
  } else if (theme === 'ocean') {
    gradient.addColorStop(0, side === 'front' ? '#dff9ff' : '#00384f');
    gradient.addColorStop(1, side === 'front' ? '#ccecff' : '#02293d');
  } else {
    gradient.addColorStop(0, side === 'front' ? '#f5f7ff' : '#191f31');
    gradient.addColorStop(1, side === 'front' ? '#e6ebff' : '#101524');
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawFront(ctx: CanvasRenderingContext2D, card: CardDocument) {
  drawCardBackground(ctx, card.style.theme, 'front');

  const fg = card.style.theme === 'midnight' ? '#111a2e' : '#0f2238';
  const muted = card.style.theme === 'midnight' ? '#3d4f73' : '#335170';
  const fullName = `${card.front.firstName} ${card.front.lastName}`.trim();

  ctx.fillStyle = fg;
  ctx.font = '700 64px Inter, Arial, sans-serif';
  ctx.fillText(fullName, 72, 180);

  ctx.fillStyle = muted;
  ctx.font = '500 32px Inter, Arial, sans-serif';
  ctx.fillText(card.front.role, 72, 240);

  ctx.font = '600 30px Inter, Arial, sans-serif';
  ctx.fillText(card.front.company, 72, 290);

  ctx.font = '400 26px Inter, Arial, sans-serif';
  ctx.fillText(card.front.email, 72, 360);
  ctx.fillText(card.front.phone, 72, 400);

  if (card.front.website) {
    ctx.fillText(card.front.website, 72, 440);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function drawBack(ctx: CanvasRenderingContext2D, card: CardDocument) {
  drawCardBackground(ctx, card.style.theme, 'back');

  const { imageUrl, payload } = createQrPresentation(card);
  const qr = await loadImage(imageUrl);

  const qrSize = 290;
  const qrX = (WIDTH - qrSize) / 2;
  const qrY = 120;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48);
  ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = '#e9efff';
  ctx.font = '500 28px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.back.note ?? 'Scan to save contact', WIDTH / 2, 465);

  ctx.font = '400 16px Inter, Arial, sans-serif';
  ctx.fillText(payload.slice(0, 76), WIDTH / 2, 500);
  ctx.textAlign = 'left';
}

async function renderCard(card: CardDocument, side: 'front' | 'back'): Promise<string> {
  const canvas = window.document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context unavailable');
  }

  if (side === 'front') {
    drawFront(ctx, card);
  } else {
    await drawBack(ctx, card);
  }

  return canvas.toDataURL('image/png');
}

function triggerDownload(dataUrl: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
}

export async function exportFrontToPng(card: CardDocument): Promise<void> {
  const front = await renderCard(card, 'front');
  triggerDownload(front, `card-front-${Date.now()}.png`);
}

function openPdfPrintWindow(exportResult: ExportResult): void {
  const popup = window.open('', '_blank', 'width=1024,height=900');
  if (!popup) {
    throw new Error('Popup blocked. Allow popups to export PDF.');
  }

  popup.document.write(`
    <html>
      <head>
        <title>Cardia PDF Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 16px; }
          .page { page-break-after: always; margin-bottom: 24px; }
          img { width: 3.5in; height: 2in; border: 1px solid #d8d8d8; }
        </style>
      </head>
      <body>
        <div class="page"><img src="${exportResult.frontDataUrl}" alt="Front" /></div>
        <div class="page"><img src="${exportResult.backDataUrl}" alt="Back" /></div>
        <script>
          window.onload = () => { window.print(); };
        </script>
      </body>
    </html>
  `);
  popup.document.close();
}

export async function exportCardToPdf(card: CardDocument): Promise<void> {
  const [frontDataUrl, backDataUrl] = await Promise.all([renderCard(card, 'front'), renderCard(card, 'back')]);
  openPdfPrintWindow({ frontDataUrl, backDataUrl });
}
