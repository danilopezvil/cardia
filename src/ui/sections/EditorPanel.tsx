export function EditorPanel() {
  return (
    <aside className="surface" aria-labelledby="editor-panel-title">
      <h2 id="editor-panel-title" className="surface__title">
        Card Editor
      </h2>
      <p className="surface__text">
        Fase 1: layout base y sistema visual. En Fase 2 conectaremos modelo canónico, validación y estado reactivo.
      </p>
      <ul className="surface__list">
        <li>Identidad personal y empresarial</li>
        <li>Canales de contacto</li>
        <li>Tema, plantilla e industria</li>
        <li>Configuración QR y exportación</li>
      </ul>
    </aside>
  );
}
