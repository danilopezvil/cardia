# Cardia · Fase 2 (Modelo + Validación + Estado)

## Implementado
- Modelo canónico `CardDocument` con `schemaVersion`.
- Normalización y validación de campos críticos (identidad/contacto/URL).
- Store con acciones tipadas para editor y configuración de estilo/QR.
- Persistencia local con migración segura por versión.
- Preview conectado en tiempo real al estado validado.

## Riesgos abiertos
- Aún no se renderiza QR real (solo placeholder de contenido).
- La exportación PNG/PDF se implementará en Fase 5.
- Faltan presets por industria y template engines visuales completos (Fase 3).
