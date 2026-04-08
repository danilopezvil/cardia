import type { CardTemplateComponent } from '../types';
import { getFullName } from '../helpers';

export const MinimalTemplate: CardTemplateComponent = ({ document, side, qrImageUrl, qrPayload }) => {
  if (side === 'back') {
    return (
      <>
        <p className="business-card__kicker">connect</p>
        <img className="qr-image" src={qrImageUrl} alt="QR de contacto" loading="lazy" />
        <code className="business-card__qrvalue">{qrPayload.slice(0, 68)}...</code>
      </>
    );
  }

  return (
    <>
      <p className="business-card__kicker">minimal profile</p>
      <p className="business-card__name">{getFullName(document)}</p>
      <p className="business-card__role">{document.front.role}</p>
      <p className="business-card__company">{document.front.company}</p>
    </>
  );
};
