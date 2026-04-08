import { CardStoreProvider } from '../application/store';
import { EditorPanel } from '../ui/sections/EditorPanel';
import { PreviewPanel } from '../ui/sections/PreviewPanel';
import './App.css';

export function App() {
  return (
    <CardStoreProvider>
      <a className="skip-link" href="#card-editor">
        Skip to editor
      </a>

      <main className="app-shell">
        <header className="app-shell__header">
          <p className="app-shell__eyebrow">Cardia Studio</p>
          <h1 className="app-shell__title">Business Card Builder</h1>
          <p className="app-shell__subtitle">Fase 6: accesibilidad WCAG AA, QA y documentación de onboarding.</p>
        </header>

        <section className="app-shell__workspace" aria-label="Editor and preview workspace">
          <div id="card-editor">
            <EditorPanel />
          </div>
          <PreviewPanel />
        </section>
      </main>
    </CardStoreProvider>
  );
}
