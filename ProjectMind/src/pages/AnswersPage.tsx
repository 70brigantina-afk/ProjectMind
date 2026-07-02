import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { diagnosticBlocks } from '../data/diagnosticQuestions';
import { buildAllAnswersText } from '../utils/answersExport';
import { getWorkspaceById } from '../utils/storage';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../hooks/useToast';
import { formatAnswerForDisplay, isAnswerFilled } from '../utils/progress';
import type { Workspace } from '../types';

export function AnswersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    if (id) setWorkspace(getWorkspaceById(id) ?? null);
  }, [id]);

  if (!workspace) {
    return (
      <Layout showBack backTo="/workspaces" backLabel="К списку проектов">
        <div className="page container">
          <h1 className="page-title">Проект не найден</h1>
        </div>
      </Layout>
    );
  }

  const getAnswer = (questionId: string) =>
    workspace.answers.find((a) => a.questionId === questionId);

  const buildAllText = (): string => buildAllAnswersText(workspace);

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(buildAllText());
    showToast(ok ? 'Все ответы скопированы' : 'Не удалось скопировать');
  };

  const handleCopyAnswer = async (text: string) => {
    const ok = await copyToClipboard(text);
    showToast(ok ? 'Ответ скопирован' : 'Не удалось скопировать');
  };

  return (
    <Layout showBack backTo={`/workspaces/${id}`} backLabel="Вернуться в проект">
      {Toast}
      <div className="page container">
        <h1 className="page-title">Ответы клиента</h1>
        <p className="page-subtitle">
          {workspace.clientName} · {workspace.title}
        </p>

        <div className="actions-row" style={{ marginBottom: '1.5rem' }}>
          <Button variant="secondary" onClick={handleCopyAll}>
            Скопировать все ответы
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/workspaces/${id}`)}>
            Вернуться в проект
          </Button>
        </div>

        {diagnosticBlocks.map((block) => (
          <div key={block.id} className="answer-block">
            <h2 className="answer-block__title">{block.title}</h2>
            {block.questions.map((q) => {
              const ans = getAnswer(q.id);
              const filled = ans && isAnswerFilled(ans.answer);
              return (
                <div key={q.id} className="answer-item">
                  <div className="answer-item__question">{q.text}</div>
                  {filled ? (
                    <>
                      <div className="answer-item__text">
                        {formatAnswerForDisplay(ans!.answer)}
                      </div>
                      <Button
                        variant="ghost"
                        style={{ marginTop: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
                        onClick={() => handleCopyAnswer(formatAnswerForDisplay(ans!.answer))}
                      >
                        Скопировать ответ
                      </Button>
                    </>
                  ) : (
                    <div className="answer-item__empty">Ответ не заполнен</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Layout>
  );
}
