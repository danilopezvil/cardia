import type { CardTemplateComponent } from '../types';
import { getFullName, getQrPayload } from '../helpers';

export const LegalTemplate: CardTemplateComponent = ({ document, side }) => {
  if (side === 'back') {
    return (
      <>
        <p className="business-card__kicker">legal contact</p>
        <div className="qr-placeholder" role="img" aria-label="Legal QR placeholder">
          QR
        </div>
        <p className="business-card__hint">Schedule legal consultation</p>
        <code className="business-card__qrvalue">{getQrPayload(document).slice(0, 68)}...</code>
      </>
    );
  }

  return (
    <>
      <p className="business-card__name">{getFullName(document)}</p>
      <p className="business-card__role">Attorney at Law · {document.front.role}</p>
      <p className="business-card__company">{document.front.company}</p>
      <p className="business-card__contact">{document.front.email}</p>
    </>
  );
};
