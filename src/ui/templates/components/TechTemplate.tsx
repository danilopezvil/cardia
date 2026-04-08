import type { CardTemplateComponent } from '../types';
import { getFullName, getQrPayload } from '../helpers';

export const TechTemplate: CardTemplateComponent = ({ document, side }) => {
  if (side === 'back') {
    return (
      <>
        <p className="business-card__kicker">developer profile</p>
        <div className="qr-placeholder" role="img" aria-label="Tech QR placeholder">
          QR
        </div>
        <p className="business-card__hint">Open profile / add contact</p>
        <code className="business-card__qrvalue">{getQrPayload(document).slice(0, 68)}...</code>
      </>
    );
  }

  return (
    <>
      <p className="business-card__name">{getFullName(document)}</p>
      <p className="business-card__role">{document.front.role}</p>
      <p className="business-card__company">{document.front.company}</p>
      <p className="business-card__contact">{document.front.website ?? document.back.qrUrl}</p>
      <p className="business-card__contact">{document.front.email}</p>
    </>
  );
};
