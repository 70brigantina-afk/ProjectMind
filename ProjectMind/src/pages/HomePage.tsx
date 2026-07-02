import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badge}>ProjectMind</div>
            <h1 className={styles.title}>ProjectMind</h1>
            <p className={styles.subtitle}>
              Рабочее пространство для проектов, где сначала появляется понимание, а потом — лендинг,
              реклама и запуск.
            </p>
            <p className={styles.description}>
              ProjectMind помогает собрать информацию о клиенте, провести диагностику проекта, увидеть
              цели, аудиторию, сильные стороны и подготовить основу для стратегии, сайта и рекламы.
            </p>
            <div className={styles.actions}>
              <Button onClick={() => navigate('/workspaces/new')}>
                Создать рабочее пространство
              </Button>
              <Button variant="outline" onClick={() => navigate('/workspaces')}>
                Мои проекты
              </Button>
              <Button variant="secondary" onClick={() => navigate('/client-diagnostic')}>
                Открыть публичную диагностику для клиента
              </Button>
            </div>
          </div>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>1</span>
              <div>
                <strong>Диагностика</strong>
                <p>Структурированный опросник вместо хаотичных интервью</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>2</span>
              <div>
                <strong>Понимание</strong>
                <p>Все ответы клиента в одном месте</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>3</span>
              <div>
                <strong>Стратегия</strong>
                <p>Основа для лендинга, оффера и рекламы</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container" style={{ textAlign: 'center', paddingBottom: '2rem' }}>
        <p style={{ marginBottom: '0.75rem' }}>
          <Link to="/client-diagnostic">Открыть публичную диагностику для клиента →</Link>
        </p>
        <Link to="/workspaces">Перейти к списку проектов →</Link>
      </div>
    </Layout>
  );
}
