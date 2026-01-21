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

interface OrderTimeDistributionChartProps {
  dayData: Array<{ day: string; count: number }>;
  hourData: Array<{ hour: number; count: number }>;
}

export function OrderTimeDistributionChart({ dayData, hourData }: OrderTimeDistributionChartProps) {
  const hasDayData = dayData.length > 0;
  const hasHourData = hourData.length > 0;

  if (!hasDayData && !hasHourData) {
    return (
      <div className={styles.emptyState}>
        <span className={`material-symbols-outlined ${styles.emptyIcon}`}>schedule</span>
        <p className={styles.emptyText}>No hay datos de distribución temporal disponibles</p>
      </div>
    );
  }

  const dayChartData = {
    labels: dayData.map(item => item.day),
    datasets: [
      {
        label: 'Pedidos por Día',
        data: dayData.map(item => item.count),
        backgroundColor: 'rgba(19, 91, 236, 0.6)',
        borderColor: '#135bec',
        borderWidth: 1,
      },
    ],
  };

  const hourChartData = {
    labels: hourData.map(item => `${item.hour}:00`),
    datasets: [
      {
        label: 'Pedidos por Hora',
        data: hourData.map(item => item.count),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = getDefaultChartOptions({
    title: '',
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
  };

  return (
    <div className={styles.chartsGrid}>
      {hasDayData && (
        <div className={styles.chartWrapper}>
          <div className={styles.chartHeader}>
            <h4 className={styles.chartTitle}>Por Día de la Semana</h4>
            <InfoModal
              title="Distribución por Día de la Semana"
              description="Este gráfico muestra en qué días de la semana el cliente realiza más pedidos. Ayuda a identificar patrones de comportamiento y preferencias del cliente."
              goodScenario="Distribución equilibrada o concentrada en días de mayor actividad comercial indica un cliente con hábitos de compra consistentes."
              badScenario="Ausencia de pedidos en ciertos días puede indicar falta de disponibilidad o preferencias específicas que no se están satisfaciendo."
              formula="Pedidos por Día = Número de pedidos completados en ese día de la semana"
              dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Campo: createdAt (día de la semana)']}
            />
          </div>
          <div className={styles.chartContainer}>
            <Bar data={dayChartData} options={{ ...chartOptions, title: 'Pedidos por Día' }} />
          </div>
        </div>
      )}
      {hasHourData && (
        <div className={styles.chartWrapper}>
          <div className={styles.chartHeader}>
            <h4 className={styles.chartTitle}>Por Hora del Día</h4>
            <InfoModal
              title="Distribución por Hora del Día"
              description="Este gráfico muestra a qué horas del día el cliente realiza más pedidos. Ayuda a entender los patrones de consumo y optimizar estrategias de marketing y servicio."
              goodScenario="Concentración en horas pico indica un cliente que sigue patrones normales de consumo. Varias horas activas sugieren flexibilidad."
              badScenario="Ausencia de pedidos en horas normales puede indicar problemas de disponibilidad del servicio o preferencias no atendidas."
              formula="Pedidos por Hora = Número de pedidos completados en esa hora del día"
              dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Campo: createdAt (hora del día)']}
            />
          </div>
          <div className={styles.chartContainer}>
            <Bar data={hourChartData} options={{ ...chartOptions, title: 'Pedidos por Hora' }} />
          </div>
        </div>
      )}
    </div>
  );
}

