'use client';

import React from 'react';
import styles from '@/features/analytics/styles/charts/PlaceholderChart.module.css';

interface RevenueBySegmentChartProps {
  timeRange: number;
}

export default function RevenueBySegmentChart({ timeRange }: RevenueBySegmentChartProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={`material-symbols-outlined ${styles.icon}`}>bar_chart</span>
        <h3 className={styles.title}>Ingresos por Segmento</h3>
        <p className={styles.description}>
          Este gráfico mostrará el desglose de ingresos por segmento de cliente.
          Próximamente disponible.
        </p>
      </div>
    </div>
  );
}

