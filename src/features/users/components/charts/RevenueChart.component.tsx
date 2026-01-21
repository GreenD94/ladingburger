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

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={`material-symbols-outlined ${styles.emptyIcon}`}>bar_chart</span>
        <p className={styles.emptyText}>No hay datos de ingresos disponibles</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Ingresos',
        data: data.map(item => item.revenue),
        borderColor: '#135bec',
        backgroundColor: 'rgba(19, 91, 236, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = getDefaultChartOptions({
    title: 'Ingresos por Mes',
    height: 300,
    showLegend: false,
  });

  chartOptions.scales = {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return `$${Number(value).toLocaleString()}`;
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
        <h4 className={styles.chartTitle}>Ingresos por Mes</h4>
        <InfoModal
          title="Ingresos por Mes"
          description="Este gráfico muestra los ingresos generados por el cliente a lo largo del tiempo, organizados por mes. Ayuda a identificar tendencias de crecimiento, patrones estacionales y períodos de mayor actividad comercial."
          goodScenario="Una tendencia ascendente constante indica un cliente valioso con crecimiento sostenido. Variaciones estacionales normales son esperadas."
          badScenario="Una tendencia descendente o períodos prolongados sin ingresos pueden indicar riesgo de pérdida del cliente o problemas de satisfacción."
          formula="Ingresos Mensuales = Suma de todos los totales de pedidos completados en el mes"
          dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Campo: totalPrice']}
        />
      </div>
      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

