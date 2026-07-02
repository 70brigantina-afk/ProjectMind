import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML =
    '<div style="padding:2rem;font-family:Inter,sans-serif;text-align:center"><h1>ProjectMind</h1><p>ProjectMind не смог загрузиться. Проверьте консоль браузера.</p></div>';
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
