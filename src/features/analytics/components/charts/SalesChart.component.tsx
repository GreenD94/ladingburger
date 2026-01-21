'use client';

import { useEffect, useState } from 'react';
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
import { getSalesDataAction } from '@/features/analytics/actions/getSalesData.action';
import { SalesData } from '@/features/database/models/analytics.model';
import { aggregateSalesData, TimeRange } from '@/features/analytics/utils/dataAggregation.util';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import InfoModal from '@/features/analytics/components/shared/InfoModal.component';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { getDefaultChartOptions } from '@/features/analytics/utils/chartConfig.util';
import styles from '@/features/analytics/styles/charts/Chart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  timeRange: number;
  aggregationRange: TimeRange;
}

export default function SalesChart({ timeRange, aggregationRange }: SalesChartProps) {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const response = await getSalesDataAction(timeRange);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch sales data');
      }
    } catch (err) {
      setError('An error occurred while fetching sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) {
    return <LoadingState title="Cargando datos de ventas..." />;
  }

  const hasError = error !== EMPTY_STRING;
  if (hasError) {
    return <ErrorState error={error} onRetry={fetchData} />;
  }

  const isEmpty = data.length === 0;
  if (isEmpty) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>
          No hay datos de ventas disponibles para el período seleccionado
        </p>
      </div>
    );
  }

  const aggregatedData = aggregateSalesData(data, aggregationRange);

  const chartData = {
    labels: aggregatedData.map(item => {
      const date = new Date(item.date);
      switch (aggregationRange) {
        case 'daily':
          return date.toLocaleDateString();
        case 'weekly':
          return `Semana del ${date.toLocaleDateString()}`;
        case 'monthly':
          return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        default:
          return date.toLocaleDateString();
      }
    }),
    datasets: [
      {
        label: 'Ingresos',
        data: aggregatedData.map(item => item.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Pedidos',
        data: aggregatedData.map(item => item.orders),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    ...getDefaultChartOptions({ title: 'Ventas Totales' }),
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monto ($)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Pedidos',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Tendencias de Ventas</h3>
        <InfoModal
          title="Tendencias de Ventas"
          description="Este gráfico muestra dos métricas clave de ventas a lo largo del tiempo: - Línea Verde (Ingresos): Muestra el monto total en dólares generado por las ventas en cada período. - Línea Azul (Pedidos): Representa el número total de pedidos realizados en cada período. Ambas líneas se muestran en el mismo gráfico para permitir una comparación visual entre el volumen de pedidos y los ingresos generados."
          goodScenario="Un buen escenario muestra: - Crecimiento consistente en ambas métricas (pedidos e ingresos) - Correlación positiva entre el número de pedidos y los ingresos - Picos predecibles en horarios de almuerzo y cena - Tasa de conversión estable (ingresos por pedido) - Variaciones estacionales esperadas"
          badScenario="Un mal escenario se caracteriza por: - Tendencia descendente en pedidos o ingresos - Discrepancia creciente entre pedidos e ingresos - Picos irregulares o ausentes en horarios de comida - Caídas significativas sin explicación aparente - Alta variabilidad en la tasa de conversión"
          formula="Cálculo de Métricas: - Pedidos por Período = Conteo de pedidos agrupados por período (día/semana/mes) - Ingresos por Período = Suma(totalPrice de todos los pedidos del período) - Tasa de Conversión = Ingresos Totales / Número Total de Pedidos"
          dataSources={[
            "Colección 'orders': Datos de pedidos",
            "Campos utilizados: createdAt, totalPrice, items",
            "Agregación por período seleccionado (diario/semanal/mensual)"
          ]}
        />
      </div>

      <div className={styles.chartWrapper}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

