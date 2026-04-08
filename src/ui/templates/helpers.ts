import type { CardDocument } from '../../domain/card';

export function getFullName(document: CardDocument): string {
  return `${document.front.firstName} ${document.front.lastName}`.trim();
}

export function getQrPayload(document: CardDocument): string {
  if (document.back.qrMode === 'url') {
    return document.back.qrUrl;
  }

  return [
    'BEGIN:VCARD',
    `FN:${getFullName(document)}`,
    `ORG:${document.front.company}`,
    `TITLE:${document.front.role}`,
    `EMAIL:${document.front.email}`,
    `TEL:${document.front.phone}`,
    'END:VCARD',
  ].join('\n');
}
