'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getDefaultChartOptions } from '@/features/analytics/utils/chartConfig.util';
import { InfoModal } from '@/features/shared/components/InfoModal.component';
import styles from '@/features/users/styles/charts/Chart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AverageOrderValueChartProps {
  data: Array<{ month: string; value: number }>;
}

export function AverageOrderValueChart({ data }: AverageOrderValueChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={`material-symbols-outlined ${styles.emptyIcon}`}>trending_up</span>
        <p className={styles.emptyText}>No hay datos de ticket promedio disponibles</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Ticket Promedio',
        data: data.map(item => item.value),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = getDefaultChartOptions({
    title: 'Ticket Promedio por Mes',
    height: 300,
    showLegend: false,
  });

  chartOptions.scales = {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return `$${Number(value).toFixed(2)}`;
        },
      },
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      },
    },
  };

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <h4 className={styles.chartTitle}>Ticket Promedio por Mes</h4>
        <InfoModal
          title="Ticket Promedio por Mes"
          description="Este gráfico muestra el valor promedio de cada pedido del cliente por mes. El ticket promedio es un indicador importante del valor del cliente y su propensión a gastar."
          goodScenario="Un ticket promedio alto o en aumento indica que el cliente valora los productos y está dispuesto a gastar más. Esto sugiere oportunidades de upselling."
          badScenario="Un ticket promedio bajo o en disminución puede indicar que el cliente está reduciendo su gasto, posiblemente debido a problemas de precio o satisfacción."
          formula="Ticket Promedio Mensual = Suma de totales de pedidos del mes / Número de pedidos del mes"
          dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Campo: totalPrice']}
        />
      </div>
      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

