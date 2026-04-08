import { useCardStore } from '../../application/use-cases';

function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function PreviewPanel() {
  const { document, errors } = useCardStore();
  const isPortrait = document.style.orientation === 'portrait';
  const qrValue = document.back.qrMode === 'url' ? document.back.qrUrl : `BEGIN:VCARD\nFN:${fullName(document.front.firstName, document.front.lastName)}\nEMAIL:${document.front.email}\nTEL:${document.front.phone}\nEND:VCARD`;

  return (
    <section className="surface" aria-labelledby="preview-panel-title">
      <h2 id="preview-panel-title" className="surface__title">
        Live Preview
      </h2>
      <p className="surface__text">
        Preview sincronizado con estado validado · Template: {document.style.template} · Theme: {document.style.theme}
      </p>

      <div className={`card-preview-grid ${isPortrait ? 'card-preview-grid--portrait' : ''}`}>
        <article
          className={`business-card business-card--front business-card--${document.style.theme}`}
          aria-label="Business card front preview"
        >
          <p className="business-card__name">{fullName(document.front.firstName, document.front.lastName)}</p>
          <p className="business-card__role">{document.front.role}</p>
          <p className="business-card__company">{document.front.company}</p>
          <p className="business-card__contact">
            {document.front.email} · {document.front.phone}
          </p>
          {document.front.website && <p className="business-card__contact">{document.front.website}</p>}
        </article>

        <article
          className={`business-card business-card--back business-card--${document.style.theme}`}
          aria-label="Business card back preview"
        >
          <div className="qr-placeholder" role="img" aria-label="QR placeholder">
            {document.back.qrMode.toUpperCase()}
          </div>
          <p className="business-card__hint">{document.back.note ?? 'Scan to save contact'}</p>
          <code className="business-card__qrvalue">{qrValue.slice(0, 80)}...</code>
        </article>
      </div>

      {Object.keys(errors).length > 0 && (
        <p className="preview-error" role="status" aria-live="polite">
          Hay {Object.keys(errors).length} campos con validación pendiente.
        </p>
      )}
    </section>
  );
}
