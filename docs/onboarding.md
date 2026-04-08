# Onboarding rápido para colaboradores

## Capas
- `src/domain`: modelo y validación.
- `src/application`: store y orquestación.
- `src/services`: QR, export, persistencia.
- `src/ui`: secciones, templates y estilos.

## Agregar un campo nuevo
1. Añadir al `CardDocument` en `src/domain/card/model.ts`.
2. Ajustar default en `createDefaultCardDocument`.
3. Actualizar `normalizeCardDocument` y `validateCardDocument`.
4. Conectar campo en `EditorPanel` y template(s) necesarios.

## Agregar una plantilla
1. Crear componente en `src/ui/templates/components`.
2. Registrar en `templateRegistry`.
3. Ajustar estilos semánticos en `tokens.css`.

## Evolucionar esquema
1. Incrementar `CARD_SCHEMA_VERSION`.
2. Actualizar migración en persistencia.
3. Mantener backward compatibility para documentos guardados.
