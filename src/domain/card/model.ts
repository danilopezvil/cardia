export const CARD_SCHEMA_VERSION = 1 as const;

export type CardSchemaVersion = typeof CARD_SCHEMA_VERSION;

export type CardTemplate = 'corporate' | 'minimal' | 'creative' | 'health' | 'legal' | 'tech';
export type CardTheme = 'midnight' | 'light' | 'ocean';
export type CardOrientation = 'landscape' | 'portrait';
export type CardQrMode = 'vcard' | 'url';

export interface CardDocumentMeta {
  schemaVersion: CardSchemaVersion;
  createdAt: string;
  updatedAt: string;
}

export interface CardDocumentFront {
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
}

export interface CardDocumentBack {
  qrMode: CardQrMode;
  qrUrl: string;
  note?: string;
}

export interface CardDocumentStyle {
  template: CardTemplate;
  theme: CardTheme;
  orientation: CardOrientation;
}

export interface CardDocumentPrint {
  widthIn: number;
  heightIn: number;
  bleedIn: number;
}

export interface CardDocument {
  meta: CardDocumentMeta;
  front: CardDocumentFront;
  back: CardDocumentBack;
  style: CardDocumentStyle;
  print: CardDocumentPrint;
}

export function createDefaultCardDocument(nowIso = new Date().toISOString()): CardDocument {
  return {
    meta: {
      schemaVersion: CARD_SCHEMA_VERSION,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    front: {
      firstName: 'Alexandra',
      lastName: 'Navarro',
      role: 'Lead Frontend Engineer',
      company: 'Cardia Labs',
      email: 'alexandra@cardia.dev',
      phone: '+1 555-982-1313',
      website: 'https://cardia.dev',
      address: 'San Francisco, CA',
    },
    back: {
      qrMode: 'vcard',
      qrUrl: 'https://cardia.dev/alexandra',
      note: 'Scan to save contact',
    },
    style: {
      template: 'corporate',
      theme: 'midnight',
      orientation: 'landscape',
    },
    print: {
      widthIn: 3.5,
      heightIn: 2,
      bleedIn: 0.125,
    },
  };
}
