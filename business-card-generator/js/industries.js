/**
 * industries.js — Presets de industria para Business Card Generator
 * =====================================================================
 * Cada preset define colores, fuente, plantilla y campos visibles
 * para un sector profesional específico.
 * =====================================================================
 */

'use strict';

const INDUSTRIES = [
  {
    id: 'tech', label: 'Tech', badge: 'DEV',
    primaryColor: '#0f172a', secondaryColor: '#38bdf8',
    font: 'Space Grotesk', template: 'tech',
    uniqueFields: ['stack', 'certifications'],
    hideFields: ['registration', 'specialty', 'portfolio',
                 'instagram', 'behance', 'department', 'office_hours', 'scholar'],
    placeholders: {
      title: 'Tech Lead · Scrum Master',
      company: 'Mobile Banking Platform',
      stack: 'Java · Spring Boot · Flutter · OpenShift',
      certifications: 'AWS SAA · SAFe 6'
    }
  },
  {
    id: 'finance', label: 'Finanzas', badge: 'FIN',
    primaryColor: '#14532d', secondaryColor: '#4ade80',
    font: 'Raleway', template: 'finance',
    uniqueFields: ['registration', 'extension'],
    hideFields: ['github', 'stack', 'certifications', 'portfolio',
                 'instagram', 'behance', 'department', 'office_hours', 'scholar'],
    placeholders: {
      title: 'Asesor Patrimonial Senior',
      registration: 'Reg. SBS: 00-2024-FIN',
      extension: 'Ext. 421'
    }
  },
  {
    id: 'legal', label: 'Legal', badge: 'LAW',
    primaryColor: '#1c1917', secondaryColor: '#fbbf24',
    font: 'Playfair Display', template: 'legal',
    uniqueFields: ['registration', 'specialty'],
    hideFields: ['github', 'stack', 'certifications', 'portfolio',
                 'instagram', 'behance', 'department', 'office_hours', 'scholar'],
    placeholders: {
      title: 'Abogado Corporativo',
      specialty: 'Derecho Mercantil',
      registration: 'Col. Abogados: ECU-0042'
    }
  },
  {
    id: 'creative', label: 'Creativo', badge: 'ART',
    primaryColor: '#581c87', secondaryColor: '#e879f9',
    font: 'Playfair Display', template: 'creative',
    uniqueFields: ['portfolio', 'instagram', 'behance'],
    hideFields: ['github', 'stack', 'certifications', 'registration',
                 'department', 'office_hours', 'scholar'],
    placeholders: {
      title: 'UX Designer · Brand · Motion',
      portfolio: 'anaruiz.design',
      instagram: 'anaruiz.ux'
    }
  },
  {
    id: 'health', label: 'Salud', badge: 'MED',
    primaryColor: '#881337', secondaryColor: '#fda4af',
    font: 'Montserrat', template: 'health',
    uniqueFields: ['registration', 'specialty'],
    hideFields: ['github', 'stack', 'certifications', 'portfolio',
                 'instagram', 'behance', 'department', 'office_hours', 'scholar'],
    placeholders: {
      title: 'Médico Especialista',
      specialty: 'Cardiología Intervencionista',
      registration: 'SENESCYT: 1002-2019-000'
    }
  },
  {
    id: 'education', label: 'Educación', badge: 'EDU',
    primaryColor: '#0c4a6e', secondaryColor: '#38bdf8',
    font: 'Inter', template: 'tech',
    uniqueFields: ['department', 'office_hours', 'scholar'],
    hideFields: ['github', 'stack', 'certifications', 'portfolio',
                 'instagram', 'behance', 'registration'],
    placeholders: {
      title: 'Docente Investigador',
      department: 'Facultad de Ingeniería',
      office_hours: 'Lun–Mié 14:00–16:00'
    }
  }
];


/* ─────────────────────────────────────────────────────────────
   MAPAS DE CAMPO → ELEMENTO DOM
   ───────────────────────────────────────────────────────────── */

/** Campos nuevos (únicos por industria): wrapper id en el HTML */
const UNIQUE_FIELD_WRAPPER_IDS = {
  stack:         'fg-stack',
  certifications:'fg-certifications',
  extension:     'fg-extension',
  registration:  'fg-registration',
  specialty:     'fg-specialty',
  portfolio:     'fg-portfolio',
  instagram:     'fg-instagram',
  behance:       'fg-behance',
  department:    'fg-department',
  office_hours:  'fg-office-hours',
  scholar:       'fg-scholar',
};

/** Campos existentes que pueden ocultarse: id del <input> para buscar su wrapper */
const HIDEABLE_EXISTING_INPUT_IDS = {
  github: 'input-github',
};

