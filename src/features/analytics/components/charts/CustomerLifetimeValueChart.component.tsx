'use client';

import React from 'react';
import styles from '@/features/analytics/styles/charts/PlaceholderChart.module.css';

interface CustomerLifetimeValueChartProps {
  timeRange: number;
}

export default function CustomerLifetimeValueChart({ timeRange }: CustomerLifetimeValueChartProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={`material-symbols-outlined ${styles.icon}`}>trending_up</span>
        <h3 className={styles.title}>Customer Lifetime Value</h3>
        <p className={styles.description}>
          Este gráfico mostrará la distribución y tendencias del valor de vida del cliente (CLV).
          Próximamente disponible.
        </p>
      </div>
    </div>
  );
}

