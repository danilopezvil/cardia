# Cardia · Fase 1 (Arquitectura Base)

## Diagnóstico inicial
El repositorio venía sin una aplicación frontend inicial ni estructura modular de capas.

## Decisiones de arquitectura
- **UI desacoplada de dominio**: la UI vive en `src/ui`, mientras reglas de negocio vivirán en `src/domain`.
- **Capa de aplicación** en `src/application` para orquestar casos de uso y coordinación de estado.
- **Servicios externos** (`src/services`) para QR, exportación y persistencia.
- **Shared** para tipos/utilidades reutilizables sin acoplar dominio/UI.

## Estructura propuesta
```text
src/
  app/                  # bootstrap y shell principal
  domain/               # modelos canónicos + validación
  application/          # casos de uso + estado
  services/             # qr/export/persistencia
  ui/
    design-tokens/      # sistema visual
    components/         # componentes de bajo nivel
    sections/           # paneles y bloques de página
    templates/          # plantillas visuales (Fase 3)
  shared/               # constantes, tipos, helpers
```

## Design tokens (v1)
- **Color**: fondo, superficies, texto, marca, foco.
- **Tipografía**: escalas XS→XL.
- **Spacing**: escala 4px-based.
- **Radius**: 3 niveles.
- **Sombras**: 2 niveles.

## Siguiente fase
- Modelo canónico versionado (`schemaVersion`).
- Validación y estado reactivo de formulario.
- Conexión de datos reales en preview.
