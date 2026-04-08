import {
  CARD_SCHEMA_VERSION,
  createDefaultCardDocument,
  type CardDocument,
} from '../../domain/card';

const STORAGE_KEY = 'cardia.card-document';

export function migrateCardDocument(raw: unknown): CardDocument {
  if (!raw || typeof raw !== 'object') {
    return createDefaultCardDocument();
  }

  const candidate = raw as Partial<CardDocument>;

  if (candidate.meta?.schemaVersion !== CARD_SCHEMA_VERSION) {
    return createDefaultCardDocument();
  }

  return {
    ...createDefaultCardDocument(),
    ...candidate,
    meta: {
      ...createDefaultCardDocument().meta,
      ...candidate.meta,
      schemaVersion: CARD_SCHEMA_VERSION,
    },
    front: {
      ...createDefaultCardDocument().front,
      ...candidate.front,
    },
    back: {
      ...createDefaultCardDocument().back,
      ...candidate.back,
    },
    style: {
      ...createDefaultCardDocument().style,
      ...candidate.style,
    },
    print: {
      ...createDefaultCardDocument().print,
      ...candidate.print,
    },
  };
}

export function loadCardDocument(): CardDocument {
  if (typeof window === 'undefined') {
    return createDefaultCardDocument();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultCardDocument();
  }

  try {
    return migrateCardDocument(JSON.parse(raw));
  } catch {
    return createDefaultCardDocument();
  }
}

export function saveCardDocument(document: CardDocument): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
}
