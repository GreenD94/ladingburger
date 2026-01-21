'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getDefaultChartOptions } from '@/features/analytics/utils/chartConfig.util';
import { InfoModal } from '@/features/shared/components/InfoModal.component';
import styles from '@/features/users/styles/charts/Chart.module.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface OrderStatusChartProps {
  data: Array<{ status: number; count: number; label: string }>;
}

const STATUS_COLORS: Record<number, string> = {
  1: '#eab308',
  2: '#ef4444',
  3: '#3b82f6',
  4: '#10b981',
  5: '#6b7280',
  6: '#22c55e',
  7: '#f97316',
  8: '#6b7280',
  9: '#8b5cf6',
};

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={`material-symbols-outlined ${styles.emptyIcon}`}>pie_chart</span>
        <p className={styles.emptyText}>No hay datos de estado disponibles</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: data.map(item => STATUS_COLORS[item.status] || '#616f89'),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = getDefaultChartOptions({
    title: 'Distribución de Estados',
    height: 300,
    showLegend: true,
  });

  chartOptions.plugins = {
    ...chartOptions.plugins,
    legend: {
      ...chartOptions.plugins?.legend,
      position: 'bottom' as const,
    },
  };

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <h4 className={styles.chartTitle}>Distribución de Estados</h4>
        <InfoModal
          title="Distribución de Estados"
          description="Este gráfico muestra la distribución de todos los pedidos del cliente según su estado final. Ayuda a identificar patrones de problemas, éxito de pagos y tasas de cancelación."
          goodScenario="Una alta proporción de pedidos completados indica un cliente confiable con pocos problemas. Baja tasa de cancelaciones y reembolsos."
          badScenario="Alta proporción de cancelaciones, reembolsos o pagos fallidos puede indicar problemas de servicio, insatisfacción del cliente o problemas financieros."
          formula="Porcentaje por Estado = (Número de pedidos en estado X / Total de pedidos) × 100"
          dataSources={['Colección de pedidos', 'Campo: status']}
        />
      </div>
      <div className={styles.chartContainer}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

