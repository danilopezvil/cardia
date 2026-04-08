import type { CardDocument } from '../../domain/card';

interface QrConfig {
  size?: number;
  margin?: number;
}

const DEFAULT_CONFIG: Required<QrConfig> = {
  size: 320,
  margin: 2,
};

function encode(value: string): string {
  return encodeURIComponent(value);
}

export function createVCardPayload(document: CardDocument): string {
  const fullName = `${document.front.firstName} ${document.front.lastName}`.trim();

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${fullName}`,
    `ORG:${document.front.company}`,
    `TITLE:${document.front.role}`,
    `EMAIL:${document.front.email}`,
    `TEL:${document.front.phone}`,
    document.front.website ? `URL:${document.front.website}` : '',
    document.front.address ? `ADR:;;${document.front.address};;;;` : '',
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\n');
}

export function createQrPayload(document: CardDocument): string {
  if (document.back.qrMode === 'url') {
    return document.back.qrUrl;
  }

  return createVCardPayload(document);
}

export function createQrImageUrl(payload: string, config: QrConfig = DEFAULT_CONFIG): string {
  const merged = { ...DEFAULT_CONFIG, ...config };

  return `https://api.qrserver.com/v1/create-qr-code/?size=${merged.size}x${merged.size}&margin=${merged.margin}&ecc=M&format=png&data=${encode(payload)}`;
}

export function createQrPresentation(document: CardDocument): { payload: string; imageUrl: string } {
  const payload = createQrPayload(document);

  return {
    payload,
    imageUrl: createQrImageUrl(payload),
  };
}
