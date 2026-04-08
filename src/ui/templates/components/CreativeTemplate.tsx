import type { CardTemplateComponent } from '../types';
import { getFullName } from '../helpers';

export const CreativeTemplate: CardTemplateComponent = ({ document, side, qrImageUrl, qrPayload }) => {
  if (side === 'back') {
    return (
      <>
        <p className="business-card__kicker">let's create</p>
        <img className="qr-image" src={qrImageUrl} alt="QR de portfolio y contacto" loading="lazy" />
        <p className="business-card__hint">Portfolio + Contact</p>
        <code className="business-card__qrvalue">{qrPayload.slice(0, 68)}...</code>
      </>
    );
  }

  return (
    <>
      <p className="business-card__name">{getFullName(document)}</p>
      <p className="business-card__role">{document.front.role}</p>
      <p className="business-card__company">{document.front.company}</p>
      <p className="business-card__contact">{document.front.website ?? document.back.qrUrl}</p>
    </>
  );
};
