import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import cardStyles from '../components/Card.module.css';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { getWorkspaces, deleteWorkspace, clearAllWorkspaces } from '../utils/storage';
import { formatDate } from '../utils/progress';
import type { Workspace } from '../types';

export function WorkspacesPage() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const loadWorkspaces = () => setWorkspaces(getWorkspaces());

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleClearAll = () => {
    if (
      !window.confirm(
        'Вы точно хотите удалить все локальные проекты? Это действие нельзя отменить.',
      )
    ) {
      return;
    }
    clearAllWorkspaces();
    loadWorkspaces();
  };

  const handleDeleteOne = (id: string) => {
    if (!window.confirm('Удалить этот проект?')) {
      return;
    }
    deleteWorkspace(id);
    loadWorkspaces();
  };

  return (
    <Layout showBack backTo="/" backLabel="На главную">
      <div className="page container container--wide">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 className="page-title">Мои проекты</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              Все рабочие пространства клиентов
            </p>
          </div>
          <div className={cardStyles.headerActions}>
            <Button onClick={() => navigate('/workspaces/new')}>Создать рабочее пространство</Button>
            {workspaces.length > 0 && (
              <Button variant="ghost" onClick={handleClearAll}>
                Очистить тестовые данные
              </Button>
            )}
          </div>
        </div>

        {workspaces.length === 0 ? (
          <div className="empty-state">
            <h2 className="empty-state__title">Пока нет рабочих пространств</h2>
            <p className="empty-state__text">
              Создайте первый проект, чтобы начать диагностику клиента.
            </p>
            <Button onClick={() => navigate('/workspaces/new')}>Создать рабочее пространство</Button>
          </div>
        ) : (
          <div className="grid-cards">
            {workspaces.map((ws) => (
              <Card key={ws.id} hoverable onClick={() => navigate(`/workspaces/${ws.id}`)}>
                <h3 className={cardStyles.cardTitle}>{ws.title}</h3>
                <p className={cardStyles.cardMeta}>
                  {ws.clientName} · {ws.niche}
                </p>
                <StatusBadge status={ws.status} />
                <div style={{ marginTop: '0.75rem' }}>
                  <ProgressBar value={ws.diagnosticProgress} label="Диагностика" />
                </div>
                <div className={cardStyles.cardFooter}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    {formatDate(ws.createdAt)}
                  </span>
                  <div className={cardStyles.cardFooterActions}>
                    <button
                      type="button"
                      className={cardStyles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOne(ws.id);
                      }}
                    >
                      Удалить
                    </button>
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workspaces/${ws.id}`);
                      }}
                    >
                      Открыть
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
