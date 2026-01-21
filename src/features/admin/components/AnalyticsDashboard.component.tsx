'use client';

import { TimeRange } from '@/features/analytics/utils/dataAggregation.util';
import { AnalyticsCategoryId } from '@/features/analytics/constants/analyticsCategories.constants';
import SalesChart from '@/features/analytics/components/charts/SalesChart.component';
import TopSellingItemsChart from '@/features/analytics/components/charts/TopSellingItemsChart.component';
import CustomerAnalyticsChart from '@/features/analytics/components/charts/CustomerAnalyticsChart.component';
import PeakHoursChart from '@/features/analytics/components/charts/PeakHoursChart.component';
import CustomerLifetimeValueChart from '@/features/analytics/components/charts/CustomerLifetimeValueChart.component';
import CustomerSegmentChart from '@/features/analytics/components/charts/CustomerSegmentChart.component';
import RevenueBySegmentChart from '@/features/analytics/components/charts/RevenueBySegmentChart.component';
import ChurnAnalysisChart from '@/features/analytics/components/charts/ChurnAnalysisChart.component';
import RefundRateChart from '@/features/analytics/components/charts/RefundRateChart.component';
import { AnalyticsSection } from '@/features/analytics/components/AnalyticsSection.component';
import ErrorBoundary from '@/features/analytics/components/shared/ErrorBoundary.component';
import styles from '@/features/admin/styles/AnalyticsDashboard.module.css';

interface AnalyticsDashboardProps {
  timeRange: number;
  selectedDate: Date;
  aggregationRange: TimeRange;
  selectedCategory: AnalyticsCategoryId;
}

export default function AnalyticsDashboard({
  timeRange,
  selectedDate,
  aggregationRange,
  selectedCategory,
}: AnalyticsDashboardProps) {
  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'customer':
        return (
          <>
            <AnalyticsSection
              title="Métricas de Clientes"
              description="Análisis del comportamiento y segmentación de clientes"
            >
              <ErrorBoundary>
                <CustomerAnalyticsChart timeRange={timeRange} />
              </ErrorBoundary>
            </AnalyticsSection>
            <AnalyticsSection
              title="Segmentación de Clientes"
              description="Distribución de clientes por segmentos"
            >
              <ErrorBoundary>
                <CustomerSegmentChart timeRange={timeRange} />
              </ErrorBoundary>
            </AnalyticsSection>
            <AnalyticsSection
              title="Valor de Vida del Cliente"
              description="Distribución y tendencias del CLV"
            >
              <ErrorBoundary>
                <CustomerLifetimeValueChart timeRange={timeRange} />
              </ErrorBoundary>
            </AnalyticsSection>
            <AnalyticsSection
              title="Análisis de Churn"
              description="Clientes en riesgo y días desde último pedido"
            >
              <ErrorBoundary>
                <ChurnAnalysisChart timeRange={timeRange} />
              </ErrorBoundary>
            </AnalyticsSection>
          </>
        );

      case 'financial':
        return (
          <>
            <AnalyticsSection
              title="Tendencias de Ventas"
              description="Análisis de ingresos y número de pedidos"
            >
              <ErrorBoundary>
                <SalesChart timeRange={timeRange} aggregationRange={aggregationRange} />
              </ErrorBoundary>
            </AnalyticsSection>
            <AnalyticsSection
              title="Ingresos por Segmento"
              description="Desglose de ingresos por segmento de cliente"
            >
              <ErrorBoundary>
                <RevenueBySegmentChart timeRange={timeRange} />
              </ErrorBoundary>
            </AnalyticsSection>
          </>
        );

      case 'risk':
        return (
          <>
            <AnalyticsSection
              title="Tasa de Reembolsos"
              description="Tendencias de reembolsos a lo largo del tiempo"
            >
              <ErrorBoundary>
                <RefundRateChart timeRange={timeRange} />
              </ErrorBoundary>
            </AnalyticsSection>
            <AnalyticsSection
              title="Análisis de Churn"
              description="Clientes en riesgo y días desde último pedido"
            >
              <ErrorBoundary>
                <ChurnAnalysisChart timeRange={timeRange} />
              </ErrorBoundary>
            </AnalyticsSection>
          </>
        );

      case 'product':
        return (
          <>
            <AnalyticsSection
              title="Análisis de Productos"
              description="Productos más vendidos y rendimiento por producto"
            >
              <ErrorBoundary>
                <TopSellingItemsChart timeRange={timeRange} />
              </ErrorBoundary>
            </AnalyticsSection>
          </>
        );

      case 'operational':
        return (
          <>
            <AnalyticsSection
              title="Métricas Operacionales"
              description="Horas pico, tiempos de pedido y eficiencia operativa"
            >
              <ErrorBoundary>
                <PeakHoursChart selectedDate={selectedDate} />
              </ErrorBoundary>
            </AnalyticsSection>
          </>
        );

      default:
        return (
          <AnalyticsSection>
            <div className={styles.comingSoon}>
              <p className={styles.comingSoonText}>Categoría no encontrada</p>
            </div>
          </AnalyticsSection>
        );
    }
  };

  return (
    <div className={styles.dashboard}>
      {renderCategoryContent()}
    </div>
  );
}
