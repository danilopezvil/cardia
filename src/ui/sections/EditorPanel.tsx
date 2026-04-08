import { useState } from 'react';
import { useCardStore } from '../../application/use-cases';
import type { CardOrientation, CardQrMode, CardTemplate, CardTheme } from '../../domain/card';
import { exportCardToPdf, exportFrontToPng } from '../../services/export';

const templateOptions: { value: CardTemplate; label: string }[] = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'creative', label: 'Creative' },
  { value: 'health', label: 'Health' },
  { value: 'legal', label: 'Legal' },
  { value: 'tech', label: 'Tech' },
];

const themeOptions: { value: CardTheme; label: string }[] = [
  { value: 'midnight', label: 'Midnight' },
  { value: 'light', label: 'Light' },
  { value: 'ocean', label: 'Ocean' },
];

const orientationOptions: { value: CardOrientation; label: string }[] = [
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
];

const qrModeOptions: { value: CardQrMode; label: string }[] = [
  { value: 'vcard', label: 'vCard' },
  { value: 'url', label: 'URL' },
];

function errorId(field: string): string {
  return `error-${field.replaceAll('.', '-')}`;
}

export function EditorPanel() {
  const {
    document,
    errors,
    updateFrontField,
    updateBackField,
    setTemplate,
    setTheme,
    setOrientation,
    setQrMode,
  } = useCardStore();

  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const hasCriticalErrors = Object.keys(errors).length > 0;

  async function handlePngExport() {
    setExportError(null);
    setExportSuccess(null);

    if (hasCriticalErrors) {
      setExportError('Corrige los errores de validación antes de exportar.');
      return;
    }

    setIsExporting(true);
    try {
      await exportFrontToPng(document);
      setExportSuccess('PNG exportado correctamente.');
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'No se pudo exportar PNG.');
    } finally {
      setIsExporting(false);
    }
  }

  async function handlePdfExport() {
    setExportError(null);
    setExportSuccess(null);

    if (hasCriticalErrors) {
      setExportError('Corrige los errores de validación antes de exportar.');
      return;
    }

    setIsExporting(true);
    try {
      await exportCardToPdf(document);
      setExportSuccess('Se abrió la ventana de impresión para PDF.');
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'No se pudo exportar PDF.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <aside className="surface" aria-labelledby="editor-panel-title">
      <h2 id="editor-panel-title" className="surface__title" tabIndex={-1}>
        Card Editor
      </h2>

      <form className="editor-form" aria-label="Business card editor form">
        <label className="editor-field" htmlFor="front-firstName">
          <span>First name</span>
          <input
            id="front-firstName"
            value={document.front.firstName}
            onChange={(event) => updateFrontField('firstName', event.target.value)}
            aria-invalid={Boolean(errors['front.firstName'])}
            aria-describedby={errors['front.firstName'] ? errorId('front.firstName') : undefined}
          />
          {errors['front.firstName'] && <small id={errorId('front.firstName')}>{errors['front.firstName']}</small>}
        </label>

        <label className="editor-field" htmlFor="front-lastName">
          <span>Last name</span>
          <input
            id="front-lastName"
            value={document.front.lastName}
            onChange={(event) => updateFrontField('lastName', event.target.value)}
            aria-invalid={Boolean(errors['front.lastName'])}
            aria-describedby={errors['front.lastName'] ? errorId('front.lastName') : undefined}
          />
          {errors['front.lastName'] && <small id={errorId('front.lastName')}>{errors['front.lastName']}</small>}
        </label>

        <label className="editor-field" htmlFor="front-role">
          <span>Role</span>
          <input
            id="front-role"
            value={document.front.role}
            onChange={(event) => updateFrontField('role', event.target.value)}
            aria-invalid={Boolean(errors['front.role'])}
            aria-describedby={errors['front.role'] ? errorId('front.role') : undefined}
          />
          {errors['front.role'] && <small id={errorId('front.role')}>{errors['front.role']}</small>}
        </label>

        <label className="editor-field" htmlFor="front-company">
          <span>Company</span>
          <input
            id="front-company"
            value={document.front.company}
            onChange={(event) => updateFrontField('company', event.target.value)}
            aria-invalid={Boolean(errors['front.company'])}
            aria-describedby={errors['front.company'] ? errorId('front.company') : undefined}
          />
          {errors['front.company'] && <small id={errorId('front.company')}>{errors['front.company']}</small>}
        </label>

        <label className="editor-field" htmlFor="front-email">
          <span>Email</span>
          <input
            id="front-email"
            type="email"
            value={document.front.email}
            onChange={(event) => updateFrontField('email', event.target.value)}
            aria-invalid={Boolean(errors['front.email'])}
            aria-describedby={errors['front.email'] ? errorId('front.email') : undefined}
          />
          {errors['front.email'] && <small id={errorId('front.email')}>{errors['front.email']}</small>}
        </label>

        <label className="editor-field" htmlFor="front-phone">
          <span>Phone</span>
          <input
            id="front-phone"
            value={document.front.phone}
            onChange={(event) => updateFrontField('phone', event.target.value)}
            aria-invalid={Boolean(errors['front.phone'])}
            aria-describedby={errors['front.phone'] ? errorId('front.phone') : undefined}
          />
          {errors['front.phone'] && <small id={errorId('front.phone')}>{errors['front.phone']}</small>}
        </label>

        <label className="editor-field" htmlFor="front-website">
          <span>Website</span>
          <input
            id="front-website"
            value={document.front.website ?? ''}
            onChange={(event) => updateFrontField('website', event.target.value)}
            aria-invalid={Boolean(errors['front.website'])}
            aria-describedby={errors['front.website'] ? errorId('front.website') : undefined}
          />
          {errors['front.website'] && <small id={errorId('front.website')}>{errors['front.website']}</small>}
        </label>

        <label className="editor-field" htmlFor="back-qrUrl">
          <span>QR URL</span>
          <input
            id="back-qrUrl"
            value={document.back.qrUrl}
            onChange={(event) => updateBackField('qrUrl', event.target.value)}
            aria-invalid={Boolean(errors['back.qrUrl'])}
            aria-describedby={errors['back.qrUrl'] ? errorId('back.qrUrl') : undefined}
          />
          {errors['back.qrUrl'] && <small id={errorId('back.qrUrl')}>{errors['back.qrUrl']}</small>}
        </label>

        <label className="editor-field" htmlFor="style-template">
          <span>Template</span>
          <select
            id="style-template"
            value={document.style.template}
            onChange={(event) => setTemplate(event.target.value as CardTemplate)}
          >
            {templateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="editor-field" htmlFor="style-theme">
          <span>Theme</span>
          <select id="style-theme" value={document.style.theme} onChange={(event) => setTheme(event.target.value as CardTheme)}>
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="editor-field" htmlFor="style-orientation">
          <span>Orientation</span>
          <select
            id="style-orientation"
            value={document.style.orientation}
            onChange={(event) => setOrientation(event.target.value as CardOrientation)}
          >
            {orientationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="editor-field" htmlFor="back-qrMode">
          <span>QR Mode</span>
          <select id="back-qrMode" value={document.back.qrMode} onChange={(event) => setQrMode(event.target.value as CardQrMode)}>
            {qrModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="export-actions" aria-label="Card export actions">
        <button type="button" onClick={handlePngExport} disabled={isExporting}>
          Export PNG (front)
        </button>
        <button type="button" onClick={handlePdfExport} disabled={isExporting}>
          Export PDF (front + back)
        </button>
      </div>

      {exportError && (
        <p className="preview-error" role="alert">
          {exportError}
        </p>
      )}

      {exportSuccess && (
        <p className="preview-success" role="status" aria-live="polite">
          {exportSuccess}
        </p>
      )}
    </aside>
  );
}
