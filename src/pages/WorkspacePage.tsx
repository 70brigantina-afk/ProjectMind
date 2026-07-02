import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { getWorkspaceById, saveWorkspace } from '../utils/storage';
import { getDiagnosticShareUrl } from '../utils/answersExport';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../hooks/useToast';
import type { StageState, Workspace } from '../types';
import { STAGE_LABELS } from '../types';

type RoadmapStage = {
  id: string;
  title: string;
  state: StageState;
  note?: string;
  future?: boolean;
};

function getStageStates(ws: Workspace): RoadmapStage[] {
  const diagnosticDone = ws.status === 'diagnostic_completed' || ws.status === 'ready_for_analysis' || ws.status === 'in_progress';
  const diagnosticStarted = ws.diagnosticProgress > 0 || ws.status === 'diagnostic_started';

  let diagnosticState: StageState = 'not_started';
  if (diagnosticDone) diagnosticState = 'done';
  else if (diagnosticStarted) diagnosticState = 'in_progress';

  let answersState: StageState = diagnosticDone ? 'done' : diagnosticStarted ? 'in_progress' : 'not_started';

  let aiState: StageState = 'not_started';
  if (ws.status === 'ready_for_analysis') aiState = 'in_progress';
  if (ws.status === 'in_progress') aiState = 'done';

  return [
    { id: 'goal', title: 'Цель проекта', state: 'done' },
    { id: 'diagnostic', title: 'Диагностика', state: diagnosticState },
    { id: 'answers', title: 'Ответы клиента', state: answersState },
    { id: 'ai', title: 'AI-анализ', state: aiState },
    { id: 'landing', title: 'Лендинг / сайт', state: 'not_started', future: true, note: 'Следующий этап' },
    { id: 'ads', title: 'Реклама', state: 'not_started', future: true, note: 'Следующий этап' },
    { id: 'materials', title: 'Материалы', state: 'not_started', future: true, note: 'Следующий этап' },
  ];
}

function stageIcon(state: StageState): string {
  if (state === 'done') return '✓';
  if (state === 'in_progress') return '…';
  return '○';
}

export function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    if (id) {
      const ws = getWorkspaceById(id);
      setWorkspace(ws ?? null);
    }
  }, [id]);

  if (!workspace) {
    return (
      <Layout showBack backTo="/workspaces" backLabel="К списку проектов">
        <div className="page container">
          <h1 className="page-title">Проект не найден</h1>
          <Button onClick={() => navigate('/workspaces')}>Вернуться к списку</Button>
        </div>
      </Layout>
    );
  }

  const diagnosticUrl = getDiagnosticShareUrl(workspace.id);
  const stages = getStageStates(workspace);
  const diagnosticCompleted =
    workspace.status === 'diagnostic_completed' ||
    workspace.status === 'ready_for_analysis' ||
    workspace.status === 'in_progress';

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(diagnosticUrl);
    showToast(ok ? 'Ссылка скопирована' : 'Не удалось скопировать ссылку');
  };

  const handlePrepareAi = () => {
    const updated: Workspace = {
      ...workspace,
      status: 'ready_for_analysis',
      updatedAt: new Date().toISOString(),
    };
    saveWorkspace(updated);
    setWorkspace(updated);
    navigate(`/workspaces/${workspace.id}/ai-analysis`);
  };

  return (
    <Layout showBack backTo="/workspaces" backLabel="К списку проектов">
      {Toast}
      <div className="page container container--wide">
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>{workspace.title}</h1>
            <StatusBadge status={workspace.status} />
          </div>
          <p className="page-subtitle" style={{ marginBottom: '1rem' }}>
            {workspace.clientName} · {workspace.niche}
          </p>
          <ProgressBar value={workspace.diagnosticProgress} label="Прогресс диагностики" />
        </div>

        <div className="actions-row" style={{ marginBottom: '2rem' }}>
          <Button onClick={() => navigate(`/workspaces/${workspace.id}/diagnostic`)}>
            Открыть диагностику
          </Button>
          <Button variant="secondary" onClick={handleCopyLink}>
            Скопировать ссылку для клиента
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/workspaces/${workspace.id}/ai-analysis`)}
          >
            Перейти к анализу
          </Button>
          {diagnosticCompleted && (
            <Button variant="secondary" onClick={handlePrepareAi}>
              Подготовить AI-анализ
            </Button>
          )}
        </div>

        <section className="goal-section">
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Цель проекта</h2>
          <dl>
            <div>
              <dt>Формат проекта</dt>
              <dd>{workspace.projectFormat}</dd>
            </div>
            <div>
              <dt>Главная задача</dt>
              <dd>{workspace.mainGoal}</dd>
            </div>
            {workspace.comment && (
              <div>
                <dt>Комментарий</dt>
                <dd>{workspace.comment}</dd>
              </div>
            )}
          </dl>
          <div style={{ marginTop: '1rem' }}>
            <Button
              variant="ghost"
              onClick={() => navigate(`/workspaces/${workspace.id}/answers`)}
            >
              Смотреть ответы клиента
            </Button>
          </div>
        </section>

        <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Этапы работы</h2>
        <div className="roadmap">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`roadmap-item ${stage.future ? 'roadmap-item--future' : ''} roadmap-item--${stage.state}`}
            >
              <span className="roadmap-item__icon">{stageIcon(stage.state)}</span>
              <div className="roadmap-item__content">
                <div className="roadmap-item__title">{stage.title}</div>
                <div className="roadmap-item__note">
                  {stage.future ? stage.note : STAGE_LABELS[stage.state]}
                </div>
              </div>
              {stage.id === 'diagnostic' && !stage.future && (
                <Button variant="ghost" onClick={() => navigate(`/workspaces/${workspace.id}/diagnostic`)}>
                  Открыть
                </Button>
              )}
              {stage.id === 'answers' && workspace.answers.length > 0 && (
                <Button variant="ghost" onClick={() => navigate(`/workspaces/${workspace.id}/answers`)}>
                  Смотреть
                </Button>
              )}
              {stage.id === 'ai' && !stage.future && (
                <Button variant="ghost" onClick={() => navigate(`/workspaces/${workspace.id}/ai-analysis`)}>
                  Открыть
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
