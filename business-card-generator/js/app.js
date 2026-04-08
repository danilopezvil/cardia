/**
 * app.js — Lógica principal y coordinación de la aplicación
 * Business Card Generator
 * =====================================================================
 * Responsabilidades:
 *  - Punto de entrada principal (DOMContentLoaded)
 *  - Inicializar todos los módulos en el orden correcto
 *  - Conectar los eventos del formulario con CardModule y QrModule
 *  - Gestionar el zoom de la preview
 *  - Gestionar la carga del logo del usuario
 *  - Manejar el botón de reset
 *  - Proveer la función global de toasts (notificaciones)
 * =====================================================================
 * Secciones:
 *  1. Constantes y referencias al DOM
 *  2. Estado de la aplicación
 *  3. Inicialización principal
 *  4. Conexión de inputs del formulario
 *  5. Gestión del logo
 *  6. Control de zoom
 *  7. Control del toggle QR
 *  8. Acciones: reset, export
 *  9. Sistema de toasts
 * =====================================================================
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONSTANTES Y REFERENCIAS AL DOM
   Se asignan en _initDomRefs() tras DOMContentLoaded
   ───────────────────────────────────────────────────────────── */

// Inputs de información personal
let inputName, inputRole, inputCompany, inputTagline;

// Inputs de contacto
let inputEmail, inputPhone, inputPhoneCountry, inputWebsite, inputLinkedin, inputGithub;

// Inputs de logo
let inputLogo, logoPreviewImg, btnRemoveLogo;

// Picker de tipografía (custom listbox)
let fontPicker, fontPickerValue, fontPickerDropdown, inputFontHidden;

// Inputs de color
let inputColorPrimary, inputColorSecondary, inputQrColor;

// Selector de plantilla (radiogroup)
let templatePicker;

// Controles de QR
let toggleQr, qrOptionsPanel;

// Controles de preview
let btnZoomIn, btnZoomOut, zoomValue, cardWrapper;

// Botones de acción
let btnReset, btnExportPng, btnExportPdf;

// Contenedor de toasts
let toastRegion;


/* ─────────────────────────────────────────────────────────────
   2. ESTADO DE LA APLICACIÓN
   ───────────────────────────────────────────────────────────── */

const AppState = {
  zoomLevel: 1.0,
  zoomMin:   0.5,
  zoomMax:   1.5,
  zoomStep:  0.1,
};

/* Claves de localStorage */
const STORAGE_KEY       = 'bcg:cardData';
const COLOR_SCHEME_KEY  = 'bcg:colorScheme';
const WELCOME_KEY       = 'bcg:welcomed';

/* Timer de guardado con debounce */
let _saveTimer = null;

/* Iconos SVG para el botón de modo de color */
const _ICON_MOON = `<svg viewBox="0 0 14 14" fill="none" width="13" height="13" aria-hidden="true">
  <path d="M12.5 9A6 6 0 015 1.5a5.5 5.5 0 100 11 6 6 0 007.5-3.5z"
    stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const _ICON_SUN = `<svg viewBox="0 0 14 14" fill="none" width="13" height="13" aria-hidden="true">
  <circle cx="7" cy="7" r="2.5" stroke="currentColor" stroke-width="1.3"/>
  <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.9 2.9l1.1 1.1M10 10l1.1 1.1M2.9 11.1L4 10M10 4l1.1-1.1"
    stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
