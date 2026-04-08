# Prompts para generar una nueva y mejor versión del repo

Este documento concentra prompts reutilizables para pedirle a un LLM que rediseñe y evolucione este proyecto (**Business Card Generator**, app web estática en `business-card-generator/` con HTML/CSS/JS modular sin framework).

---

## 0) Prompt maestro (recomendado)

```text
Actúa como Staff Engineer + Product Designer + QA Lead. Quiero que diseñes y ejecutes un plan para crear una nueva versión del repo “Business Card Generator” (frontend estático con HTML/CSS/JS, módulos como app.js, card.js, qr.js, export.js, industries.js y themes.js).

Objetivo:
- Mantener la esencia del producto (generar tarjetas de presentación con preview, QR y export PNG/PDF).
- Mejorar arquitectura, mantenibilidad, UX/UI, accesibilidad, performance y calidad de exportación para impresión.

Entregables obligatorios:
1) Diagnóstico inicial del estado actual (fortalezas, deuda técnica, riesgos).
2) Arquitectura objetivo (módulos, responsabilidades, contrato de datos, convención de nombres).
3) Plan incremental en fases pequeñas con criterios de aceptación por fase.
4) Implementación concreta en código (no pseudo-código) con commits lógicos.
5) Pruebas (unitarias e integración), checklist de regresión y validación manual.
6) Resumen final con métricas de mejora (DX, rendimiento, accesibilidad, mantenibilidad).

Restricciones:
- No romper funcionalidades actuales: preview en vivo, QR, plantillas/industrias y exportación.
- Introducir compatibilidad gradual para nombres legacy de campos.
- Mantener una base visual profesional y legible (prioridad data-first).
- Minimizar dependencias; si propones nuevas, justificar costo/beneficio.

Forma de trabajo:
- Antes de editar, propone el plan y espera confirmación.
- Luego implementa fase por fase mostrando diffs y rationale técnico.
- Incluye ejemplos de pruebas y cómo ejecutar todo localmente.
```

---

## 1) Prompt de análisis técnico profundo del repo

```text
Analiza este repositorio frontend (HTML/CSS/JS) y produce un informe técnico profundo:

A) Mapa del sistema
- Estructura de carpetas y módulos.
- Flujo de datos entre formulario, render de tarjeta, QR y exportación.
- Dependencias externas (CDN/libs) y riesgos asociados.

B) Hallazgos priorizados
- Deuda técnica por severidad (alta/media/baja).
- Riesgos de mantenimiento, escalabilidad, seguridad y UX.
- Problemas de naming inconsistente y acoplamiento global.

C) Recomendaciones accionables
- Refactor por etapas (quick wins vs cambios estructurales).
- Qué archivos tocar primero y por qué.
- Cómo reducir riesgo de regresión.

Entrega el resultado en formato: “Resumen ejecutivo”, “Hallazgos”, “Plan recomendado”, “Riesgos y mitigación”.
```

---

## 2) Prompt para rediseño de arquitectura frontend

```text
Quiero una propuesta de arquitectura objetivo para este proyecto de generación de tarjetas.

Diseña:
1) Un modelo de datos canónico (ej. name, role, organization, contacts[], links[], meta, style, exportConfig).
2) Adaptador de compatibilidad legacy para campos actuales sin romper UI.
3) Separación por capas:
   - Estado y validación
   - Render UI
   - Servicios (QR, exportación, persistencia)
4) Convenciones de nombres y estructura de carpetas para crecer.
5) Estrategia para evitar dependencia de window globals.

Después de la propuesta, genera un plan de migración incremental en 4-6 pasos con criterios de aceptación por paso.
```

---

## 3) Prompt para rediseño UI/UX orientado a negocio

```text
Actúa como Senior Product Designer.
Rediseña la experiencia de “Business Card Generator” con foco en tarjetas profesionales multi-industria.

Necesito:
- Jerarquía visual data-first (nombre, rol, organización, contacto, links).
- Sistema visual consistente (tipografía, spacing, color tokens, componentes).
- Variantes de diseño: minimal, corporativo y temático (salud/tech), manteniendo consistencia base.
- Reverso QR-first (escaneabilidad real en móvil + impresión).
- Mejora de formulario: menos fricción, ayudas contextuales, validación clara.
- Accesibilidad WCAG (contraste, foco, labels, aria y navegación teclado).

Entrega:
1) Principios de diseño.
2) Wireframe textual por sección.
3) Reglas de estilo en formato token.
4) Checklist UX para validar antes de exportar.
```

---

## 4) Prompt para mejorar exportación e impresión (PNG/PDF)

