# Análisis integral y propuesta de rediseño — Business Card Generator

## 1) Diagnóstico actual (arquitectura, UI/UX, datos y flujo)

### Arquitectura
- **Stack actual**: aplicación web estática (HTML + CSS + JS global) sin bundler ni framework.
- **Módulos**:
  - `app.js`: orquestación de eventos, estado UI, persistencia y acciones.
  - `card.js`: modelo `CardData`, normalización y render del frente/reverso.
  - `qr.js`: generación de vCard y QR con `qrcodejs`.
  - `industries.js` y `themes.js`: presets por industria y tema.
  - `export.js`: exportación PNG/PDF vía `html2canvas` + `jsPDF`.
- **Fortaleza**: separación funcional básica clara por responsabilidades.
- **Riesgo**: acoplamiento por globals (`window.*`), render por `innerHTML` y mapping alias disperso.

### UI/UX actual
- Existe buen nivel de controles (acordeones, presets, chips, tipografías, orientación, preview, export).
- La **UI shell** privilegia modo oscuro por defecto y mezcla varias familias visuales; para objetivo “profesional multi-sector” conviene un baseline claro más neutro.
- La tarjeta mezcla estilos muy distintos (tech, zine, legal, etc.). Algunos templates priorizan estética sobre jerarquía informativa.

### Estructura de datos
- El formulario captura más campos que los realmente priorizados para contacto rápido.
- Hay duplicidad semántica (`role/title`, `colorPrimary/primaryColor`, `showQr/showQR`, etc.) que aumenta complejidad de sincronización.

### Flujo de generación
1. Usuario edita formulario.
2. `app.js` envía updates a `CardModule.update(...)`.
3. `card.js` normaliza + renderiza frente/reverso.
4. Si QR está activo, se genera desde `qr.js`.
5. Export via captura de preview.

Este flujo funciona, pero para calidad de impresión y validación de QR falta una capa explícita de “preflight”.

---

## 2) Rediseño propuesto (objetivo principal)

### Objetivo
Mejorar **jerarquía visual**, **legibilidad** y **estética profesional transversal** (salud, tecnología, corporativo), reduciendo ruido visual y reforzando consistencia.

### Principios aplicados
- **Data-first**: el layout nace del orden de importancia de datos, no del ornamento.
- **System-first**: tokens de espaciado, tipografía y color consistentes.
- **Print-first + screen-friendly**: composición robusta para 85.6×54 mm y preview responsiva.

---

## 3) Lineamientos UI/UX concretos

### a) Estilo visual
- Establecer **modo claro por defecto** para edición y preview:
  - Base: blanco/gris suave.
  - Acentos controlados por industria: azul, verde o slate tecnológico.
- Evitar fondos oscuros como baseline; dejarlos como variantes opcionales.
- Definir contrastes mínimos:
  - Texto principal ≥ 7:1 en zonas clave.
  - Texto secundario ≥ 4.5:1.

### b) Tipografía
- Set principal: `Inter` (default), `Roboto`, `Open Sans`.
- Escala tipográfica recomendada (frente):
  - **Nombre**: 20–26 px (peso 700–800).
  - **Cargo**: 10–12 px (peso 500–600).
  - **Contacto**: 9–10 px (peso 400–500, alto interlineado).
- Evitar serif como default para sectores técnicos/corporativos.

### c) Composición
- Grid recomendado:
  - 12 columnas virtuales en horizontal (uso 8/4 o 9/3 para contenido/QR).
  - Margen seguro de 16–20 px + sangrado de export configurable.
- Espaciado: escala de 4 px (4/8/12/16/20).
- Micro-diferenciadores (sin romper claridad):
  - alineación asimétrica controlada,
  - bloques respirados con espacio negativo,
  - overlays suaves de 4–8% opacidad.

---

## 4) Data-first design (reordenamiento)

Orden prioritario obligatorio:
1. Nombre completo
2. Cargo/Rol
3. Organización
4. Contacto (tel/email)
5. Enlaces (web/redes)

### Reglas de simplificación
- Máximo 4 líneas de contacto visibles en frente.
- Redes solo si aportan valor directo (p.ej. LinkedIn, web).
- Campos de industria (registro/especialidad/stack) pasan a “metadata” secundaria.
- Sustituir prefijos textuales por iconografía semántica SVG (tel/email/web/ubicación).

### Refactor de datos recomendado
- Estandarizar contrato interno:
  - `name`, `role`, `organization`, `contacts[]`, `links[]`, `meta{}`.
- Mantener capa de compatibilidad temporal con legacy para no romper export/persistencia.

---

## 5) Logos temáticos dinámicos (SVG)

Implementación sugerida:
- Nuevo módulo `branding.js` con catálogo SVG por categoría:
  - **health**: cruz médica/onda ECG sutil.
  - **tech**: nodos/circuitos ligeros.
  - **corporate**: geometría lineal limpia.
