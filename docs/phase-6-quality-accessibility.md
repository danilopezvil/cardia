# Cardia · Fase 6 (Calidad, Accesibilidad, Onboarding)

## Implementado
- Mejora de accesibilidad en formulario con `id` + `htmlFor`, `aria-invalid` y `aria-describedby` por campo.
- Mensajería de estado de exportación: éxito (`role=status`) y error (`role=alert`).
- Navegación mejorada con skip-link para salto directo al editor.
- Ajustes visuales para campos inválidos y feedback claro de estado.

## QA Manual sugerido
1. Navegación solo teclado (Tab/Shift+Tab/Enter/Espacio) por todo el editor.
2. Confirmar que cada error se anuncia y está vinculado al campo correcto.
3. Verificar que botones de export se deshabilitan durante proceso.
4. Verificar que export se bloquea si hay errores de validación.
5. Probar QR modo URL/vCard y confirmar preview + export.
6. Validar contraste de mensajes de error/éxito y foco visible.
