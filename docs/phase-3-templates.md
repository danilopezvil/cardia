# Cardia · Fase 3 (Sistema de Templates)

## Implementado
- Motor de templates desacoplado con `TemplateRenderer` + `templateRegistry`.
- 6 variantes de plantilla: corporate, minimal, creative, health, legal, tech.
- Integración del preview con render dinámico de frente/reverso por plantilla.
- Jerarquía visual consistente en todas las plantillas: nombre > cargo > empresa > contacto.
- Estilos semánticos por plantilla + compatibilidad con temas existentes (`midnight`, `light`, `ocean`).

## Riesgos abiertos
- QR sigue como placeholder semántico (imagen QR real en Fase 4).
- Algunas variantes pueden requerir ajuste fino de contraste con datos extremos.
