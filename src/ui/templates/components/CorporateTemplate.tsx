import type { CardTemplateComponent } from '../types';
import { getFullName, getQrPayload } from '../helpers';

export const CorporateTemplate: CardTemplateComponent = ({ document, side }) => {
  if (side === 'back') {
    return (
      <>
        <div className="qr-placeholder" role="img" aria-label="Corporate QR placeholder">
          QR
        </div>
        <p className="business-card__hint">{document.back.note ?? 'Scan to save contact'}</p>
        <code className="business-card__qrvalue">{getQrPayload(document).slice(0, 84)}...</code>
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
