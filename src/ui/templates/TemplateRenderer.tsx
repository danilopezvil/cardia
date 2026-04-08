import { useMemo } from 'react';
import type { CardDocument } from '../../domain/card';
import { createQrPresentation } from '../../services/qr';
import { templateRegistry } from './registry';

interface TemplateRendererProps {
  document: CardDocument;
  side: 'front' | 'back';
}

export function TemplateRenderer({ document, side }: TemplateRendererProps) {
  const Template = templateRegistry[document.style.template];

  const qr = useMemo(
    () => createQrPresentation(document),
    [
      document.back.qrMode,
      document.back.qrUrl,
      document.front.firstName,
      document.front.lastName,
      document.front.company,
      document.front.role,
      document.front.email,
      document.front.phone,
      document.front.website,
      document.front.address,
    ],
  );

  return <Template document={document} side={side} qrPayload={qr.payload} qrImageUrl={qr.imageUrl} />;
}
