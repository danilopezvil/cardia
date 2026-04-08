import type { CardDocument } from '../../domain/card';
import { templateRegistry } from './registry';

interface TemplateRendererProps {
  document: CardDocument;
  side: 'front' | 'back';
}

export function TemplateRenderer({ document, side }: TemplateRendererProps) {
  const Template = templateRegistry[document.style.template];
  return <Template document={document} side={side} />;
}
