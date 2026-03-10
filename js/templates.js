import { TEMPLATE_OPTIONS } from './data.js';

export function applyTemplate(surface, templateName) {
  if (!surface) return;
  const keep = [...surface.classList].filter((name) => !name.startsWith('template-'));
  const safeTemplate = TEMPLATE_OPTIONS.includes(templateName) ? templateName : TEMPLATE_OPTIONS[0];
  surface.className = `${keep.join(' ')} template-${safeTemplate}`.trim();
}

export function applyTypography(surface, typographyName) {
  if (!surface) return;
  const keep = [...surface.classList].filter((name) => !name.startsWith('type-'));
  surface.className = `${keep.join(' ')} type-${typographyName}`.trim();
}
