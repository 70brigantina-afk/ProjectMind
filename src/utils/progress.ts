import { diagnosticBlocks } from '../data/diagnosticQuestions';
import type { DiagnosticAnswer, WorkspaceStatus } from '../types';

export function getTotalQuestionCount(): number {
  return diagnosticBlocks.reduce((sum, block) => sum + block.questions.length, 0);
}

export function isAnswerFilled(answer: string | string[] | undefined): boolean {
  if (answer === undefined) return false;
  if (Array.isArray(answer)) return answer.length > 0;
  return answer.trim().length > 0;
}

export function calculateDiagnosticProgress(answers: DiagnosticAnswer[]): number {
  const total = getTotalQuestionCount();
  if (total === 0) return 0;

  const answeredIds = new Set(
    answers.filter((a) => isAnswerFilled(a.answer)).map((a) => a.questionId),
  );

  return Math.round((answeredIds.size / total) * 100);
}

export function resolveWorkspaceStatus(
  currentStatus: WorkspaceStatus,
  progress: number,
  diagnosticCompleted: boolean,
): WorkspaceStatus {
  if (diagnosticCompleted) {
    if (currentStatus === 'ready_for_analysis' || currentStatus === 'in_progress') {
      return currentStatus;
    }
    return 'diagnostic_completed';
  }
  if (progress > 0) return 'diagnostic_started';
  return 'draft';
}

export function formatAnswerForDisplay(answer: string | string[]): string {
  if (Array.isArray(answer)) return answer.join(', ');
  return answer;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
