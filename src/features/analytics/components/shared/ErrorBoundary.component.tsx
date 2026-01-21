'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { EMPTY_ERROR } from '@/features/database/constants/emptyObjects.constants';
import styles from '@/features/analytics/styles/shared/ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: EMPTY_ERROR,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error || EMPTY_ERROR };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: EMPTY_ERROR });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container}>
          <span className={`material-symbols-outlined ${styles.icon}`}>error</span>
          <h3 className={styles.title}>Algo salió mal</h3>
          <p className={styles.message}>
            {this.state.error.message || 'Ocurrió un error inesperado'}
          </p>
          <button className={styles.retryButton} onClick={this.handleRetry}>
            Intentar de Nuevo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

