import type { CardTemplateComponent } from '../types';
import { getFullName } from '../helpers';

export const CorporateTemplate: CardTemplateComponent = ({ document, side, qrImageUrl, qrPayload }) => {
  if (side === 'back') {
    return (
      <>
        <img className="qr-image" src={qrImageUrl} alt="QR de contacto" loading="lazy" />
        <p className="business-card__hint">{document.back.note ?? 'Scan to save contact'}</p>
        <code className="business-card__qrvalue">{qrPayload.slice(0, 84)}...</code>
      </>
    );
  }

  return (
    <>
      <p className="business-card__name">{getFullName(document)}</p>
      <p className="business-card__role">{document.front.role}</p>
      <p className="business-card__company">{document.front.company}</p>
      <p className="business-card__contact">{document.front.email}</p>
      <p className="business-card__contact">{document.front.phone}</p>
    </>
  );
};
