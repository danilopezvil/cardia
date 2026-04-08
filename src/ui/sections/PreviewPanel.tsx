import { useCardStore } from '../../application/use-cases';
import { TemplateRenderer } from '../templates';

export function PreviewPanel() {
  const { document, errors } = useCardStore();
  const isPortrait = document.style.orientation === 'portrait';

  return (
    <section className="surface" aria-labelledby="preview-panel-title">
      <h2 id="preview-panel-title" className="surface__title">
        Live Preview
      </h2>
      <p className="surface__text">
        Template activo: <strong>{document.style.template}</strong> · Theme: <strong>{document.style.theme}</strong>
      </p>

      <div className={`card-preview-grid ${isPortrait ? 'card-preview-grid--portrait' : ''}`}>
        <article
          className={`business-card business-card--front business-card--${document.style.theme} business-card--template-${document.style.template}`}
          aria-label="Business card front preview"
        >
          <TemplateRenderer document={document} side="front" />
        </article>

        <article
          className={`business-card business-card--back business-card--${document.style.theme} business-card--template-${document.style.template}`}
          aria-label="Business card back preview"
        >
          <TemplateRenderer document={document} side="back" />
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
