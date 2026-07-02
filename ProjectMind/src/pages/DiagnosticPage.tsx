import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionField } from '../components/QuestionField';
import { diagnosticBlocks, DIAGNOSTIC_INTRO } from '../data/diagnosticQuestions';
import { buildAllAnswersText } from '../utils/answersExport';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../hooks/useToast';
import { getWorkspaceById, saveWorkspace } from '../utils/storage';
import {
  calculateDiagnosticProgress,
  isAnswerFilled,
  resolveWorkspaceStatus,
} from '../utils/progress';
import { scrollToTop } from '../utils/scroll';
import type { DiagnosticAnswer, Workspace, WorkspaceStatus } from '../types';

function isDiagnosticFinished(status: WorkspaceStatus): boolean {
  return (
    status === 'diagnostic_completed' ||
    status === 'ready_for_analysis' ||
    status === 'in_progress'
  );
}

export function DiagnosticPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [blockIndex, setBlockIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string | string[]>>({});
  const [savedHint, setSavedHint] = useState(false);

  useEffect(() => {
    if (!id) return;
    const ws = getWorkspaceById(id);
    if (!ws) return;
    setWorkspace(ws);
    setBlockIndex(ws.currentBlockIndex);

    const map: Record<string, string | string[]> = {};
    ws.answers.forEach((a) => {
      map[a.questionId] = a.answer;
    });
    setLocalAnswers(map);
  }, [id]);

  useEffect(() => {
    scrollToTop();
  }, [blockIndex]);

  useEffect(() => {
    if (workspace && isDiagnosticFinished(workspace.status)) {
      scrollToTop();
    }
  }, [workspace?.status]);

  const persistWorkspace = useCallback(
    (answersMap: Record<string, string | string[]>, currentIdx: number, completed = false) => {
      if (!workspace) return;

      const answers: DiagnosticAnswer[] = [];
      diagnosticBlocks.forEach((block) => {
        block.questions.forEach((q) => {
          const val = answersMap[q.id];
          if (isAnswerFilled(val)) {
            answers.push({
              blockId: block.id,
              questionId: q.id,
              questionText: q.text,
              answer: val!,
              updatedAt: new Date().toISOString(),
            });
          }
        });
      });

      const progress = calculateDiagnosticProgress(answers);
      const status = completed
        ? ('diagnostic_completed' as const)
        : resolveWorkspaceStatus(workspace.status, progress, false);

      const updated: Workspace = {
        ...workspace,
        answers,
        diagnosticProgress: progress,
        currentBlockIndex: currentIdx,
        status,
        updatedAt: new Date().toISOString(),
      };

      saveWorkspace(updated);
      setWorkspace(updated);
      return updated;
    },
    [workspace],
  );

  const goToBlock = useCallback(
    (index: number) => {
      setBlockIndex(index);
      persistWorkspace(localAnswers, index);
    },
    [localAnswers, persistWorkspace],
  );

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    const next = { ...localAnswers, [questionId]: value };
    setLocalAnswers(next);
    persistWorkspace(next, blockIndex);
  };

  const handleSave = () => {
    persistWorkspace(localAnswers, blockIndex);
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 2000);
  };

  const handleComplete = () => {
    if (
      !window.confirm(
        'Завершить диагностику? После этого вы сможете скопировать все ответы и отправить их маркетологу.',
      )
    ) {
      return;
    }
    persistWorkspace(localAnswers, blockIndex, true);
    scrollToTop();
  };

  const handleCopyAll = async () => {
    if (!workspace) return;
    const ok = await copyToClipboard(buildAllAnswersText(workspace));
    showToast(ok ? 'Все ответы скопированы' : 'Не удалось скопировать');
  };

  if (!workspace) {
    return (
      <Layout showBack backTo="/workspaces" backLabel="К списку проектов">
        <div className="page container">
          <h1 className="page-title">Проект не найден</h1>
        </div>
      </Layout>
    );
  }

  if (isDiagnosticFinished(workspace.status)) {
    return (
      <Layout showBack backTo={`/workspaces/${id}`} backLabel="Вернуться в проект">
        {Toast}
        <div className="page container">
          <h1 className="page-title">Диагностика завершена</h1>
          <p className="page-subtitle">
            Спасибо! Ваши ответы сохранены. Скопируйте их и отправьте маркетологу в удобном мессенджере
            или по email.
          </p>

          <Card>
            <p style={{ marginBottom: '1rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Нажмите кнопку ниже, чтобы скопировать все ответы одним текстом. После этого вставьте
              их в сообщение специалисту.
            </p>
            <div className="actions-row">
              <Button onClick={handleCopyAll}>Скопировать все ответы</Button>
              <Button variant="secondary" onClick={() => navigate(`/workspaces/${id}/answers`)}>
                Просмотреть ответы
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const block = diagnosticBlocks[blockIndex];
  const isFirst = blockIndex === 0;
  const isLast = blockIndex === diagnosticBlocks.length - 1;
  const progress = workspace.diagnosticProgress;

  return (
    <Layout showBack backTo={`/workspaces/${id}`} backLabel="Вернуться в проект">
      {Toast}
      <div className="page container">
        <h1 className="page-title">{DIAGNOSTIC_INTRO.title}</h1>
        {blockIndex === 0 && (
          <>
            <p className="page-subtitle">{DIAGNOSTIC_INTRO.description}</p>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                marginBottom: '1.5rem',
                fontSize: '0.9375rem',
              }}
            >
              {DIAGNOSTIC_INTRO.note}
            </p>
          </>
        )}

        <ProgressBar value={progress} label="Общий прогресс" />

        <div
          style={{
            margin: '1.5rem 0',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          Блок {blockIndex + 1} из {diagnosticBlocks.length}:{' '}
          <strong style={{ color: 'var(--color-text)' }}>{block.title}</strong>
        </div>

        <div
          style={{
            background: 'var(--color-primary-light)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <strong>Цель блока:</strong> {block.goal}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          {block.questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={
                localAnswers[question.id] ??
                (question.type === 'multiple' || question.type === 'multiple-with-other' ? [] : '')
              }
              onChange={(val) => handleAnswerChange(question.id, val)}
            />
          ))}
        </div>

        {savedHint && (
          <p style={{ color: 'var(--color-success)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Ответы сохранены
          </p>
        )}

        <div className="actions-row actions-row--between">
          <div className="actions-row">
            {!isFirst && (
              <Button variant="secondary" onClick={() => goToBlock(blockIndex - 1)}>
                Назад
              </Button>
            )}
            {!isLast && <Button onClick={() => goToBlock(blockIndex + 1)}>Далее</Button>}
          </div>
          <div className="actions-row">
            <Button variant="ghost" onClick={handleSave}>
              Сохранить
            </Button>
            {isLast && (
              <Button variant="primary" onClick={handleComplete}>
                Завершить диагностику
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
