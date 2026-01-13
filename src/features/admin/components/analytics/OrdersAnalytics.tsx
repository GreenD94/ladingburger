'use client';

import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useOrdersAnalytics, OrdersAnalyticsData } from '@/features/admin/hooks/useOrdersAnalytics';
import { Order } from '@/features/database/types';
import { OrdersFiltersState } from '../orders/OrdersFilters';

interface OrdersAnalyticsProps {
  orders: Order[];
  filters?: OrdersFiltersState;
  getBurgerName: (burgerId: string) => string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const OrdersAnalytics: React.FC<OrdersAnalyticsProps> = ({
  orders,
  filters,
  getBurgerName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dateRange = filters?.dateRange
    ? {
        start: filters.dateRange.start,
        end: filters.dateRange.end,
      }
    : undefined;

  const analytics = useOrdersAnalytics(orders, dateRange);

  // Flatten all orders from all statuses
  const allOrders = Object.values(orders).flat();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Métricas de Pedidos
      </Typography>

      <Grid container spacing={2}>
        {/* Total Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  }}
                >
                  <ShoppingCartIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Pedidos
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {analytics.totalOrders}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'success.light',
                    color: 'success.contrastText',
                  }}
                >
                  <AttachMoneyIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ingresos Totales
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(analytics.totalRevenue)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Order Value */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'warning.light',
                    color: 'warning.contrastText',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Promedio por Pedido
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(analytics.averageOrderValue)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'info.light',
                    color: 'info.contrastText',
                  }}
                >
                  <PeopleIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Clientes
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {analytics.customerMetrics.totalCustomers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {analytics.customerMetrics.newCustomers} nuevos, {analytics.customerMetrics.returningCustomers} recurrentes
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        {analytics.topProducts.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Productos Más Vendidos
                </Typography>
                <Stack spacing={1}>
                  {analytics.topProducts.slice(0, 5).map((product, index) => (
                    <Box
                      key={product.burgerId}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {getBurgerName(product.burgerId)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.quantity} unidades
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {formatCurrency(product.revenue)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Orders by Hour */}
        {Object.keys(analytics.ordersByHour).length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pedidos por Hora
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <Stack spacing={1}>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const count = analytics.ordersByHour[hour] || 0;
                      const revenue = analytics.revenueByHour[hour] || 0;
                      if (count === 0) return null;
                      return (
                        <Box
                          key={hour}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'grey.50',
                          }}
                        >
                          <Typography variant="body2">
                            {hour.toString().padStart(2, '0')}:00
                          </Typography>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                              {count} pedidos
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(revenue)}
                            </Typography>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

