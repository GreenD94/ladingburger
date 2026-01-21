'use client';

import { useEffect, useState } from 'react';
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
import { getPeakHoursAction } from '@/features/analytics/actions/getPeakHours.action';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import InfoModal from '@/features/analytics/components/shared/InfoModal.component';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { getDefaultChartOptions } from '@/features/analytics/utils/chartConfig.util';
import styles from '@/features/analytics/styles/charts/Chart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PeakHoursChartProps {
  selectedDate: Date;
}

export default function PeakHoursChart({ selectedDate }: PeakHoursChartProps) {
  const [peakHours, setPeakHours] = useState<{ hour: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const response = await getPeakHoursAction(selectedDate);
      if (response.success && response.data) {
        setPeakHours(response.data);
      } else {
        setError(response.error || 'Error al cargar los datos de horas pico');
      }
    } catch (err) {
      setError('Ocurrió un error al cargar los datos de horas pico');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  if (loading) {
    return <LoadingState title="Cargando datos de horas pico..." />;
  }

  const hasError = error !== EMPTY_STRING;
  if (hasError) {
    return <ErrorState error={error} onRetry={fetchData} />;
  }

  const isEmpty = peakHours.length === 0;
  if (isEmpty) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>
          No hay datos de pedidos disponibles para la fecha seleccionada
        </p>
      </div>
    );
  }

  const chartData = {
    labels: peakHours.map(hour => {
      const date = new Date();
      date.setHours(hour.hour);
      return date.toLocaleTimeString([], { hour: '2-digit', hour12: true });
    }),
    datasets: [
      {
        label: 'Número de Pedidos',
        data: peakHours.map(hour => hour.orders),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    ...getDefaultChartOptions({ title: 'Horas Pico de Ventas' }),
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Pedidos',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Hora del Día',
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Horas Pico de Ventas</h3>
        <InfoModal
          title="Horas Pico de Ventas"
          description="Este gráfico muestra la distribución de pedidos a lo largo del día, identificando las horas con mayor actividad. Ayuda a optimizar la planificación de personal y recursos para los períodos de mayor demanda."
          goodScenario="Un buen escenario muestra picos claros en horarios de almuerzo (12:00-14:00) y cena (19:00-21:00), con una distribución equilibrada de pedidos. La diferencia entre horas pico y valle no debería ser excesiva, indicando una demanda estable."
          badScenario="Un mal escenario muestra picos muy pronunciados con valles muy bajos, o una distribución irregular de pedidos sin patrones claros. También puede indicar problemas si las horas pico no coinciden con los horarios de comida tradicionales."
          formula="Pedidos por Hora = Conteo de pedidos agrupados por hora del día"
          dataSources={[
            "Colección 'orders': Datos de pedidos",
            "Campos utilizados: createdAt",
            "Agregación por hora del día"
          ]}
        />
      </div>

      <div className={styles.chartWrapper}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

