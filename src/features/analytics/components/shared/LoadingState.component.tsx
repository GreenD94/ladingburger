'use client';

import React from 'react';
import styles from '@/features/analytics/styles/shared/LoadingState.module.css';

interface LoadingStateProps {
  title?: string;
  height?: string;
}

export default function LoadingState({ title = 'Loading...', height = '400px' }: LoadingStateProps) {
  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.content}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>{title}</p>
      </div>
    </div>
  );
}

