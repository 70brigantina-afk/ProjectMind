import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionField } from '../components/QuestionField';
import { diagnosticBlocks } from '../data/diagnosticQuestions';
import { buildPublicAnswersText, downloadTextFile } from '../utils/answersExport';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../hooks/useToast';
import { isAnswerFilled } from '../utils/progress';
import { scrollToTop } from '../utils/scroll';
import {
  loadPublicDiagnostic,
  savePublicDiagnostic,
  clearPublicDiagnostic,
} from '../utils/publicDiagnosticStorage';

const CLIENT_INTRO = {
  title: 'Стратегическая диагностика проекта',
  subtitle:
    'Ответы помогут подготовить лендинг, оффер и рекламную стратегию без лишних уточнений.',
  description:
    'Марина, заполните, пожалуйста, эту диагностику спокойно и подробно. Не обязательно отвечать идеально — можно писать своими словами. Чем больше информации будет в ответах, тем точнее получится лендинг и реклама.',
};

function calculateProgress(answers: Record<string, string | string[]>): number {
  const total = diagnosticBlocks.reduce((sum, b) => sum + b.questions.length, 0);
  if (total === 0) return 0;
  const answered = diagnosticBlocks.reduce((count, block) => {
    return (
      count +
      block.questions.filter((q) => isAnswerFilled(answers[q.id])).length
    );
  }, 0);
  return Math.round((answered / total) * 100);
}

export function ClientDiagnosticPage() {
  const { showToast, Toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [blockIndex, setBlockIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [savedHint, setSavedHint] = useState(false);

  useEffect(() => {
    const saved = loadPublicDiagnostic();
    setAnswers(saved.answers);
    setBlockIndex(saved.currentBlockIndex);
    setCompleted(saved.completed);
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [blockIndex, completed]);

  const persist = useCallback(
    (
      nextAnswers: Record<string, string | string[]>,
      nextBlockIndex: number,
      nextCompleted: boolean,
    ) => {
      savePublicDiagnostic({
        answers: nextAnswers,
        currentBlockIndex: nextBlockIndex,
        completed: nextCompleted,
        updatedAt: new Date().toISOString(),
      });
    },
    [],
  );

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    persist(next, blockIndex, completed);
  };

  const goToBlock = (index: number) => {
    setBlockIndex(index);
    persist(answers, index, completed);
  };

  const handleSave = () => {
    persist(answers, blockIndex, completed);
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 2000);
  };

  const handleComplete = () => {
    if (
      !window.confirm(
        'Завершить диагностику? После этого вы сможете скопировать или скачать все ответы.',
      )
    ) {
      return;
    }
    setCompleted(true);
    persist(answers, blockIndex, true);
    scrollToTop();
  };

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(buildPublicAnswersText(answers));
    showToast(ok ? 'Все ответы скопированы' : 'Не удалось скопировать');
  };

  const handleDownload = () => {
    downloadTextFile(buildPublicAnswersText(answers), 'projectmind-diagnostic-answers.txt');
    showToast('Файл скачан');
  };

  const handleRestart = () => {
    if (
      !window.confirm(
        'Начать заново? Все текущие ответы будут удалены из этого браузера.',
      )
    ) {
      return;
    }
    clearPublicDiagnostic();
    setAnswers({});
    setBlockIndex(0);
    setCompleted(false);
    scrollToTop();
  };

  const progress = calculateProgress(answers);

  if (completed) {
    return (
      <Layout showBack backTo="/" backLabel="На главную">
        {Toast}
        <div className="page container">
          <h1 className="page-title">Диагностика завершена</h1>
          <p className="page-subtitle">
            Спасибо! Скопируйте или скачайте ответы и отправьте их маркетологу в удобном
            мессенджере или по email.
          </p>

          <Card>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Все ответы сохранены в этом браузере. Выберите действие:
            </p>
            <div className="completion-actions">
              <Button type="button" fullWidth onClick={handleCopyAll}>
                Скопировать все ответы
              </Button>
              <Button type="button" fullWidth variant="secondary" onClick={handleDownload}>
                Скачать ответы в TXT
              </Button>
              <Button type="button" fullWidth variant="ghost" onClick={handleRestart}>
                Начать заново
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

  return (
    <Layout showBack backTo="/" backLabel="На главную">
      {Toast}
      <div className="page container">
        <h1 className="page-title">{CLIENT_INTRO.title}</h1>
        {blockIndex === 0 && (
          <>
            <p className="page-subtitle">{CLIENT_INTRO.subtitle}</p>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                marginBottom: '1.5rem',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
              }}
            >
              {CLIENT_INTRO.description}
            </p>
            <p
              style={{
                color: 'var(--color-text-muted)',
                marginBottom: '1.5rem',
                fontSize: '0.8125rem',
              }}
            >
              Ответы автоматически сохраняются в этом браузере — можно вернуться позже.
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
                answers[question.id] ??
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

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8125rem' }}>
          <Link to="/">ProjectMind</Link>
        </p>
      </div>
    </Layout>
  );
}
