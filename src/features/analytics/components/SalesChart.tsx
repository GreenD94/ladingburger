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
import { getSalesDataAction } from '@/features/database/actions/analytics/getSalesData';
import { SalesData } from '@/features/database/models/analytics.model';
import { aggregateSalesData, TimeRange } from '@/features/analytics/utils/dataAggregation';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { Box, Paper, Typography } from '@mui/material';
import InfoModal from './InfoModal';

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
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
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
    return <LoadingState title="Loading sales data..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchData} />;
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay datos de ventas disponibles para el período seleccionado
        </Typography>
      </Box>
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
          return `Week of ${date.toLocaleDateString()}`;
        case 'monthly':
          return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      }
    }),
    datasets: [
      {
        label: 'Revenue',
        data: aggregatedData.map(item => item.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: aggregatedData.map(item => item.orders),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ventas Totales',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monto ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Tendencias de Ventas
        </Typography>
        <InfoModal
          title="Tendencias de Ventas"
          description="Este gráfico muestra dos métricas clave de ventas a lo largo del tiempo:
          
          - Línea Azul (Pedidos): Representa el número total de pedidos realizados en cada período. Esta métrica ayuda a entender el volumen de transacciones y la actividad del negocio.
          
          - Línea Verde (Ingresos): Muestra el monto total en dólares generado por las ventas en cada período. Esta métrica refleja el desempeño financiero del negocio.
          
          Ambas líneas se muestran en el mismo gráfico para permitir una comparación visual entre el volumen de pedidos y los ingresos generados."
          goodScenario="Un buen escenario muestra:
          
          - Crecimiento consistente en ambas métricas (pedidos e ingresos)
          - Correlación positiva entre el número de pedidos y los ingresos
          - Picos predecibles en horarios de almuerzo y cena
          - Tasa de conversión estable (ingresos por pedido)
          - Variaciones estacionales esperadas"
          badScenario="Un mal escenario se caracteriza por:
          
          - Tendencia descendente en pedidos o ingresos
          - Discrepancia creciente entre pedidos e ingresos
          - Picos irregulares o ausentes en horarios de comida
          - Caídas significativas sin explicación aparente
          - Alta variabilidad en la tasa de conversión"
          formula="Cálculo de Métricas:
          
          - Pedidos por Período = Conteo de pedidos agrupados por período (día/semana/mes)
          - Ingresos por Período = Suma(totalPrice de todos los pedidos del período)
          - Tasa de Conversión = Ingresos Totales / Número Total de Pedidos"
          dataSources={[
            "Colección 'orders': Datos de pedidos",
            "Campos utilizados:",
            "  - createdAt: Para agrupación por período",
            "  - totalPrice: Para cálculo de ingresos",
            "  - items: Para conteo de pedidos",
            "Agregación por período seleccionado (diario/semanal/mensual)"
          ]}
        />
      </Box>

      <Box sx={{ height: 400 }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Paper>
  );
} 