```text
Actúa como especialista en impresión digital y frontend canvas/PDF.
Quiero optimizar la exportación de tarjetas (PNG/PDF) para uso profesional.

Tareas:
- Validar dimensiones reales de tarjeta (horizontal y vertical).
- Diseñar preflight de impresión (márgenes seguros, densidad, legibilidad mínima).
- Mejorar nitidez de exportación y consistencia entre preview y archivo final.
- Definir parámetros recomendados para QR impreso (tamaño, contraste, quiet zone, ECC).
- Proponer pruebas manuales para comprobar resultado en impresora real.

Incluye:
- Lista de cambios en código por archivo.
- Riesgos conocidos de html2canvas/jsPDF y workarounds.
- Criterios de “apto para imprimir”.
```

---

## 5) Prompt para refactor de calidad de código

```text
Refactoriza este repo para elevar su calidad sin cambiar funcionalidad visible.

Objetivos:
- Reducir complejidad en app.js (extraer funciones y responsabilidades).
- Eliminar duplicaciones y normalizar naming.
- Crear utilidades reutilizables para validación/formateo/sanitización.
- Añadir documentación técnica breve por módulo.
- Mantener compatibilidad con comportamiento actual.

Requisitos de entrega:
1) Tabla “Antes vs Después” con mejoras medibles.
2) Cambios atómicos por commit lógico.
3) Lista de regresiones potenciales y cómo se cubren.
```

---

## 6) Prompt para estrategia de testing y QA

```text
Diseña e implementa una estrategia de testing para este proyecto frontend.

Incluye:
- Unit tests para funciones críticas (normalización de datos, construcción de vCard, reglas de render).
- Integration tests para flujo principal: editar formulario -> preview -> QR -> export.
- Pruebas de regresión visual para 3 templates clave.
- Matriz de pruebas manuales cross-browser y mobile.
- Checklist de salida para release.

Deseo que me entregues:
1) Estructura de tests propuesta.
2) Herramientas recomendadas y por qué.
3) Ejemplos de casos de prueba concretos.
4) Comandos para ejecutar todo en CI.
```

---

## 7) Prompt para performance y experiencia en dispositivos modestos

```text
Quiero optimizar rendimiento percibido y tiempo de interacción en este generador.

Necesito que:
- Detectes cuellos de botella en render y listeners.
- Reduzcas trabajo innecesario en cada input (debounce/throttle/cálculo incremental).
- Propongas lazy-init para funciones pesadas (QR/export).
- Minimices impacto de fuentes y recursos externos.
- Definas métricas y presupuesto de rendimiento (TTI, FPS en preview, tamaño total).

Entrega una lista priorizada de optimizaciones con impacto esperado y complejidad.
```

---

## 8) Prompt para hardening de seguridad y robustez

```text
Actúa como AppSec Engineer para frontend.
Evalúa este repo y aplica hardening sin romper UX.

Objetivos:
- Mitigar riesgos de inyección/XSS (especialmente en render dinámico).
- Revisar sanitización de inputs y manejo de URLs.
- Reducir superficie de ataque por dependencias CDN.
- Definir política CSP recomendada.
- Mejorar manejo de errores y fallback de librerías externas.

Entrega:
1) Riesgos encontrados con severidad.
2) Parches concretos por archivo.
3) Checklist de seguridad para futuras contribuciones.
```

---

## 9) Prompt para internacionalización y escalabilidad de producto

```text
Quiero preparar este proyecto para múltiples idiomas y usos internacionales.

Diseña e implementa:
- Estructura i18n (catálogo de textos, llaves y fallback).
- Separación de texto UI vs lógica.
- Formatos regionales (teléfono, enlaces, etiquetas).
- Estrategia para agregar industrias/plantillas sin tocar demasiados archivos.
- Guía para contribuyentes que quieran añadir un nuevo idioma o plantilla.

Entrega cambios de código + guía de mantenimiento.
```

---

## 10) Prompt de roadmap de producto (90 días)

```text
Actúa como Product Manager técnico.
Construye un roadmap de 90 días para evolucionar este repo a una versión más robusta.

Quiero:
- Objetivos trimestrales con KPIs.
- Backlog priorizado (must/should/could).
- Dependencias técnicas y riesgos.
- Definición de hitos por sprint.
- Criterios de “Go/No-Go” para lanzar v2.

Incluye un plan de comunicación técnica: qué documentar en cada milestone para que el equipo pueda mantener el sistema.
```

---

## Sugerencia de uso

1. Empezar por el **Prompt 1 (análisis)** y luego usar el **Prompt 2 (arquitectura)**.
2. Ejecutar **Prompt 3 + 4** para UX y exportación.
3. Implementar con **Prompt 5 + 6** (refactor + QA).
4. Cerrar con **Prompt 7 + 8 + 9 + 10** para escalar a versión de producto.

Si deseas, en una siguiente iteración puedo convertir estos prompts en un **playbook operativo** con plantillas de issues, definición de ramas, estrategia de commits y formato de PR.
