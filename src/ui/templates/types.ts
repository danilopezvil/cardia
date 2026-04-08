import type { ReactElement } from 'react';
import type { CardDocument } from '../../domain/card';

export interface CardTemplateComponentProps {
  document: CardDocument;
  side: 'front' | 'back';
  qrPayload: string;
  qrImageUrl: string;
}

export type CardTemplateComponent = (props: CardTemplateComponentProps) => ReactElement;
