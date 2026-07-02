import type { Workspace } from '../types';

const STORAGE_KEY = 'projectmind_workspaces';

export function getWorkspaces(): Workspace[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Workspace[];
  } catch {
    return [];
  }
}

export function saveWorkspaces(workspaces: Workspace[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
}

export function getWorkspaceById(id: string): Workspace | undefined {
  return getWorkspaces().find((w) => w.id === id);
}

export function saveWorkspace(workspace: Workspace): void {
  const workspaces = getWorkspaces();
  const index = workspaces.findIndex((w) => w.id === workspace.id);
  if (index >= 0) {
    workspaces[index] = workspace;
  } else {
    workspaces.push(workspace);
  }
  saveWorkspaces(workspaces);
}

export function createWorkspaceId(): string {
  return `ws_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function deleteWorkspace(id: string): void {
  const workspaces = getWorkspaces().filter((w) => w.id !== id);
  saveWorkspaces(workspaces);
}

export function clearAllWorkspaces(): void {
  localStorage.removeItem(STORAGE_KEY);
}
