import type { CardTemplateComponent } from '../types';
import { getFullName, getQrPayload } from '../helpers';

export const MinimalTemplate: CardTemplateComponent = ({ document, side }) => {
  if (side === 'back') {
    return (
      <>
        <p className="business-card__kicker">connect</p>
        <div className="qr-placeholder" role="img" aria-label="Minimal QR placeholder">
          QR
        </div>
        <code className="business-card__qrvalue">{getQrPayload(document).slice(0, 68)}...</code>
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