- Integración como capa decorativa de fondo (`pointer-events: none`) con opacidad 0.06–0.14.
- Variantes para modo claro; evitar logos invasivos (>20% área visual relevante).

---

## 6) Reverso optimizado (QR-first)

### Composición propuesta
- QR ocupa **50–70%** del área útil del reverso.
- Ubicación centrada o centrada con desplazamiento leve para balance óptico.
- Quiet zone mínima: 4 módulos alrededor del código.

### Elementos adicionales
- Marca/nombre en 8–10 px (discreto).
- CTA breve: “Escanea para guardar contacto”.

### Ajustes técnicos
- Evitar degradados detrás del QR.
- Fondo sólido claro para máxima lectura.

---

## 7) Validación técnica obligatoria (plan)

### QR
- Payload:
  - `vCard 4.0` por defecto.
  - URL como fallback/controlado por opción explícita.
- Pruebas de escaneo:
  - iOS cámara nativa, Android cámara nativa y 1 app de terceros.
  - Distancias de 15–35 cm y baja iluminación moderada.
- Calidad para impresión:
  - objetivo de export: 300 DPI equivalentes.
  - tamaño físico del QR mínimo recomendado: 18–22 mm en impresión final.

### Exportación
- PNG: conservar escala alta y fondo correcto.
- PDF: validar dimensiones reales (85.6×54 mm horizontal / 54×85.6 mm vertical).
- Verificar que frente/reverso mantengan integridad visual y datos completos.

### Integridad de datos
- Test de snapshot de contenido renderizado:
  - nombre/cargo/org/contacto presentes y en orden.
- Tests de regresión para aliases legacy al actualizar modelo.

---

## 8) Tres variantes de diseño propuestas

## Variante A — Minimalista
- Base blanca + acento azul suave.
- Frente: bloque tipográfico izquierdo, QR pequeño opcional en esquina inferior derecha.
- Reverso: QR central dominante + CTA corto.
- Diferenciador: eje vertical desfasado (asimetría leve).

## Variante B — Profesional corporativo
- Base clara con barra lateral/acento geométrico discreto.
- Nombre y cargo en bloque superior; contacto en columna compacta con iconos.
- Reverso con QR grande + wordmark corporativo micro.
- Diferenciador: uso de espacio negativo en tercio superior.

## Variante C — Temático (salud/tecnología)
- Salud: acento verde/azul clínico, icono médico lineal de baja opacidad.
- Tecnología: patrón nodal/circuito ultra-sutil en fondo.
- Mismo esqueleto data-first para no perder consistencia transversal.
- Diferenciador: overlay SVG contextual adaptativo por industria.

---

## 9) Cambios sugeridos por componente

- `card.js`
  - separar `renderFrontDataBlock()` y `renderFrontDecorationBlock()`.
  - unificar naming (`role`, `organization`, `showQr`) y dejar adapter legacy.
- `qr.js`
  - parametrizar tamaño por ratio del reverso (50–70% área útil).
  - agregar opción de nivel ECC configurable (`M`/`Q`) y validación de longitud payload.
- `industries.js`
  - desacoplar “industria” de “layout”; industria define tono/iconografía, no estructura base.
- `themes.js`
  - reducir paleta a set claro profesional como defaults.
- `export.js`
  - preflight de impresión (dimensiones, densidad estimada, márgenes de seguridad).
- `main.css` / `card.css`
  - introducir tokens de tipografía y spacing para jerarquía consistente.
  - mover estilos inline del render a clases semánticas reutilizables.

---

## 10) Recomendaciones técnicas adicionales

- Añadir `zod` o validación ligera para sanitizar y validar `CardData` antes de render/export.
- Introducir pruebas visuales snapshot (Playwright) para 3 variantes objetivo.
- Crear “Design Tokens” (`tokens.css`): color, tipografía, spacing, radios y elevación.
- Implementar pipeline de export dedicado (canvas offscreen) para precisión de impresión.
- Añadir “modo revisión” con checklist pre-export:
  - contraste,
  - truncamiento de textos,
  - tamaño mínimo de QR,
  - campos obligatorios.

---

## 11) Plan de implementación incremental

1. **Fase 1 (estructura)**: unificación de modelo de datos + layout data-first base.
2. **Fase 2 (visual)**: 3 variantes y sistema de iconografía SVG contextual.
3. **Fase 3 (QR/print)**: QR-first back side + preflight de export/escaneabilidad.
4. **Fase 4 (QA)**: pruebas cross-device y snapshots visuales.

Con este enfoque, el generador pasa de una colección de templates heterogéneos a un sistema robusto, legible y profesional, manteniendo flexibilidad por industria sin sacrificar consistencia.
