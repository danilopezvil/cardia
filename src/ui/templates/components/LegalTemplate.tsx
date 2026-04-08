import type { CardTemplateComponent } from '../types';
import { getFullName } from '../helpers';

export const LegalTemplate: CardTemplateComponent = ({ document, side, qrImageUrl, qrPayload }) => {
  if (side === 'back') {
    return (
      <>
        <p className="business-card__kicker">legal contact</p>
        <img className="qr-image" src={qrImageUrl} alt="QR para consulta legal" loading="lazy" />
        <p className="business-card__hint">Schedule legal consultation</p>
        <code className="business-card__qrvalue">{qrPayload.slice(0, 68)}...</code>
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
