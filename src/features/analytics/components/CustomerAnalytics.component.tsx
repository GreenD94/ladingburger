'use client';

import { useEffect, useState } from 'react';
import { getCustomerAnalyticsAction } from '@/features/analytics/actions/getCustomerAnalytics.action';
import type { CustomerAnalytics as CustomerAnalyticsType } from '@/features/database/models/analytics.model';
import { EMPTY_CUSTOMER_ANALYTICS_TYPE } from '@/features/database/constants/emptyObjects.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { Box, Grid, Typography, Paper } from '@mui/material';
import LoadingState from './LoadingState.component';
import ErrorState from './ErrorState.component';
import InfoModal from './InfoModal.component';

interface CustomerAnalyticsProps {
  timeRange: number;
}

export default function CustomerAnalytics({ timeRange }: CustomerAnalyticsProps) {
  const [data, setData] = useState<CustomerAnalyticsType>(EMPTY_CUSTOMER_ANALYTICS_TYPE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const response = await getCustomerAnalyticsAction(timeRange);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Error al cargar los datos de clientes');
      }
    } catch (err) {
      setError('Ocurrió un error al cargar los datos de clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) {
    return <LoadingState title="Cargando datos de clientes..." />;
  }

  if (error !== EMPTY_STRING) {
    return <ErrorState error={error} onRetry={fetchData} />;
  }

  const hasData = data.totalCustomers > 0 || data.newCustomers > 0 || data.returningCustomers > 0;
  if (!hasData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay datos de clientes disponibles para el período seleccionado
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Análisis de Clientes
        </Typography>
        <InfoModal
          title="Análisis de Clientes"
          description="Este panel muestra métricas clave sobre el comportamiento de los clientes, incluyendo el total de clientes, nuevos clientes, clientes recurrentes y la frecuencia promedio de pedidos. Estas métricas ayudan a entender la salud del negocio en términos de adquisición y retención de clientes."
          goodScenario="Un buen escenario muestra un crecimiento constante en el número total de clientes, con una proporción saludable de nuevos clientes (30-40%) y clientes recurrentes (60-70%). La frecuencia promedio de pedidos debería estar entre 2-3 pedidos por cliente en el período seleccionado."
          badScenario="Un mal escenario se caracteriza por un estancamiento o disminución en el número total de clientes, una alta proporción de nuevos clientes (más del 50%) que indica poca retención, o una frecuencia promedio de pedidos menor a 1.5 por cliente."
          formula="Frecuencia Promedio = Total de Pedidos / Total de Clientes Únicos"
          dataSources={[
            "Colección 'orders': Datos de pedidos y clientes",
            "Campos utilizados: customerPhone, createdAt, totalPrice"
          ]}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Clientes Totales
              </Typography>
              <InfoModal
                title="Clientes Totales"
                description="El número total de clientes únicos que han realizado al menos un pedido en el período seleccionado."
                goodScenario="Un buen escenario muestra un crecimiento constante en el número total de clientes, indicando una base de clientes en expansión."
                badScenario="Un mal escenario muestra un estancamiento o disminución en el número total de clientes, lo que puede indicar problemas en la adquisición o retención de clientes."
                formula="Total de Clientes = Nuevos Clientes + Clientes Recurrentes"
                dataSources={[
                  "Colección 'orders': Agregación por customerPhone",
                  "Filtrado por createdAt dentro del período seleccionado"
                ]}
              />
            </Box>
            <Typography variant="h4">
              {data.totalCustomers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nuevos Clientes
              </Typography>
              <InfoModal
                title="Nuevos Clientes"
                description="El número de clientes que realizaron su primer pedido en el período seleccionado."
                goodScenario="Un buen escenario muestra un flujo constante de nuevos clientes, representando entre el 30-40% del total de clientes."
                badScenario="Un mal escenario muestra una proporción muy alta de nuevos clientes (más del 50%) o un número muy bajo, lo que indica problemas en la adquisición de clientes."
                formula="Nuevos Clientes = Clientes con primer pedido en el período"
                dataSources={[
                  "Colección 'orders': Agregación por customerPhone",
                  "Filtrado por primera aparición de customerPhone en el período"
                ]}
              />
            </Box>
            <Typography variant="h4">
              {data.newCustomers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Clientes Recurrentes
              </Typography>
              <InfoModal
                title="Clientes Recurrentes"
                description="El número de clientes que han realizado más de un pedido en el período seleccionado."
                goodScenario="Un buen escenario muestra una proporción alta de clientes recurrentes (60-70% del total), indicando una buena retención de clientes."
                badScenario="Un mal escenario muestra una proporción baja de clientes recurrentes (menos del 40%), lo que indica problemas en la retención de clientes."
                formula="Clientes Recurrentes = Total de Clientes - Nuevos Clientes"
                dataSources={[
                  "Colección 'orders': Agregación por customerPhone",
                  "Filtrado por múltiples pedidos del mismo customerPhone en el período"
                ]}
              />
            </Box>
            <Typography variant="h4">
              {data.returningCustomers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Frecuencia Promedio de Pedidos
              </Typography>
              <InfoModal
                title="Frecuencia Promedio de Pedidos"
                description="El número promedio de pedidos por cliente en el período seleccionado."
                goodScenario="Un buen escenario muestra una frecuencia promedio entre 2-3 pedidos por cliente, indicando una buena fidelización."
                badScenario="Un mal escenario muestra una frecuencia promedio menor a 1.5 pedidos por cliente, lo que indica baja fidelización."
                formula="Frecuencia Promedio = Total de Pedidos / Total de Clientes Únicos"
                dataSources={[
                  "Colección 'orders': Conteo de pedidos por customerPhone",
                  "Promedio calculado sobre todos los clientes únicos"
                ]}
              />
            </Box>
            <Typography variant="h4">
              {data.averageOrderFrequency.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

