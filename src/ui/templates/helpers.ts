import type { CardDocument } from '../../domain/card';

export function getFullName(document: CardDocument): string {
  return `${document.front.firstName} ${document.front.lastName}`.trim();
}
