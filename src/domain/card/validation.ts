import { CARD_SCHEMA_VERSION, type CardDocument } from './model';

export interface CardValidationErrors {
  [fieldPath: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+()\-\s\d]{7,22}$/;

function safeTrim(value: string | undefined): string {
  return (value ?? '').trim();
}

export function normalizeCardDocument(document: CardDocument): CardDocument {
  return {
    ...document,
    front: {
      ...document.front,
      firstName: safeTrim(document.front.firstName),
      lastName: safeTrim(document.front.lastName),
      role: safeTrim(document.front.role),
      company: safeTrim(document.front.company),
      email: safeTrim(document.front.email).toLowerCase(),
      phone: safeTrim(document.front.phone),
      website: safeTrim(document.front.website) || undefined,
      address: safeTrim(document.front.address) || undefined,
    },
    back: {
      ...document.back,
      qrUrl: safeTrim(document.back.qrUrl),
      note: safeTrim(document.back.note) || undefined,
    },
  };
}

export function validateCardDocument(input: CardDocument): CardValidationErrors {
  const doc = normalizeCardDocument(input);
  const errors: CardValidationErrors = {};

  if (doc.meta.schemaVersion !== CARD_SCHEMA_VERSION) {
    errors['meta.schemaVersion'] = `Unsupported schema version: ${doc.meta.schemaVersion}`;
  }

  if (!doc.front.firstName) {
    errors['front.firstName'] = 'First name is required';
  }

  if (!doc.front.lastName) {
    errors['front.lastName'] = 'Last name is required';
  }

  if (!doc.front.role) {
    errors['front.role'] = 'Role is required';
  }

  if (!doc.front.company) {
    errors['front.company'] = 'Company is required';
  }

  if (!EMAIL_REGEX.test(doc.front.email)) {
    errors['front.email'] = 'Email format is invalid';
  }

  if (!PHONE_REGEX.test(doc.front.phone)) {
    errors['front.phone'] = 'Phone format is invalid';
  }

  if (doc.front.website) {
    try {
      // eslint-disable-next-line no-new
      new URL(doc.front.website);
    } catch {
      errors['front.website'] = 'Website must be a valid URL';
    }
  }

  if (doc.back.qrMode === 'url') {
    try {
      // eslint-disable-next-line no-new
      new URL(doc.back.qrUrl);
    } catch {
      errors['back.qrUrl'] = 'QR URL must be a valid URL when mode is URL';
    }
  }

  if (doc.print.widthIn <= 0 || doc.print.heightIn <= 0) {
    errors['print.size'] = 'Print dimensions must be greater than zero';
  }

  return errors;
}
