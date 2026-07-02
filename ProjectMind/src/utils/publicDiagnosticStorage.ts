export type PublicDiagnosticState = {
  answers: Record<string, string | string[]>;
  currentBlockIndex: number;
  completed: boolean;
  updatedAt: string;
};

const STORAGE_KEY = 'projectmind_public_diagnostic';

const emptyState = (): PublicDiagnosticState => ({
  answers: {},
  currentBlockIndex: 0,
  completed: false,
  updatedAt: new Date().toISOString(),
});

export function loadPublicDiagnostic(): PublicDiagnosticState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return JSON.parse(raw) as PublicDiagnosticState;
  } catch {
    return emptyState();
  }
}

export function savePublicDiagnostic(state: PublicDiagnosticState): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...state, updatedAt: new Date().toISOString() }),
  );
}

export function clearPublicDiagnostic(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getPublicDiagnosticShareUrl(): string {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return `${window.location.origin}${baseUrl}#/client-diagnostic`;
}