/** Mapa campo → id del <input> para actualizar el placeholder */
const FIELD_INPUT_IDS = {
  title:         'input-role',
  company:       'input-company',
  stack:         'input-stack',
  certifications:'input-certifications',
  extension:     'input-extension',
  registration:  'input-registration',
  specialty:     'input-specialty',
  portfolio:     'input-portfolio',
  instagram:     'input-instagram',
  behance:       'input-behance',
  department:    'input-department',
  office_hours:  'input-office-hours',
  scholar:       'input-scholar',
};

/** Todos los campos únicos para reset inicial */
const ALL_UNIQUE_FIELDS = Object.keys(UNIQUE_FIELD_WRAPPER_IDS);

/** Todos los campos existentes que se pueden ocultar para reset inicial */
const ALL_HIDEABLE_EXISTING = Object.keys(HIDEABLE_EXISTING_INPUT_IDS);


/* ─────────────────────────────────────────────────────────────
   FUNCIÓN PRIVADA: _getWrapper
   ───────────────────────────────────────────────────────────── */

/**
 * Devuelve el elemento wrapper (.form-group) de un campo dado.
 * @param {string} field — nombre de campo (ej. 'github', 'stack')
 * @returns {HTMLElement|null}
 */
function _getWrapper(field) {
  if (UNIQUE_FIELD_WRAPPER_IDS[field]) {
    return document.getElementById(UNIQUE_FIELD_WRAPPER_IDS[field]);
  }
  if (HIDEABLE_EXISTING_INPUT_IDS[field]) {
    const input = document.getElementById(HIDEABLE_EXISTING_INPUT_IDS[field]);
    return input?.closest('.form-group') ?? null;
  }
  return null;
}


/* ─────────────────────────────────────────────────────────────
   FUNCIÓN PÚBLICA: applyIndustry
   ───────────────────────────────────────────────────────────── */

/**
 * Aplica un preset de industria al formulario y a la tarjeta.
 * @param {string} industryId — id del preset (ej. 'tech', 'legal')
 */
function applyIndustry(industryId) {
  const preset = INDUSTRIES.find(i => i.id === industryId);
  if (!preset) return;

  /* 1. Reset de visibilidad: ocultar todos los únicos,
        mostrar todos los existentes ocultables */
  ALL_UNIQUE_FIELDS.forEach(f => {
    const el = _getWrapper(f);
    if (el) el.classList.add('field-hidden');
  });
  ALL_HIDEABLE_EXISTING.forEach(f => {
    const el = _getWrapper(f);
    if (el) el.classList.remove('field-hidden');
  });

  /* 2. Ocultar según hideFields del preset */
  preset.hideFields.forEach(f => {
    const el = _getWrapper(f);
    if (el) el.classList.add('field-hidden');
  });

  /* 3. Mostrar según uniqueFields del preset */
  preset.uniqueFields.forEach(f => {
    const el = _getWrapper(f);
    if (el) el.classList.remove('field-hidden');
  });

  /* 4. Actualizar placeholders */
  if (preset.placeholders) {
    Object.entries(preset.placeholders).forEach(([field, ph]) => {
      const inputId = FIELD_INPUT_IDS[field];
      const input   = inputId ? document.getElementById(inputId) : null;
      if (input) input.placeholder = ph;
    });
  }

  /* 5. Aplicar colores — disparar 'input' para que app.js actualice CardModule */
  const cpInput = document.getElementById('input-color-primary');
  const csInput = document.getElementById('input-color-secondary');
  if (cpInput) {
    cpInput.value = preset.primaryColor;
    cpInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (csInput) {
    csInput.value = preset.secondaryColor;
    csInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* 6. Aplicar fuente — simular click en la opción del font picker */
  const fontOption = document.querySelector(
    `#font-picker-dropdown [data-font="${preset.font}"]`
  );
  if (fontOption) {
    fontOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  /* 7. Aplicar plantilla — marcar el radio + disparar change */
  const templateRadio = document.querySelector(
    `input[name="card-template"][value="${preset.template}"]`
  );
  if (templateRadio) {
    templateRadio.checked = true;
    templateRadio.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* 8. Marcar chip activo */
  document.querySelectorAll('.industry-chip').forEach(chip => {
    chip.classList.toggle('industry-chip--active',
      chip.dataset.industry === industryId);
  });

  /* 9. Forzar re-render inmediato */
  if (window.CardModule) window.CardModule.render();
}


/* ─────────────────────────────────────────────────────────────
   EXPOSICIÓN GLOBAL
   ───────────────────────────────────────────────────────────── */

window.IndustriesModule = { applyIndustry, INDUSTRIES };
window.applyIndustry    = applyIndustry;
