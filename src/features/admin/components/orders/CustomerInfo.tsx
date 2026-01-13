'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCustomerAnalytics } from '@/features/admin/hooks/useCustomerAnalytics';

interface CustomerInfoProps {
  phoneNumber: string;
  customerName?: string;
  onViewHistory: () => void;
}

const getSegmentColor = (segment: 'new' | 'frequent' | 'vip') => {
  switch (segment) {
    case 'vip': return 'error';
    case 'frequent': return 'warning';
    case 'new': return 'info';
    default: return 'default';
  }
};

const getSegmentLabel = (segment: 'new' | 'frequent' | 'vip') => {
  switch (segment) {
    case 'vip': return 'VIP';
    case 'frequent': return 'Frecuente';
    case 'new': return 'Nuevo';
    default: return 'Cliente';
  }
};

export const CustomerInfo: React.FC<CustomerInfoProps> = ({
  phoneNumber,
  customerName,
  onViewHistory,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { stats, customerSegment, orderFrequency, loading } = useCustomerAnalytics(phoneNumber);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Cargando información del cliente...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" component="div">
                {customerName || 'Cliente'}
              </Typography>
              <Chip
                label={getSegmentLabel(customerSegment)}
                color={getSegmentColor(customerSegment)}
                size="small"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {phoneNumber}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton
              href={whatsappLink}
              target="_blank"
              sx={{
                bgcolor: '#25D366',
                color: 'white',
                '&:hover': { bgcolor: '#128C7E' },
                minWidth: isMobile ? 44 : 40,
                minHeight: isMobile ? 44 : 40,
              }}
            >
              <WhatsAppIcon />
            </IconButton>
            <IconButton
              onClick={onViewHistory}
              color="primary"
              sx={{ minWidth: isMobile ? 44 : 40, minHeight: isMobile ? 44 : 40 }}
            >
              <HistoryIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          {/* Statistics */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Estadísticas
            </Typography>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ShoppingCartIcon fontSize="small" color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Pedidos
                    </Typography>
                    <Typography variant="h6">{stats.totalOrders}</Typography>
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AttachMoneyIcon fontSize="small" color="success" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Valor Total
                    </Typography>
                    <Typography variant="h6">{formatCurrency(stats.lifetimeValue)}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Promedio por Pedido
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(stats.averageOrderValue)}
                </Typography>
              </Box>
              {orderFrequency > 0 && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Frecuencia
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {orderFrequency.toFixed(1)} pedidos/mes
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Dates */}
          {(stats.firstOrderDate || stats.lastOrderDate) && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Historial
                </Typography>
                <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mt: 1 }}>
                  {stats.firstOrderDate && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Primer Pedido
                      </Typography>
                      <Typography variant="body2">{formatDate(stats.firstOrderDate)}</Typography>
                    </Box>
                  )}
                  {stats.lastOrderDate && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Último Pedido
                      </Typography>
                      <Typography variant="body2">{formatDate(stats.lastOrderDate)}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

