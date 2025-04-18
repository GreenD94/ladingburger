'use client';

import { useEffect, useState } from 'react';
import { getTopSellingItemsAction } from '@/features/database/actions/analytics/getTopSellingItems';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import InfoModal from './InfoModal';

interface TopSellingItemsProps {
  timeRange: number;
}

export default function TopSellingItems({ timeRange }: TopSellingItemsProps) {
  const [data, setData] = useState<{ burgerId: string; name: string; quantity: number; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
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

  if (error) {
    return <ErrorState error={error} onRetry={fetchData} />;
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay datos de productos más vendidos disponibles para el período seleccionado
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Productos Más Vendidos
        </Typography>
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
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Ingresos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.burgerId}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">${item.revenue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
} 