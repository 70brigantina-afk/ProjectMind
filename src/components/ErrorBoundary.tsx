import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ProjectMind failed to load:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          <h1>ProjectMind</h1>
          <p>ProjectMind не смог загрузиться. Проверьте консоль браузера.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
