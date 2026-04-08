# Prompt de arranque para reconstruir el proyecto en un nuevo repo

Quiero que actúes como **Lead Frontend Engineer + Product Designer** y me ayudes a construir desde cero una aplicación web de **generación de tarjetas de presentación**.

## Objetivo
Crear una app moderna, mantenible y visualmente profesional que permita:

1. Editar datos de una tarjeta en un panel.
2. Ver preview en vivo (frente y reverso).
3. Generar QR (vCard o URL).
4. Exportar a PNG y PDF con calidad de impresión.
5. Aplicar presets por industria y temas visuales.

## Requisitos técnicos
- Arquitectura modular y limpia (sin acoplamiento global).
- Separación de capas:
  - Modelo de datos y validación
  - Lógica de aplicación
  - Servicios (QR, exportación, persistencia)
  - UI/Componentes
- Código tipado y legible.
- Evitar dependencias innecesarias.
- Preparado para escalar (templates, idiomas, nuevos campos).

## Requisitos de diseño (muy importante)
- UI premium, minimalista y profesional.
- Sistema de diseño con tokens (color, tipografía, spacing, radius, sombras).
- 4–6 plantillas visuales consistentes (corporativa, minimal, creativa, salud, legal, tech).
- Jerarquía visual clara: nombre > cargo > empresa > contacto.
- Reverso orientado a QR con buena scaneabilidad.
- Accesibilidad WCAG AA (contraste, foco visible, labels correctos, navegación teclado).

## Flujo funcional esperado
1. El usuario llena formulario.
2. El preview se actualiza en tiempo real.
3. Puede cambiar industria/tema y orientación.
4. Puede activar QR modo vCard o URL.
5. Puede exportar:
   - PNG (frente)
   - PDF (frente + reverso) en tamaño tarjeta estándar.

## Entregables que necesito en esta sesión
1. Diagnóstico inicial y arquitectura propuesta.
2. Estructura de carpetas recomendada.
3. Modelo de datos canónico.
4. Plan de implementación por fases pequeñas.
5. Implementación real en código (no pseudocódigo).
6. Checklist de QA manual y técnico.
7. Sugerencias de mejora visual de alto impacto.

## Forma de trabajo obligatoria
- Primero presenta el plan y espera confirmación.
- Luego implementa fase por fase.
- En cada fase entrega:
  - qué cambiaste,
  - por qué,
  - riesgos,
  - cómo probarlo.
- Mantén compatibilidad hacia futuras migraciones de datos.
- Prioriza claridad y mantenibilidad sobre “trucos rápidos”.

## Criterios de éxito
- Preview fluido y consistente con exportación.
- Plantillas visualmente sólidas.
- QR escaneable en móvil real.
- Código fácil de mantener y extender.
- Documentación breve y útil para nuevos colaboradores.

## User-provided custom instructions

No crees una rama para cada petición, te dare una rama con las últomas modificaciones aisladas de la rama principal llamda cod, ahi puedes hacer y actulziar los fuentes y me el detalle se realizara en el commit.
