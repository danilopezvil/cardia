import type { CardTemplateComponent } from '../types';
import { getFullName, getQrPayload } from '../helpers';

export const HealthTemplate: CardTemplateComponent = ({ document, side }) => {
  if (side === 'back') {
    return (
      <>
        <p className="business-card__kicker">health profile</p>
        <div className="qr-placeholder" role="img" aria-label="Health QR placeholder">
          QR
        </div>
        <p className="business-card__hint">Book appointment</p>
        <code className="business-card__qrvalue">{getQrPayload(document).slice(0, 68)}...</code>
      </>
    );
  }

  return (
    <>
      <p className="business-card__name">Dr. {getFullName(document)}</p>
      <p className="business-card__role">{document.front.role}</p>
      <p className="business-card__company">{document.front.company}</p>
      <p className="business-card__contact">{document.front.phone}</p>
    </>
  );
};
