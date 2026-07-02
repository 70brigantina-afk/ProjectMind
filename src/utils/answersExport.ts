import { diagnosticBlocks } from '../data/diagnosticQuestions';
import type { Workspace } from '../types';
import { formatAnswerForDisplay, isAnswerFilled } from './progress';

function appendBlocksToLines(
  lines: string[],
  getAnswer: (questionId: string) => string | string[] | undefined,
): void {
  diagnosticBlocks.forEach((block) => {
    lines.push('────────────────────────────────────────');
    lines.push(`Блок: ${block.title}`);
    lines.push('────────────────────────────────────────');
    lines.push('');

    block.questions.forEach((q) => {
      const ans = getAnswer(q.id);
      lines.push(`Вопрос: ${q.text}`);
      if (ans !== undefined && isAnswerFilled(ans)) {
        lines.push(`Ответ: ${formatAnswerForDisplay(ans)}`);
      } else {
        lines.push('Ответ: (не заполнено)');
      }
      lines.push('');
    });
  });
}

export function buildPublicAnswersText(answers: Record<string, string | string[]>): string {
  const lines: string[] = [
    'ProjectMind — стратегическая диагностика проекта',
    `Дата: ${new Date().toLocaleString('ru-RU')}`,
    '',
  ];
  appendBlocksToLines(lines, (id) => answers[id]);
  return lines.join('\n');
}

export function buildAllAnswersText(workspace: Workspace): string {
  const getAnswer = (questionId: string) =>
    workspace.answers.find((a) => a.questionId === questionId);

  const lines: string[] = [
    `# ${workspace.title}`,
    `Клиент: ${workspace.clientName}`,
    `Ниша: ${workspace.niche}`,
    '',
  ];

  diagnosticBlocks.forEach((block) => {
    lines.push(`## ${block.title}`);
    block.questions.forEach((q) => {
      const ans = getAnswer(q.id);
      lines.push(`**${q.text}**`);
      if (ans && isAnswerFilled(ans.answer)) {
        lines.push(formatAnswerForDisplay(ans.answer));
      } else {
        lines.push('_Ответ не заполнен_');
      }
      lines.push('');
    });
  });

  return lines.join('\n');
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 200);
}

/** Ссылка на диагностику внутри рабочего пространства (HashRouter + GitHub Pages). */
export function getDiagnosticShareUrl(workspaceId: string): string {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const origin = window.location.origin;
  return `${origin}${baseUrl}#/workspaces/${workspaceId}/diagnostic`;
}
