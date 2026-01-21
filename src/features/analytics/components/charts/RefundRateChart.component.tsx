'use client';

import React from 'react';
import styles from '@/features/analytics/styles/charts/PlaceholderChart.module.css';

interface RefundRateChartProps {
  timeRange: number;
}

export default function RefundRateChart({ timeRange }: RefundRateChartProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={`material-symbols-outlined ${styles.icon}`}>payments</span>
        <h3 className={styles.title}>Tasa de Reembolsos</h3>
        <p className={styles.description}>
          Este gráfico mostrará las tendencias de reembolsos a lo largo del tiempo.
          Próximamente disponible.
        </p>
      </div>
    </div>
  );
}

