import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

type LayoutProps = {
  children: React.ReactNode;
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
};

export function Layout({ children, showBack, backTo = '/', backLabel = 'На главную' }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>PM</span>
            <span className={styles.logoText}>ProjectMind</span>
          </Link>
          <nav className={styles.nav}>
            <Link to="/workspaces" className={styles.navLink}>
              Мои проекты
            </Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        {showBack && (
          <div className="container">
            <Link to={backTo} className={styles.backLink}>
              ← {backLabel}
            </Link>
          </div>
        )}
        {children}
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.footerText}>
            ProjectMind — система ведения клиентских проектов от диагностики до запуска
          </p>
        </div>
      </footer>
    </div>
  );
}
