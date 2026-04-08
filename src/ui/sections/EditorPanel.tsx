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
  const [isExporting, setIsExporting] = useState(false);

  const hasCriticalErrors = Object.keys(errors).length > 0;

  async function handlePngExport() {
    setExportError(null);
    if (hasCriticalErrors) {
      setExportError('Corrige los errores de validación antes de exportar.');
      return;
    }

    setIsExporting(true);
    try {
      await exportFrontToPng(document);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'No se pudo exportar PNG.');
    } finally {
      setIsExporting(false);
    }
  }

  async function handlePdfExport() {
    setExportError(null);
    if (hasCriticalErrors) {
      setExportError('Corrige los errores de validación antes de exportar.');
      return;
    }

    setIsExporting(true);
    try {
      await exportCardToPdf(document);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'No se pudo exportar PDF.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <aside className="surface" aria-labelledby="editor-panel-title">
      <h2 id="editor-panel-title" className="surface__title">
        Card Editor
      </h2>

      <form className="editor-form" aria-label="Business card editor form">
        <label className="editor-field">
          <span>First name</span>
          <input
            value={document.front.firstName}
            onChange={(event) => updateFrontField('firstName', event.target.value)}
            aria-invalid={Boolean(errors['front.firstName'])}
          />
          {errors['front.firstName'] && <small>{errors['front.firstName']}</small>}
        </label>

        <label className="editor-field">
          <span>Last name</span>
          <input
            value={document.front.lastName}
            onChange={(event) => updateFrontField('lastName', event.target.value)}
            aria-invalid={Boolean(errors['front.lastName'])}
          />
          {errors['front.lastName'] && <small>{errors['front.lastName']}</small>}
        </label>

        <label className="editor-field">
          <span>Role</span>
          <input
            value={document.front.role}
            onChange={(event) => updateFrontField('role', event.target.value)}
            aria-invalid={Boolean(errors['front.role'])}
          />
          {errors['front.role'] && <small>{errors['front.role']}</small>}
        </label>

        <label className="editor-field">
          <span>Company</span>
          <input
            value={document.front.company}
            onChange={(event) => updateFrontField('company', event.target.value)}
            aria-invalid={Boolean(errors['front.company'])}
          />
          {errors['front.company'] && <small>{errors['front.company']}</small>}
        </label>

        <label className="editor-field">
          <span>Email</span>
          <input
            type="email"
            value={document.front.email}
            onChange={(event) => updateFrontField('email', event.target.value)}
            aria-invalid={Boolean(errors['front.email'])}
          />
          {errors['front.email'] && <small>{errors['front.email']}</small>}
        </label>

        <label className="editor-field">
          <span>Phone</span>
          <input
            value={document.front.phone}
            onChange={(event) => updateFrontField('phone', event.target.value)}
            aria-invalid={Boolean(errors['front.phone'])}
          />
          {errors['front.phone'] && <small>{errors['front.phone']}</small>}
        </label>

        <label className="editor-field">
          <span>Website</span>
          <input
            value={document.front.website ?? ''}
            onChange={(event) => updateFrontField('website', event.target.value)}
            aria-invalid={Boolean(errors['front.website'])}
          />
          {errors['front.website'] && <small>{errors['front.website']}</small>}
        </label>

        <label className="editor-field">
          <span>QR URL</span>
          <input
            value={document.back.qrUrl}
            onChange={(event) => updateBackField('qrUrl', event.target.value)}
            aria-invalid={Boolean(errors['back.qrUrl'])}
          />
          {errors['back.qrUrl'] && <small>{errors['back.qrUrl']}</small>}
        </label>

        <label className="editor-field">
          <span>Template</span>
          <select value={document.style.template} onChange={(event) => setTemplate(event.target.value as CardTemplate)}>
            {templateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="editor-field">
          <span>Theme</span>
          <select value={document.style.theme} onChange={(event) => setTheme(event.target.value as CardTheme)}>
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="editor-field">
          <span>Orientation</span>
          <select
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

        <label className="editor-field">
          <span>QR Mode</span>
          <select value={document.back.qrMode} onChange={(event) => setQrMode(event.target.value as CardQrMode)}>
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
    </aside>
  );
}
