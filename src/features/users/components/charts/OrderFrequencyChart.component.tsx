'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getDefaultChartOptions } from '@/features/analytics/utils/chartConfig.util';
import { InfoModal } from '@/features/shared/components/InfoModal.component';
import styles from '@/features/users/styles/charts/Chart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OrderFrequencyChartProps {
  data: Array<{ month: string; count: number }>;
}

export function OrderFrequencyChart({ data }: OrderFrequencyChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={`material-symbols-outlined ${styles.emptyIcon}`}>bar_chart</span>
        <p className={styles.emptyText}>No hay datos de frecuencia disponibles</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Pedidos',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(19, 91, 236, 0.6)',
        borderColor: '#135bec',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = getDefaultChartOptions({
    title: 'Frecuencia de Pedidos',
    height: 300,
    showLegend: false,
  });

  chartOptions.scales = {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
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
        <h4 className={styles.chartTitle}>Frecuencia de Pedidos</h4>
        <InfoModal
          title="Frecuencia de Pedidos"
          description="Este gráfico muestra la cantidad de pedidos realizados por el cliente en cada mes. La frecuencia de pedidos es un indicador clave de la lealtad del cliente y su nivel de engagement con el negocio."
          goodScenario="Una frecuencia constante o creciente indica un cliente activo y comprometido. Múltiples pedidos por mes sugieren alta satisfacción."
          badScenario="Disminución en la frecuencia o meses sin pedidos pueden indicar pérdida de interés, problemas de servicio, o migración a la competencia."
          formula="Frecuencia Mensual = Número de pedidos completados en el mes"
          dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Campo: createdAt']}
        />
      </div>
      <div className={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

