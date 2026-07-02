import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const FUTURE_SECTIONS = [
  'Краткое резюме проекта',
  'Целевая аудитория',
  'ICP',
  'JTBD',
  'Боли, желания, страхи и возражения',
  'УТП',
  'Позиционирование',
  'Офферы',
  'Структура лендинга',
  'Рекомендации для рекламы',
  'Недостающая информация',
  'Следующие шаги',
];

export function AiAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <Layout showBack backTo={`/workspaces/${id}`} backLabel="Вернуться в проект">
      <div className="page container">
        <h1 className="page-title">AI-анализ проекта</h1>

        <Card>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            AI-анализ будет подключен на следующем этапе. Сейчас вы можете просмотреть ответы
            клиента и использовать их для подготовки стратегии, лендинга и рекламы.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            На следующем этапе ProjectMind будет автоматически анализировать ответы клиента и
            формировать стратегический отчёт.
          </p>
        </Card>

        <h2 style={{ fontSize: '1.0625rem', margin: '1.5rem 0 0.75rem' }}>Будущие разделы анализа</h2>
        <div className="ai-sections">
          {FUTURE_SECTIONS.map((section) => (
            <div key={section} className="ai-section-item">
              {section}
            </div>
          ))}
        </div>

        <div className="actions-row">
          <Button onClick={() => navigate(`/workspaces/${id}/answers`)}>
            Смотреть ответы клиента
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/workspaces/${id}`)}>
            Вернуться в проект
          </Button>
        </div>
      </div>
    </Layout>
  );
}
