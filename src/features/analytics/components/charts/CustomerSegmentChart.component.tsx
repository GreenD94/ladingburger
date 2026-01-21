'use client';

import React from 'react';
import styles from '@/features/analytics/styles/charts/PlaceholderChart.module.css';

interface CustomerSegmentChartProps {
  timeRange: number;
}

export default function CustomerSegmentChart({ timeRange }: CustomerSegmentChartProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={`material-symbols-outlined ${styles.icon}`}>pie_chart</span>
        <h3 className={styles.title}>Segmentación de Clientes</h3>
        <p className={styles.description}>
          Este gráfico mostrará la distribución de clientes por segmentos (Nuevo, Regular, VIP, En Riesgo).
          Próximamente disponible.
        </p>
      </div>
    </div>
  );
}

