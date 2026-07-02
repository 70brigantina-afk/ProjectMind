import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { createWorkspaceId, saveWorkspace } from '../utils/storage';
import { MAIN_GOALS, PROJECT_FORMATS, type Workspace } from '../types';

export function CreateWorkspacePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [niche, setNiche] = useState('');
  const [projectFormat, setProjectFormat] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Укажите название проекта';
    if (!clientName.trim()) next.clientName = 'Укажите имя клиента';
    if (!niche.trim()) next.niche = 'Укажите нишу или сферу';
    if (!projectFormat) next.projectFormat = 'Выберите формат проекта';
    if (!mainGoal) next.mainGoal = 'Выберите главную задачу';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    const workspace: Workspace = {
      id: createWorkspaceId(),
      title: title.trim(),
      clientName: clientName.trim(),
      niche: niche.trim(),
      projectFormat,
      mainGoal,
      comment: comment.trim() || undefined,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      diagnosticProgress: 0,
      currentBlockIndex: 0,
      answers: [],
    };

    saveWorkspace(workspace);
    navigate(`/workspaces/${workspace.id}`);
  };

  return (
    <Layout showBack backTo="/workspaces" backLabel="К списку проектов">
      <div className="page container">
        <h1 className="page-title">Новое рабочее пространство</h1>
        <p className="page-subtitle">Заполните основную информацию о проекте клиента</p>

        <form onSubmit={handleSubmit} style={{ maxWidth: 560 }} dir="ltr">
          <div className="form-group">
            <label className="form-label form-label--required">Название проекта</label>
            <input
              className="form-input"
              dir="ltr"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Марина Дугина — бесплатная встреча"
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required">Имя клиента</label>
            <input
              className="form-input"
              dir="ltr"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Например: Марина Дугина"
            />
            {errors.clientName && <p className="form-error">{errors.clientName}</p>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required">Ниша / сфера</label>
            <input
              className="form-input"
              dir="ltr"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Например: психолог, коуч, стилист"
            />
            {errors.niche && <p className="form-error">{errors.niche}</p>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required">Формат проекта</label>
            <select
              className="form-select"
              dir="ltr"
              value={projectFormat}
              onChange={(e) => setProjectFormat(e.target.value)}
            >
              <option value="">Выберите формат</option>
              {PROJECT_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            {errors.projectFormat && <p className="form-error">{errors.projectFormat}</p>}
          </div>

          <div className="form-group">
            <label className="form-label form-label--required">Главная задача</label>
            <select
              className="form-select"
              dir="ltr"
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
            >
              <option value="">Выберите задачу</option>
              {MAIN_GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.mainGoal && <p className="form-error">{errors.mainGoal}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Комментарий</label>
            <textarea
              className="form-textarea"
              dir="ltr"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Любые дополнительные заметки о проекте"
              rows={3}
            />
          </div>

          <div className="actions-row">
            <Button type="submit">Создать проект</Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/workspaces')}>
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