</svg>`;


/* ─────────────────────────────────────────────────────────────
   3. INICIALIZACIÓN PRINCIPAL
   ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  _initDomRefs();

  // Verificar dependencias CDN antes de inicializar
  _checkCdnDeps();

  // Aplicar esquema de color guardado (antes de renderizar)
  _initColorScheme();

  // Inicializar módulos
  window.CardModule.init();

  // Intentar restaurar datos guardados; si no hay, cargar demo
  const restored = _restoreFromStorage();
  if (!restored) _loadDemoData();

  // Conectar eventos
  _bindFormInputs();
  _bindColorPresets();
  _bindFontPicker();
  _bindLogoInput();
  _bindZoomControls();
  _bindQrToggle();
  _bindFlipToggle();
  _bindOrientationToggle();
  _bindDarkModeToggle();
  _bindStorageSync();   // Debe ir DESPUÉS de todos los _bind* para no capturar su setup
  _bindVcfDownload();   // Parchar render para mantener el enlace .vcf actualizado
  _bindActions();
  _connectIndustryChips();

  // Aplicar industria por defecto (tech) al primer inicio
  if (window.applyIndustry) window.applyIndustry('tech');

  // Calcular zoom para que la tarjeta quepa en el área de preview
  _fitToPreview();

  // Reajustar zoom si el usuario redimensiona la ventana (debounced)
  let _resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(_fitToPreview, 150);
  });

  // Modal de bienvenida (sólo primera visita, con pequeño retardo)
  setTimeout(_showWelcomeIfFirst, 500);
});


/* ─────────────────────────────────────────────────────────────
   4. CONEXIÓN DE INPUTS DEL FORMULARIO
   ───────────────────────────────────────────────────────────── */

/**
 * Conecta todos los inputs del formulario con CardModule.update().
 * Usa eventos 'input' para actualización en tiempo real.
 */
function _bindFormInputs() {
  // Información personal
  inputName.addEventListener('input', e =>
    window.CardModule.update({ name: e.target.value }));

  inputRole.addEventListener('input', e =>
    window.CardModule.update({ role: e.target.value }));

  inputCompany.addEventListener('input', e =>
    window.CardModule.update({ company: e.target.value }));

  inputTagline.addEventListener('input', e => {
    window.CardModule.update({ tagline: e.target.value });
    // Actualizar contador de caracteres
    const counter = document.getElementById('counter-tagline-val');
    if (counter) counter.textContent = e.target.value.length;
  });

  // Contacto
  inputEmail.addEventListener('input', e =>
    window.CardModule.update({ email: e.target.value.trim() }));

  function _updatePhone() {
    window.CardModule.update({
      phoneCountry: inputPhoneCountry.value,
      phone:        inputPhone.value.trim(),
    });
  }
  inputPhone.addEventListener('input', _updatePhone);
  inputPhoneCountry.addEventListener('change', _updatePhone);

  inputWebsite.addEventListener('input', e =>
    window.CardModule.update({ website: e.target.value.trim() }));

  inputLinkedin.addEventListener('input', e =>
    window.CardModule.update({ linkedin: e.target.value.trim() }));

  inputGithub.addEventListener('input', e =>
    window.CardModule.update({ github: e.target.value.trim() }));

  // Colores (también manejados en _bindColorPresets para los presets)
  inputColorPrimary.addEventListener('input', e =>
    window.CardModule.update({ colorPrimary: e.target.value }));

  inputColorSecondary.addEventListener('input', e =>
    window.CardModule.update({ colorSecondary: e.target.value }));

  // Selector de plantilla (radio inputs dentro del radiogroup)
  templatePicker.addEventListener('change', e => {
    if (e.target.name === 'card-template') {
      window.CardModule.update({ template: e.target.value });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   4b. PRESETS DE COLOR
   ───────────────────────────────────────────────────────────── */

/**
 * Delega clicks en todos los grupos de presets de color.
 * Cada .color-presets[data-target] apunta al <input type="color"> correspondiente.
 */
function _bindColorPresets() {
  document.querySelectorAll('.color-presets').forEach(group => {
    group.addEventListener('click', e => {
      const btn = e.target.closest('.color-preset');
      if (!btn) return;

      const color    = btn.dataset.color;
      const targetId = group.dataset.target;
      const input    = document.getElementById(targetId);
      if (!input || !color) return;

      input.value = color;
      // Disparar 'input' para que el listener de _bindFormInputs actualice CardModule
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   4c. FONT PICKER (custom listbox)
   ───────────────────────────────────────────────────────────── */

/**
 * Gestiona la apertura/cierre y selección del picker de fuentes custom.
 */
function _bindFontPicker() {
  // Click en el picker: abrir/cerrar dropdown o seleccionar opción
  fontPicker.addEventListener('click', e => {
    const option = e.target.closest('.font-picker__option');
    if (option) {
      _selectFont(option);
      _closeFontPicker();
      return;
    }
    // Click en trigger → toggle
    if (fontPickerDropdown.hidden) {
      _openFontPicker();
    } else {
      _closeFontPicker();
    }
  });

  // Teclado: Enter/Space abre, Escape cierra, flechas navegan
  fontPicker.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (fontPickerDropdown.hidden) {
        _openFontPicker();
      } else {
        const focused = fontPickerDropdown.querySelector(':focus');
        if (focused) _selectFont(focused);
        _closeFontPicker();
      }
    } else if (e.key === 'Escape') {
      _closeFontPicker();
      fontPicker.focus();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const options = [...fontPickerDropdown.querySelectorAll('.font-picker__option')];
      const focused  = document.activeElement;
      const idx      = options.indexOf(focused);
      if (!fontPickerDropdown.hidden && idx !== -1) {
        const next = e.key === 'ArrowDown'
          ? options[Math.min(idx + 1, options.length - 1)]
          : options[Math.max(idx - 1, 0)];
        next.focus();
      } else if (fontPickerDropdown.hidden) {
        _openFontPicker();
      }
    }
  });

  // Cerrar al hacer click fuera del picker
  document.addEventListener('click', e => {
    if (!fontPicker.contains(e.target)) {
      _closeFontPicker();
    }
  });
}

function _openFontPicker() {
  fontPickerDropdown.hidden = false;
  fontPicker.setAttribute('aria-expanded', 'true');
  const selected = fontPickerDropdown.querySelector('[aria-selected="true"]');
  selected?.focus();
}

function _closeFontPicker() {
  fontPickerDropdown.hidden = true;
  fontPicker.setAttribute('aria-expanded', 'false');
}

/**
 * Aplica la selección de una opción del font picker.
 * @param {HTMLElement} option — elemento <li> con data-font
 */
function _selectFont(option) {
  // Actualizar aria-selected
  fontPickerDropdown.querySelectorAll('.font-picker__option').forEach(o =>
    o.setAttribute('aria-selected', 'false'));
  option.setAttribute('aria-selected', 'true');

  const fontName = option.dataset.font;

  // Actualizar texto e icono del trigger (mostrar en la misma fuente)
  fontPickerValue.textContent = fontName;
  const foptClass = [...option.classList].find(c => c.startsWith('fopt--')) ?? '';
  fontPickerValue.className = `font-picker__value ${foptClass}`;

  // Actualizar input oculto
  inputFontHidden.value = fontName;

  // Actualizar tarjeta
  window.CardModule.update({ fontFamily: fontName });
}


/* ─────────────────────────────────────────────────────────────
   5. GESTIÓN DEL LOGO
   ───────────────────────────────────────────────────────────── */

/**
 * Conecta el input de archivo del logo y el botón de quitar.
 */
function _bindLogoInput() {
  inputLogo.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      window.CardModule.update({ logoSrc: dataUrl });
      _showLogoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  });

  btnRemoveLogo.addEventListener('click', () => {
    window.CardModule.update({ logoSrc: null });
    inputLogo.value   = '';
    logoPreviewImg.src    = '';
    logoPreviewImg.hidden = true;
    btnRemoveLogo.hidden  = true;
  });
}

/**
 * Muestra la previsualización del logo en el círculo del sidebar.
 * @param {string} dataUrl
 */
function _showLogoPreview(dataUrl) {
  logoPreviewImg.src    = dataUrl;
  logoPreviewImg.hidden = false;
  btnRemoveLogo.hidden  = false;
}


/* ─────────────────────────────────────────────────────────────
   6. CONTROL DE ZOOM
   ───────────────────────────────────────────────────────────── */

/**
 * Conecta los botones de zoom al cardWrapper vía CSS custom property.
 */
function _bindZoomControls() {
  btnZoomIn.addEventListener('click',  () => _setZoom(AppState.zoomLevel + AppState.zoomStep));
  btnZoomOut.addEventListener('click', () => _setZoom(AppState.zoomLevel - AppState.zoomStep));
  // Clic en el valor de zoom: resetear al zoom que encaja en el área de preview
  zoomValue.style.cursor = 'pointer';
  zoomValue.title = 'Clic para ajustar automáticamente';
  zoomValue.addEventListener('click', _fitToPreview);
}

/**
 * Pre-carga datos de ejemplo en el formulario y la tarjeta.
 * Hace que el motor de renderizado sea visible desde el primer momento.
 */
function _loadDemoData() {
  const demo = {
    name:           'Ana García',
    role:           'Diseñadora UX Senior',
    company:        'Acme Studio',
    tagline:        'Creando experiencias que importan',
    email:          'ana@acme.io',
    phoneCountry:   '+34',
    phone:          '600 000 000',
    website:        'https://acme.io',
    linkedin:       'anagarcia',
  };

  // Rellenar inputs del formulario
  if (inputName)         inputName.value         = demo.name;
  if (inputRole)         inputRole.value         = demo.role;
  if (inputCompany)      inputCompany.value      = demo.company;
  if (inputWebsite)      inputWebsite.value      = demo.website;
  if (inputLinkedin)     inputLinkedin.value     = demo.linkedin;
  if (inputEmail)        inputEmail.value        = demo.email;
  if (inputPhoneCountry) inputPhoneCountry.value = demo.phoneCountry;
  if (inputPhone)        inputPhone.value        = demo.phone;
  if (inputTagline) {
    inputTagline.value = demo.tagline;
    const counter = document.getElementById('counter-tagline-val');
    if (counter) counter.textContent = demo.tagline.length;
  }

  // Actualizar la tarjeta — demo contiene exactamente los campos de CardData a rellenar
  window.CardModule.update(demo);
}

/**
 * Calcula y aplica el zoom para que la tarjeta (1000×630px) quepa
 * completamente dentro del área visible del preview stage.
 * Se llama al iniciar y al redimensionar la ventana.
 */
function _fitToPreview() {
  const stage = document.getElementById('preview-stage');
  if (!stage || !cardWrapper) return;

  // Padding interno del stage: var(--space-10) = 2.5rem = 40px por lado
  const STAGE_PADDING = 80; // 2 × 40px
  const isVertical = window.CardData?.orientation === 'vertical';
  const CARD_W = isVertical ? 378 : 600;
  const CARD_H = isVertical ? 600 : 378;

  const availW = stage.clientWidth  - STAGE_PADDING;
  const availH = stage.clientHeight - STAGE_PADDING;
  const scaleToFit = Math.min(availW / CARD_W, availH / CARD_H);

  // Redondear HACIA ABAJO al step más cercano para garantizar que la tarjeta cabe
  const snapped = Math.max(AppState.zoomMin, Math.min(AppState.zoomMax,
    Math.floor(scaleToFit / AppState.zoomStep) * AppState.zoomStep));

  _setZoom(snapped);
}

/**
 * Aplica el nivel de zoom al cardWrapper.
 * @param {number} level — valor entre zoomMin y zoomMax
 */
function _setZoom(level) {
  AppState.zoomLevel = Math.min(AppState.zoomMax, Math.max(AppState.zoomMin,
    Math.round(level * 10) / 10));
  cardWrapper.style.setProperty('--card-scale', AppState.zoomLevel);
  zoomValue.textContent   = `${Math.round(AppState.zoomLevel * 100)}%`;
  btnZoomOut.disabled     = AppState.zoomLevel <= AppState.zoomMin;
  btnZoomIn.disabled      = AppState.zoomLevel >= AppState.zoomMax;
}


/* ─────────────────────────────────────────────────────────────
   7. CONTROL DEL TOGGLE QR
   ───────────────────────────────────────────────────────────── */

/**
 * Conecta el toggle de visibilidad del QR,
 * las checkboxes de datos a incluir y el color del QR.
 */
function _bindQrToggle() {
  toggleQr.addEventListener('click', () => {
    const isOn = toggleQr.getAttribute('aria-checked') === 'true';
    const next = !isOn;
    toggleQr.setAttribute('aria-checked', String(next));
    // Activar/desactivar todos los paneles QR con la clase CSS correspondiente
    document.querySelectorAll('.qr-panel').forEach(panel =>
      panel.classList.toggle('qr-panel--active', next));
    window.CardModule.update({ showQr: next });
  });

  // Checkboxes: qué campos incluir en el vCard del QR
  document.querySelectorAll('[name="qr-data"]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (window.QrModule) window.QrModule.generate();
    });
  });

  // Color del QR
  if (inputQrColor) {
    inputQrColor.addEventListener('input', e => {
      window.CardModule.update({ qrColor: e.target.value });
    });
  }
}


/* ─────────────────────────────────────────────────────────────
   8. ACCIONES: RESET Y EXPORT
   ───────────────────────────────────────────────────────────── */

/**
 * Conecta los botones de reset y exportación.
 */
function _bindActions() {
  // Reset
  btnReset.addEventListener('click', () => {
    if (!confirm('¿Resetear todos los campos?')) return;
    window.CardModule.reset();
    _resetFormInputs();
    showToast('Formulario reseteado', 'success');
  });

  // Exportar PNG / PDF
  btnExportPng.addEventListener('click', () => _exportWith('exportPng', 'PNG'));
  btnExportPdf.addEventListener('click', () => _exportWith('exportPdf', 'PDF'));

  // Exportar Tarjeta Digital (.html)
  document.getElementById('btn-export-digital')
    ?.addEventListener('click', () => {
      if (window.exportDigitalCard) {
        window.exportDigitalCard(getCurrentFormData());
      } else {
        showToast('Módulo de exportación no disponible', 'error');
      }
    });
}

/**
 * Llama a un método del ExportModule con feedback de toast y bloqueo del botón.
 * @param {'exportPng'|'exportPdf'} method
 * @param {string} label — 'PNG' o 'PDF' (para mensajes de toast)
 */
async function _exportWith(method, label) {
  if (!window.ExportModule) {
    showToast('Módulo de exportación no disponible', 'error');
    return;
  }
  const btn = method === 'exportPng' ? btnExportPng : btnExportPdf;
  btn.disabled = true;
  try {
    await window.ExportModule[method]();
    showToast(`${label} descargado`, 'success');
  } catch (_e) {
    showToast(`Error al exportar ${label}`, 'error');
  } finally {
    btn.disabled = false;
  }
}

/**
 * Vacía todos los campos del formulario visualmente.
 * Debe llamarse DESPUÉS de CardModule.reset() para sincronizar la UI.
 */
function _resetFormInputs() {
  // Campos de texto
  [inputName, inputRole, inputCompany, inputTagline,
   inputEmail, inputPhone, inputWebsite, inputLinkedin, inputGithub].forEach(el => {
    if (el) el.value = '';
  });

  // Contador del tagline
  const counter = document.getElementById('counter-tagline-val');
  if (counter) counter.textContent = '0';

  // Código de país — volver a España (+34)
  if (inputPhoneCountry) inputPhoneCountry.value = '+34';

  // Plantilla — volver a Minimal
  const defaultRadio = templatePicker?.querySelector('input[value="tech"]');
  if (defaultRadio) defaultRadio.checked = true;

  // Colores — volver a defaults
  if (inputColorPrimary)   inputColorPrimary.value   = '#0f172a';
  if (inputColorSecondary) inputColorSecondary.value = '#38bdf8';
  if (inputQrColor)        inputQrColor.value        = '#000000';

  // Fuente — volver a Inter
  const interOption = fontPickerDropdown?.querySelector('[data-font="Inter"]');
  if (interOption) _selectFont(interOption);

  // Logo
  if (inputLogo)        inputLogo.value       = '';
  if (logoPreviewImg)   { logoPreviewImg.src = ''; logoPreviewImg.hidden = true; }
  if (btnRemoveLogo)    btnRemoveLogo.hidden  = true;

  // Orientación — volver a horizontal
  document.querySelectorAll('.orient-btn').forEach(b => b.classList.remove('active'));
  const horzBtn = document.querySelector('.orient-btn[data-orient="horizontal"]');
  if (horzBtn) horzBtn.classList.add('active');

  // QR toggle — apagar
  if (toggleQr) {
    toggleQr.setAttribute('aria-checked', 'false');
    document.querySelectorAll('.qr-panel').forEach(p =>
      p.classList.remove('qr-panel--active'));
  }

  // Checkboxes QR — volver a defaults (email + web)
  const qrPhone = document.getElementById('qr-inc-phone');
  const qrEmail = document.getElementById('qr-inc-email');
  const qrWeb   = document.getElementById('qr-inc-web');
  const qrLi    = document.getElementById('qr-inc-linkedin');
  if (qrPhone) qrPhone.checked = false;
  if (qrEmail) qrEmail.checked = true;
  if (qrWeb)   qrWeb.checked   = true;
  if (qrLi)    qrLi.checked    = false;
}


/* ─────────────────────────────────────────────────────────────
   9. SISTEMA DE TOASTS
   ───────────────────────────────────────────────────────────── */

/**
 * Muestra una notificación toast temporal.
 * Se expone globalmente para que otros módulos puedan usarla.
 * @param {string} message — texto del toast
 * @param {'success'|'error'|'info'} [type='info']
 * @param {number} [duration=3000] — ms hasta desaparecer
 */
function showToast(message, type = 'info', duration = 3000) {
  if (!toastRegion) return;

  const toast = document.createElement('div');
  toast.className   = `toast toast--${type}`;
  toast.textContent = message;
  toastRegion.appendChild(toast);

  // Eliminar tras `duration` ms
  // La animación de entrada está definida en CSS (@keyframes toast-in)
  setTimeout(() => {
    // Fade out rápido antes de eliminar
    toast.style.transition = 'opacity 250ms ease';
    toast.style.opacity    = '0';
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    // Fallback por si transitionend no se dispara
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Exponer globalmente para uso desde otros módulos
window.showToast = showToast;


/* ─────────────────────────────────────────────────────────────
   10. TOGGLE FRENTE / DORSO (flip 3D)
   ───────────────────────────────────────────────────────────── */

/**
 * Conecta el checkbox #toggle-back-side con la clase .is-flipped
 * del elemento #business-card para activar la animación CSS 3D.
 */
function _bindFlipToggle() {
  const toggle = document.getElementById('toggle-back-side');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    const preview = document.getElementById('card-preview');
    if (!preview) return;
    const front = preview.querySelector('.card-front');
    const back  = preview.querySelector('.card-back');
    if (!front || !back) return;
    if (toggle.checked) {
      front.classList.add('hidden');
      back.classList.remove('hidden');
      if (window.CardData?.showQR && typeof generateQR === 'function') {
        const qrBack = back.querySelector('#qr-back');
        if (qrBack) { qrBack.innerHTML = ''; generateQR(qrBack, window.CardData, 'back'); }
      }
    } else {
      front.classList.remove('hidden');
      back.classList.add('hidden');
    }
  });
}


/* ─────────────────────────────────────────────────────────────
   10b. TOGGLE DE ORIENTACIÓN (horizontal / vertical)
   ───────────────────────────────────────────────────────────── */

/**
 * Conecta los botones .orient-btn con CardModule.update({ orientation }).
 */
function _bindOrientationToggle() {
  document.querySelectorAll('.orient-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.orient-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.CardModule.update({ orientation: btn.dataset.orient });
      _fitToPreview();
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   11. MODO CLARO / OSCURO
   ───────────────────────────────────────────────────────────── */

/**
 * Aplica el esquema de color guardado en localStorage al arrancar.
 */
function _initColorScheme() {
  const saved = localStorage.getItem(COLOR_SCHEME_KEY) ?? 'dark';
  _applyColorScheme(saved, false);
}

/**
 * Aplica un esquema de color al <html> y actualiza el botón.
 * @param {'dark'|'light'} scheme
 * @param {boolean} [save=true]
 */
function _applyColorScheme(scheme, save = true) {
  document.documentElement.dataset.colorScheme = scheme;
  const btn = document.getElementById('btn-color-scheme');
  if (btn) {
    btn.innerHTML = scheme === 'dark' ? _ICON_MOON : _ICON_SUN;
    btn.title = scheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }
  if (save) localStorage.setItem(COLOR_SCHEME_KEY, scheme);
}

/**
 * Conecta el botón de modo de color con _applyColorScheme.
 */
function _bindDarkModeToggle() {
  const btn = document.getElementById('btn-color-scheme');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.dataset.colorScheme ?? 'dark';
    _applyColorScheme(current === 'dark' ? 'light' : 'dark');
  });
}


/* ─────────────────────────────────────────────────────────────
   12. PERSISTENCIA EN localStorage
   ───────────────────────────────────────────────────────────── */

/**
 * Guarda el estado actual de la tarjeta con debounce de 1s.
 * Excluye qrDataUrl (grande y efímero; se regenera en la próxima carga).
 */
function _saveToStorage() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try {
      const { qrDataUrl, ...rest } = window.CardModule.getData();
      // Omitir logoSrc si es demasiado grande (> 200KB) para no saturar localStorage
      if (rest.logoSrc && rest.logoSrc.length > 200000) delete rest.logoSrc;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch (_e) { /* quota exceeded u otro error: ignorar */ }
  }, 1000);
}

/**
 * Restaura el estado guardado en localStorage al formulario y a la tarjeta.
 * @returns {boolean} true si se restauró algo
 */
function _restoreFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    if (typeof saved !== 'object' || !saved) return false;

    /* ── Inputs de texto ── */
    if (inputName         && saved.name         != null) inputName.value         = saved.name;
    if (inputRole         && saved.role         != null) inputRole.value         = saved.role;
    if (inputCompany      && saved.company      != null) inputCompany.value      = saved.company;
    if (inputWebsite      && saved.website      != null) inputWebsite.value      = saved.website;
    if (inputLinkedin     && saved.linkedin     != null) inputLinkedin.value     = saved.linkedin;
    if (inputGithub       && saved.github       != null) inputGithub.value       = saved.github;
    if (inputEmail        && saved.email        != null) inputEmail.value        = saved.email;
    if (inputPhoneCountry && saved.phoneCountry != null) inputPhoneCountry.value = saved.phoneCountry;
    if (inputPhone        && saved.phone        != null) inputPhone.value        = saved.phone;

    if (inputTagline && saved.tagline != null) {
      inputTagline.value = saved.tagline;
      const counter = document.getElementById('counter-tagline-val');
      if (counter) counter.textContent = saved.tagline.length;
    }

    /* ── Colores ── */
    if (inputColorPrimary   && saved.colorPrimary)   inputColorPrimary.value   = saved.colorPrimary;
    if (inputColorSecondary && saved.colorSecondary) inputColorSecondary.value = saved.colorSecondary;
    if (inputQrColor        && saved.qrColor)        inputQrColor.value        = saved.qrColor;

    /* ── Fuente ── */
    if (saved.fontFamily && fontPickerDropdown) {
      const opt = fontPickerDropdown.querySelector(`[data-font="${saved.fontFamily}"]`);
      if (opt) _selectFont(opt);
    }

    /* ── Plantilla ── */
    if (saved.template && templatePicker) {
      const radio = templatePicker.querySelector(`input[value="${saved.template}"]`);
      if (radio) radio.checked = true;
    }

    /* ── Logo ── */
    if (saved.logoSrc && logoPreviewImg) _showLogoPreview(saved.logoSrc);

    /* ── QR toggle ── */
    if (saved.showQr && toggleQr) {
      toggleQr.setAttribute('aria-checked', 'true');
      document.querySelectorAll('.qr-panel').forEach(p =>
        p.classList.add('qr-panel--active'));
    }

    /* ── Orientación ── */
    if (saved.orientation) {
      const orientBtn = document.querySelector(`.orient-btn[data-orient="${saved.orientation}"]`);
      if (orientBtn) {
        document.querySelectorAll('.orient-btn').forEach(b => b.classList.remove('active'));
        orientBtn.classList.add('active');
      }
    }

    /* ── Actualizar tarjeta ── */
    window.CardModule.update(saved);
    return true;
  } catch (_e) {
    return false;
  }
}

/**
 * Monkey-patcha CardModule.update para guardar automáticamente
 * después de cada actualización (excepto qrDataUrl).
 * Debe llamarse DESPUÉS de que todos los _bind* estén conectados.
 */
function _bindStorageSync() {
  const origUpdate = window.CardModule.update.bind(window.CardModule);
  window.CardModule.update = function(updates) {
    origUpdate(updates);
    if (!('qrDataUrl' in updates)) _saveToStorage();
  };
}


/* ─────────────────────────────────────────────────────────────
   13. MODAL DE BIENVENIDA (primera visita)
   ───────────────────────────────────────────────────────────── */

const _WELCOME_STEPS = [
  {
    icon: '◈',
    title: 'Business Card Generator',
    body:  'Crea tarjetas de presentación profesionales en segundos. Sin registro ni costes.',
  },
  {
    icon: '✍',
    title: 'Rellena tu información',
    body:  'Nombre, cargo, empresa, redes sociales... La vista previa se actualiza en tiempo real.',
  },
  {
    icon: '🎨',
    title: 'Personaliza el diseño',
    body:  'Elige un tema rápido, ajusta colores, fuente y plantilla a tu gusto.',
  },
  {
    icon: '📤',
    title: 'Exporta y comparte',
    body:  'Descarga en PNG, PDF o imprime una hoja A4 con 10 tarjetas y líneas de corte.',
  },
];

function _showWelcomeIfFirst() {
  if (localStorage.getItem(WELCOME_KEY)) return;
  _openWelcomeModal();
}

function _openWelcomeModal() {
  let currentStep = 0;
  const overlay = document.createElement('div');
  overlay.className = 'welcome-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'welcome-title');

  function render() {
    const step   = _WELCOME_STEPS[currentStep];
    const isLast = currentStep === _WELCOME_STEPS.length - 1;
    const dots   = _WELCOME_STEPS.map((_, i) =>
      `<span class="welcome-dot${i === currentStep ? ' welcome-dot--active' : ''}"></span>`
    ).join('');

    overlay.innerHTML = `
      <div class="welcome-modal">
        <div class="welcome-modal__icon">${step.icon}</div>
        <h2 class="welcome-modal__title" id="welcome-title">${step.title}</h2>
        <p class="welcome-modal__body">${step.body}</p>
        <div class="welcome-modal__dots">${dots}</div>
        <div class="welcome-modal__actions">
          ${currentStep > 0
            ? `<button class="btn btn--ghost btn--sm" id="welcome-prev">← Anterior</button>`
            : `<span></span>`}
          ${isLast
            ? `<button class="btn btn--primary" id="welcome-done">¡Empezar!</button>`
            : `<button class="btn btn--primary" id="welcome-next">Siguiente →</button>`}
        </div>
      </div>`;

    overlay.querySelector('#welcome-next')?.addEventListener('click', () => { currentStep++; render(); });
    overlay.querySelector('#welcome-prev')?.addEventListener('click', () => { currentStep--; render(); });
    overlay.querySelector('#welcome-done')?.addEventListener('click', () => {
      localStorage.setItem(WELCOME_KEY, '1');
      overlay.remove();
    });
  }

  render();
  document.body.appendChild(overlay);
}


/* ─────────────────────────────────────────────────────────────
   14b. DESCARGA DE CONTACTO (.vcf)
   ───────────────────────────────────────────────────────────── */

let _vcfObjectUrl = null;

/**
 * Actualiza el href del enlace #download-vcf con un Object URL fresco.
 * Revoca el URL anterior para liberar memoria.
 */
function _refreshVcfLink() {
  const link = document.getElementById('download-vcf');
  if (!link || !window.buildVCardDataURL) return;
  if (_vcfObjectUrl) URL.revokeObjectURL(_vcfObjectUrl);
  _vcfObjectUrl = window.buildVCardDataURL(window.CardModule.getData());
  link.href = _vcfObjectUrl;
}

/**
 * Parcha CardModule.render para refrescar el enlace .vcf tras cada renderizado.
 */
function _bindVcfDownload() {
  const origRender = window.CardModule.render.bind(window.CardModule);
  window.CardModule.render = function() {
    origRender();
    _refreshVcfLink();
  };
  // Actualizar una vez al iniciar
  _refreshVcfLink();
}


/* ─────────────────────────────────────────────────────────────
   14. CHIPS DE INDUSTRIA
   ───────────────────────────────────────────────────────────── */

/**
 * Conecta los clics en los chips de industria con applyIndustry().
 */
function _connectIndustryChips() {
  document.querySelectorAll('.industry-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.industry-chip').forEach(c =>
        c.classList.remove('industry-chip--active'));
      chip.classList.add('industry-chip--active');
      if (window.applyIndustry) window.applyIndustry(chip.dataset.industry);
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   16. VERIFICACIÓN DE DEPENDENCIAS CDN
   ───────────────────────────────────────────────────────────── */

/**
 * Comprueba si las librerías CDN están disponibles.
 * Muestra un toast de error si alguna falta.
 */
function _checkCdnDeps() {
  const missing = [];
  if (typeof QRCode      === 'undefined') missing.push('QRCode');
  if (typeof html2canvas === 'undefined') missing.push('html2canvas');
  if (typeof window.jspdf === 'undefined' && typeof jspdf === 'undefined') missing.push('jsPDF');
  if (missing.length) {
    // showToast aún no existe (se expone tras DOMContentLoaded) — usar setTimeout
    setTimeout(() => {
      showToast(
        `Librerías no disponibles: ${missing.join(', ')}. Verifica la conexión a internet.`,
        'error', 7000
      );
    }, 800);
  }
}


/* ─────────────────────────────────────────────────────────────
   FUNCIONES PRIVADAS DE SETUP
   ───────────────────────────────────────────────────────────── */

/**
 * Devuelve el estado actual de la tarjeta.
 * Usado por exportDigitalCard para obtener los datos actuales.
 * @returns {Object} CardData
 */
function getCurrentFormData() {
  return window.CardModule.getData();
}

/**
 * Asigna todas las referencias a elementos del DOM.
 * Se llama una sola vez al iniciar.
 */
function _initDomRefs() {
  // Información personal
  inputName    = document.getElementById('input-name');
  inputRole    = document.getElementById('input-role');
  inputCompany = document.getElementById('input-company');
  inputTagline = document.getElementById('input-tagline');

  // Contacto
  inputEmail        = document.getElementById('input-email');
  inputPhone        = document.getElementById('input-phone');
  inputPhoneCountry = document.getElementById('input-phone-country');
  inputWebsite      = document.getElementById('input-website');
  inputLinkedin     = document.getElementById('input-linkedin');
  inputGithub       = document.getElementById('input-github');

  // Logo
  inputLogo      = document.getElementById('input-logo');
  logoPreviewImg = document.getElementById('logo-preview-img');
  btnRemoveLogo     = document.getElementById('btn-remove-logo');

  // Font picker (custom listbox)
  fontPicker         = document.getElementById('font-picker');
  fontPickerValue    = document.getElementById('font-picker-value');
  fontPickerDropdown = document.getElementById('font-picker-dropdown');
  inputFontHidden    = document.getElementById('select-font');

  // Colores
  inputColorPrimary   = document.getElementById('input-color-primary');
  inputColorSecondary = document.getElementById('input-color-secondary');
  inputQrColor        = document.getElementById('input-qr-color');

  // Template picker
  templatePicker = document.getElementById('template-picker');

  // QR
  toggleQr      = document.getElementById('toggle-qr');
  qrOptionsPanel = document.getElementById('qr-options');

  // Preview
  btnZoomIn   = document.getElementById('btn-zoom-in');
  btnZoomOut  = document.getElementById('btn-zoom-out');
  zoomValue   = document.getElementById('zoom-value');
  cardWrapper = document.getElementById('card-wrapper');

  // Acciones
  btnReset     = document.getElementById('btn-reset');
  btnExportPng = document.getElementById('btn-export-png');
  btnExportPdf = document.getElementById('btn-export-pdf');

  // Toasts
  toastRegion = document.getElementById('toast-region');
}
