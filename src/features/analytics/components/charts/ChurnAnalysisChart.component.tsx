'use client';

import React from 'react';
import styles from '@/features/analytics/styles/charts/PlaceholderChart.module.css';

interface ChurnAnalysisChartProps {
  timeRange: number;
}

export default function ChurnAnalysisChart({ timeRange }: ChurnAnalysisChartProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={`material-symbols-outlined ${styles.icon}`}>trending_down</span>
        <h3 className={styles.title}>Análisis de Churn</h3>
        <p className={styles.description}>
          Este gráfico mostrará el análisis de churn, días desde el último pedido y clientes en riesgo.
          Próximamente disponible.
        </p>
      </div>
    </div>
  );
}

