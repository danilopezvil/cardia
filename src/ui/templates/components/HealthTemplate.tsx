import type { CardTemplateComponent } from '../types';
import { getFullName } from '../helpers';

export const HealthTemplate: CardTemplateComponent = ({ document, side, qrImageUrl, qrPayload }) => {
  if (side === 'back') {
    return (
      <>
        <p className="business-card__kicker">health profile</p>
        <img className="qr-image" src={qrImageUrl} alt="QR para agendar cita" loading="lazy" />
        <p className="business-card__hint">Book appointment</p>
        <code className="business-card__qrvalue">{qrPayload.slice(0, 68)}...</code>
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
