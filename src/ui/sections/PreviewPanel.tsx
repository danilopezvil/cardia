export function PreviewPanel() {
  return (
    <section className="surface" aria-labelledby="preview-panel-title">
      <h2 id="preview-panel-title" className="surface__title">
        Live Preview
      </h2>
      <p className="surface__text">Vista previa de frente y reverso (estructura base).</p>

      <div className="card-preview-grid">
        <article className="business-card business-card--front" aria-label="Business card front preview">
          <p className="business-card__name">Alexandra Navarro</p>
          <p className="business-card__role">Lead Frontend Engineer</p>
          <p className="business-card__company">Cardia Labs</p>
          <p className="business-card__contact">alexandra@cardia.dev · +1 555-982-1313</p>
        </article>

        <article className="business-card business-card--back" aria-label="Business card back preview">
          <div className="qr-placeholder" role="img" aria-label="QR placeholder">
            QR
          </div>
          <p className="business-card__hint">Scan to save contact</p>
        </article>
      </div>
    </section>
  );
}
