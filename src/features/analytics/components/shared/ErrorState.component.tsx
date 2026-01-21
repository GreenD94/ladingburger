'use client';

import React from 'react';
import styles from '@/features/analytics/styles/shared/ErrorState.module.css';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  height?: string;
}

export default function ErrorState({ error, onRetry, height = '400px' }: ErrorStateProps) {
  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.content}>
        <span className={`material-symbols-outlined ${styles.icon}`}>error</span>
        <p className={styles.text}>{error}</p>
        {onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

