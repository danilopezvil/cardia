import { EditorPanel } from '../ui/sections/EditorPanel';
import { PreviewPanel } from '../ui/sections/PreviewPanel';
import './App.css';

export function App() {
  return (
    <main className="app-shell">
      <header className="app-shell__header">
        <p className="app-shell__eyebrow">Cardia Studio</p>
        <h1 className="app-shell__title">Business Card Builder</h1>
        <p className="app-shell__subtitle">
          Arquitectura base lista para escalar: panel de edición, preview vivo y sistema de diseño con tokens.
        </p>
      </header>

      <section className="app-shell__workspace" aria-label="Editor and preview workspace">
        <EditorPanel />
        <PreviewPanel />
      </section>
    </main>
  );
}
