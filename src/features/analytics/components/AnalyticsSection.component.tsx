'use client';

import React, { ReactNode } from 'react';
import styles from '@/features/analytics/styles/AnalyticsSection.module.css';

interface AnalyticsSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export function AnalyticsSection({ 
  children, 
  title, 
  description, 
  loading = false, 
  error = '', 
  onRetry 
}: AnalyticsSectionProps) {
  const hasError = error !== '';
  const hasContent = !loading && !hasError;

  return (
    <section className={styles.section}>
      {(title || description) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Cargando datos...</p>
        </div>
      )}

      {hasError && (
        <div className={styles.errorState}>
          <span className={`material-symbols-outlined ${styles.errorIcon}`}>error</span>
          <p className={styles.errorText}>{error}</p>
          {onRetry && (
            <button className={styles.retryButton} onClick={onRetry}>
              Reintentar
            </button>
          )}
        </div>
      )}

      {hasContent && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </section>
  );
}

