import type { ReactElement } from 'react';
import type { CardDocument } from '../../domain/card';

export interface CardTemplateComponentProps {
  document: CardDocument;
  side: 'front' | 'back';
}

export type CardTemplateComponent = (props: CardTemplateComponentProps) => ReactElement;
