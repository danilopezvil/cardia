/**
 * themes.js — Temas predefinidos y selector de tema
 * Business Card Generator
 * =====================================================================
 * Secciones:
 *  1. Catálogo de temas
 *  2. Estado del módulo
 *  3. API pública (ThemesModule)
 *  4. applyTheme(themeId) — aplica un tema al formulario y la tarjeta
 *  5. _renderThemeChips() — genera los chips en el DOM
 *  6. _updateActiveChip(themeId) — sincroniza estado visual de chips
 *  7. Exposición global + auto-init
 * =====================================================================
 */

'use strict';


/* ═══════════════════════════════════════════════════════════════════
   1. CATÁLOGO DE TEMAS
   Cada tema agrupa colores, tipografía y plantilla para aplicar
   de un solo click. El usuario puede sobreescribir cualquier
   valor individual después de aplicar el tema.
   ═══════════════════════════════════════════════════════════════════ */

const THEMES = [
  {
    id:       'midnight',
    name:     'Midnight',
    primary:  '#0f172a',
    secondary:'#3b82f6',
    font:     'Inter',
    template: 'corporate',
  },
  {
    id:       'forest',
    name:     'Forest',
    primary:  '#14532d',
    secondary:'#86efac',
    font:     'Raleway',
    template: 'minimal',
  },
  {
    id:       'rose',
    name:     'Rose Gold',
    primary:  '#881337',
    secondary:'#fda4af',
    font:     'Playfair Display',
    template: 'bold',
  },
  {
    id:       'slate',
    name:     'Slate',
    primary:  '#334155',
    secondary:'#94a3b8',
    font:     'Montserrat',
    template: 'minimal',
  },
  {
    id:       'amber',
    name:     'Amber',
    primary:  '#92400e',
    secondary:'#fbbf24',
    font:     'Space Grotesk',
    template: 'bold',
  },
  {
    id:       'ocean',
    name:     'Ocean',
    primary:  '#0c4a6e',
    secondary:'#38bdf8',
    font:     'Inter',
    template: 'corporate',
  },
];


/* ═══════════════════════════════════════════════════════════════════
   2. ESTADO DEL MÓDULO
   ═══════════════════════════════════════════════════════════════════ */

const ThemesState = {
  activeId: null,   // id del tema activo, o null si ninguno está seleccionado
};


/* ═══════════════════════════════════════════════════════════════════
   3. API PÚBLICA
   ═══════════════════════════════════════════════════════════════════ */

const ThemesModule = {

  /**
   * Renderiza los chips en el DOM.
   * Llamar una vez en DOMContentLoaded.
   */
  init() {
    _renderThemeChips();
  },

  /** Aplica un tema por id. Expuesto también como window.applyTheme. */
  applyTheme,

  /** Retorna el array completo de temas. */
  getThemes() {
    return THEMES;
  },

  /** Retorna el tema activo o null. */
  getActive() {
    return THEMES.find(t => t.id === ThemesState.activeId) ?? null;
  },
};


/* ═══════════════════════════════════════════════════════════════════
   4. applyTheme(themeId)
   Actualiza los inputs del formulario despachando los mismos eventos
   que el usuario dispararía manualmente. Los listeners de app.js
   hacen el resto: llaman a CardModule.update() y re-renderizan.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Aplica un tema predefinido: actualiza el formulario y re-renderiza
 * la tarjeta. El usuario puede modificar cualquier campo después.
 * @param {string} themeId — id de un tema en THEMES
 */
function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId);
  if (!theme) return;

  ThemesState.activeId = themeId;

  /* ── Colores: actualizar pickers + disparar 'input' para que
        _bindFormInputs en app.js llame a CardModule.update()  ── */
  const primaryInput   = document.getElementById('input-color-primary');
  const secondaryInput = document.getElementById('input-color-secondary');

  if (primaryInput) {
    primaryInput.value = theme.primary;
    primaryInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  if (secondaryInput) {
    secondaryInput.value = theme.secondary;
    secondaryInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* ── Plantilla: marcar el radio + disparar 'change' para que
        templatePicker listener llame a CardModule.update()    ── */
  const radio = document.querySelector(`[name="card-template"][value="${theme.template}"]`);
  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* ── Tipografía: click programático sobre la opción del font picker.
        El evento burbujea hasta #font-picker donde _bindFontPicker
        lo captura, llama _selectFont() y actualiza CardModule.         ──
     Nota: la opción está dentro del dropdown (hidden), pero los eventos
     despachados vía dispatchEvent() propagan independientemente de
     display:none.                                                        */
  const fontOption = document.querySelector(
    `.font-picker__option[data-font="${theme.font}"]`
  );
  if (fontOption) {
    fontOption.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }

  /* ── Actualizar estado visual de los chips ── */
  _updateActiveChip(themeId);
}


/* ═══════════════════════════════════════════════════════════════════
   5. _renderThemeChips()
   Crea un botón .theme-chip por cada tema en el contenedor
   #theme-chips. Los colores se inyectan como custom properties
   inline para el gradiente bicolor.
   ═══════════════════════════════════════════════════════════════════ */

function _renderThemeChips() {
  const container = document.getElementById('theme-chips');
  if (!container) return;

  container.innerHTML = '';

  THEMES.forEach(theme => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-chip';
    btn.dataset.themeId = theme.id;
    btn.title = theme.name;
    btn.setAttribute('aria-label', theme.name);
    btn.setAttribute('aria-pressed', 'false');

    /* Variables CSS inline: el gradiente diagonal las consume */
    btn.style.setProperty('--tc-p', theme.primary);
    btn.style.setProperty('--tc-s', theme.secondary);

    btn.addEventListener('click', () => applyTheme(theme.id));

    container.appendChild(btn);
  });
}


/* ═══════════════════════════════════════════════════════════════════
   6. _updateActiveChip(themeId)
   Marca el chip activo con .theme-chip--active y aria-pressed="true".
   ═══════════════════════════════════════════════════════════════════ */

function _updateActiveChip(themeId) {
  document.querySelectorAll('.theme-chip').forEach(btn => {
    const active = btn.dataset.themeId === themeId;
    btn.classList.toggle('theme-chip--active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}


/* ═══════════════════════════════════════════════════════════════════
   7. EXPOSICIÓN GLOBAL Y AUTO-INIT
   ═══════════════════════════════════════════════════════════════════ */

window.ThemesModule = ThemesModule;
window.applyTheme   = applyTheme;

document.addEventListener('DOMContentLoaded', () => ThemesModule.init());
