# Cardia · Fase 5 (Export PNG/PDF)

## Implementado
- Servicio de exportación a PNG (frente) con canvas a 300 DPI.
- Flujo de exportación PDF de frente + reverso mediante ventana de impresión optimizada para "Guardar como PDF".
- Botones de exportación en editor con estado de carga y manejo de error.
- Bloqueo de exportación cuando existen errores de validación.

## Riesgos abiertos
- El PDF usa flujo de impresión del navegador (dependiente del runtime/OS).
- En una siguiente iteración conviene generar PDF binario directo con librería dedicada.
