'use client';

import { TimeRange } from '@/features/analytics/utils/dataAggregation.util';
import SalesChart from '@/features/analytics/components/SalesChart.component';
import TopSellingItems from '@/features/analytics/components/TopSellingItems.component';
import CustomerAnalytics from '@/features/analytics/components/CustomerAnalytics.component';
import PeakHoursChart from '@/features/analytics/components/PeakHoursChart.component';
import { Grid, Paper, Typography, Box } from '@mui/material';
import ErrorBoundary from '@/features/analytics/components/ErrorBoundary.component';

interface AnalyticsDashboardProps {
  timeRange: number;
  selectedDate: Date;
  aggregationRange: TimeRange;
}

export default function AnalyticsDashboard({
  timeRange,
  selectedDate,
  aggregationRange,
}: AnalyticsDashboardProps) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Gráfico de Ventas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Visualización de las ventas totales y número de pedidos
            </Typography>
          </Box>
          <ErrorBoundary>
            <SalesChart timeRange={timeRange} aggregationRange={aggregationRange} />
          </ErrorBoundary>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Análisis de Clientes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Métricas clave sobre el comportamiento de los clientes
            </Typography>
          </Box>
          <ErrorBoundary>
            <CustomerAnalytics timeRange={timeRange} />
          </ErrorBoundary>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Productos Más Vendidos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lista de los productos con mayor volumen de ventas
            </Typography>
          </Box>
          <ErrorBoundary>
            <TopSellingItems timeRange={timeRange} />
          </ErrorBoundary>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Horas Pico de Ventas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Distribución de pedidos por hora del día
            </Typography>
          </Box>
          <ErrorBoundary>
            <PeakHoursChart selectedDate={selectedDate} />
          </ErrorBoundary>
        </Paper>
      </Grid>
    </Grid>
  );
}

