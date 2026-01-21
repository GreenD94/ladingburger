'use client';

import { useEffect, useState } from 'react';
import { getTopSellingItemsAction } from '@/features/analytics/actions/getTopSellingItems.action';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import InfoModal from '@/features/analytics/components/shared/InfoModal.component';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/analytics/styles/charts/TopSellingItemsChart.module.css';

interface TopSellingItemsChartProps {
  timeRange: number;
}

interface TopSellingItem {
  burgerId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export default function TopSellingItemsChart({ timeRange }: TopSellingItemsChartProps) {
  const [data, setData] = useState<TopSellingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const response = await getTopSellingItemsAction(timeRange);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Error al cargar los datos de productos más vendidos');
      }
    } catch (err) {
      setError('Ocurrió un error al cargar los datos de productos más vendidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) {
    return <LoadingState title="Cargando datos de productos más vendidos..." />;
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
          No hay datos de productos más vendidos disponibles para el período seleccionado
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Productos Más Vendidos</h3>
        <InfoModal
          title="Productos Más Vendidos"
          description="Esta tabla muestra los productos más vendidos en el período seleccionado, incluyendo la cantidad vendida y los ingresos generados por cada producto. Ayuda a identificar los productos más populares y su contribución a los ingresos."
          goodScenario="Un buen escenario muestra una distribución equilibrada de ventas entre diferentes productos, con un grupo de productos líderes que generan ingresos consistentes. Los productos premium deberían tener una buena participación en los ingresos totales."
          badScenario="Un mal escenario muestra una dependencia excesiva de uno o pocos productos, o productos de bajo margen dominando las ventas. También puede indicar problemas si los productos premium tienen baja participación en los ingresos."
          formula="Ingresos por Producto = Suma(quantity * price) para cada burgerId"
          dataSources={[
            "Colección 'orders': Datos de pedidos",
            "Colección 'menu_items': Datos de productos",
            "Campos utilizados: items.burgerId, items.quantity, items.price, name"
          ]}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableHeader}>Producto</th>
              <th className={`${styles.tableHeader} ${styles.tableHeaderRight}`}>Cantidad</th>
              <th className={`${styles.tableHeader} ${styles.tableHeaderRight}`}>Ingresos</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {data.map((item) => (
              <tr key={item.burgerId} className={styles.tableRow}>
                <td className={styles.tableCell}>{item.name}</td>
                <td className={`${styles.tableCell} ${styles.tableCellRight}`}>{item.quantity}</td>
                <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                  ${item.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

