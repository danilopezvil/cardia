# Cardia · Fase 4 (QR real + escaneabilidad)

## Implementado
- Servicio QR para payload URL o vCard.
- Generación de imagen QR real vía endpoint de creación PNG.
- Integración de QR en todos los reversos de templates.
- Mejoras visuales de escaneabilidad (quiet zone/blanco de contraste/tamaño).
- Validación adicional para modo vCard (nombre + contacto mínimo).

## Riesgos abiertos
- La generación depende de servicio remoto de QR (fase posterior: fallback local sin red).
- Exportación PNG/PDF todavía pendiente (Fase 5).
