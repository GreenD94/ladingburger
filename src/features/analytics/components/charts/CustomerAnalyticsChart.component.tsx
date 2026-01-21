'use client';

import { useEffect, useState } from 'react';
import { getCustomerAnalyticsAction } from '@/features/analytics/actions/getCustomerAnalytics.action';
import type { CustomerAnalytics as CustomerAnalyticsType } from '@/features/database/models/analytics.model';
import { EMPTY_CUSTOMER_ANALYTICS_TYPE } from '@/features/database/constants/emptyObjects.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import InfoModal from '@/features/analytics/components/shared/InfoModal.component';
import { MetricCard } from '@/features/analytics/components/metrics/MetricCard.component';
import { MetricGrid } from '@/features/analytics/components/metrics/MetricGrid.component';
import styles from '@/features/analytics/styles/charts/CustomerAnalyticsChart.module.css';

interface CustomerAnalyticsChartProps {
  timeRange: number;
}

export default function CustomerAnalyticsChart({ timeRange }: CustomerAnalyticsChartProps) {
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
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>
          No hay datos de clientes disponibles para el período seleccionado
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Análisis de Clientes</h3>
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
      </div>

      <MetricGrid columns={4}>
        <MetricCard
          title="Clientes Totales"
          value={data.totalCustomers}
          icon="people"
        />
        <MetricCard
          title="Nuevos Clientes"
          value={data.newCustomers}
          icon="person_add"
        />
        <MetricCard
          title="Clientes Recurrentes"
          value={data.returningCustomers}
          icon="repeat"
        />
        <MetricCard
          title="Frecuencia Promedio"
          value={data.averageOrderFrequency.toFixed(2)}
          subtitle="pedidos por cliente"
          icon="trending_up"
        />
      </MetricGrid>
    </div>
  );
}

