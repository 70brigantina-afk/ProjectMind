export type WorkspaceStatus =
  | 'draft'
  | 'diagnostic_started'
  | 'diagnostic_completed'
  | 'ready_for_analysis'
  | 'in_progress';

export type DiagnosticAnswer = {
  blockId: string;
  questionId: string;
  questionText: string;
  answer: string | string[];
  updatedAt: string;
};

export type Workspace = {
  id: string;
  title: string;
  clientName: string;
  niche: string;
  projectFormat: string;
  mainGoal: string;
  comment?: string;
  status: WorkspaceStatus;
  createdAt: string;
  updatedAt: string;
  diagnosticProgress: number;
  currentBlockIndex: number;
  answers: DiagnosticAnswer[];
};

export type QuestionType = 'short' | 'long' | 'single' | 'multiple' | 'multiple-with-other';

export type DiagnosticQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: string[];
};

export type DiagnosticBlock = {
  id: string;
  title: string;
  goal: string;
  questions: DiagnosticQuestion[];
};

export type StageState = 'not_started' | 'in_progress' | 'done';

export const STATUS_LABELS: Record<WorkspaceStatus, string> = {
  draft: 'Черновик',
  diagnostic_started: 'Диагностика начата',
  diagnostic_completed: 'Диагностика завершена',
  ready_for_analysis: 'Готов к анализу',
  in_progress: 'В работе',
};

export const PROJECT_FORMATS = [
  'Лендинг',
  'Сайт',
  'Бесплатная встреча / мероприятие',
  'Консультация',
  'Онлайн-курс',
  'Личный бренд',
  'Услуга эксперта',
  'Другое',
] as const;

export const MAIN_GOALS = [
  'Собрать заявки',
  'Привлечь людей на мероприятие',
  'Продать консультации',
  'Упаковать эксперта',
  'Проверить гипотезу',
  'Запустить рекламу',
  'Создать основу стратегии',
  'Пока не знаю',
] as const;

export const STAGE_LABELS: Record<string, string> = {
  not_started: 'Не начато',
  in_progress: 'В процессе',
  done: 'Готово',
};
