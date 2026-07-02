import type { WorkspaceStatus } from '../types';
import { STATUS_LABELS } from '../types';
import styles from './StatusBadge.module.css';

type StatusBadgeProps = {
  status: WorkspaceStatus;
};

const STATUS_CLASS: Record<WorkspaceStatus, string> = {
  draft: styles.draft,
  diagnostic_started: styles.started,
  diagnostic_completed: styles.completed,
  ready_for_analysis: styles.ready,
  in_progress: styles.inProgress,
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${STATUS_CLASS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
