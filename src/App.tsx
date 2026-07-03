import { HashRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { WorkspacesPage } from './pages/WorkspacesPage';
import { CreateWorkspacePage } from './pages/CreateWorkspacePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { AnswersPage } from './pages/AnswersPage';
import { AiAnalysisPage } from './pages/AiAnalysisPage';
import { ClientDiagnosticPage } from './pages/ClientDiagnosticPage';
import { MarinaStormPage } from './pages/MarinaStormPage';

export function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marina-storm" element={<MarinaStormPage />} />
        <Route path="/client-diagnostic" element={<ClientDiagnosticPage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/workspaces/new" element={<CreateWorkspacePage />} />
        <Route path="/workspaces/:id" element={<WorkspacePage />} />
        <Route path="/workspaces/:id/diagnostic" element={<DiagnosticPage />} />
        <Route path="/workspaces/:id/answers" element={<AnswersPage />} />
        <Route path="/workspaces/:id/ai-analysis" element={<AiAnalysisPage />} />
      </Routes>
    </HashRouter>
  );
}
