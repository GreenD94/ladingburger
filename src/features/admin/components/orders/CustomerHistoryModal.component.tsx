'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Order, OrderStatus, OrderStatusType, OrderStatusLabels } from '@/features/database/types/index.type';
import { useCustomerAnalytics } from '@/features/admin/hooks/useCustomerAnalytics.hook';
import { OrderTimer } from './OrderTimer.component';

interface CustomerHistoryModalProps {
  open: boolean;
  onClose: () => void;
  phoneNumber: string;
  customerName?: string;
  getBurgerName: (burgerId: string) => string;
}

const getStatusColor = (status: OrderStatusType) => {
  switch (status) {
    case OrderStatus.WAITING_PAYMENT: return '#FFB74D';
    case OrderStatus.COOKING: return '#FF5722';
    case OrderStatus.IN_TRANSIT: return '#4CAF50';
    case OrderStatus.WAITING_PICKUP: return '#2196F3';
    case OrderStatus.COMPLETED: return '#4CAF50';
    case OrderStatus.ISSUE: return '#F44336';
    default: return '#9E9E9E';
  }
};

export const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({
  open,
  onClose,
  phoneNumber,
  customerName,
  getBurgerName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { orders, stats, loading } = useCustomerAnalytics(phoneNumber);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              Historial de {customerName || 'Cliente'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {phoneNumber}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton
              href={whatsappLink}
              target="_blank"
              size="small"
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
              onClick={onClose}
              size="small"
              sx={{ minWidth: isMobile ? 44 : 40, minHeight: isMobile ? 44 : 40 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Cargando historial...</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Resumen
                </Typography>
                <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mt: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Pedidos
                    </Typography>
                    <Typography variant="h6">{stats.totalOrders}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Valor Total
                    </Typography>
                    <Typography variant="h6">{formatCurrency(stats.lifetimeValue)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Promedio
                    </Typography>
                    <Typography variant="h6">{formatCurrency(stats.averageOrderValue)}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Divider />

            {orders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No hay pedidos registrados para este cliente
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {orders.map((order) => (
                  <Card key={order._id?.toString()} variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack
                          direction={isMobile ? 'column' : 'row'}
                          justifyContent="space-between"
                          alignItems={isMobile ? 'flex-start' : 'center'}
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Pedido #{order._id?.toString().slice(-6)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(order.createdAt)}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={OrderStatusLabels[order.status]}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(order.status)}20`,
                                color: getStatusColor(order.status),
                                border: `1px solid ${getStatusColor(order.status)}`,
                              }}
                            />
                            <Typography variant="h6">
                              {formatCurrency(order.totalPrice)}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Divider />

                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Productos:
                          </Typography>
                          <Stack spacing={1}>
                            {order.items.map((item, index) => (
                              <Box key={index}>
                                <Typography variant="body2">
                                  {getBurgerName(item.burgerId)} x {item.quantity} - {formatCurrency(item.price * item.quantity)}
                                </Typography>
                                {item.removedIngredients.length > 0 && (
                                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                    Sin: {item.removedIngredients.join(', ')}
                                  </Typography>
                                )}
                                {item.note && (
                                  <Typography variant="caption" color="primary" sx={{ ml: 2, display: 'block' }}>
                                    Nota: {item.note}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Stack>
                        </Box>

                        <Box>
                          <OrderTimer createdAt={order.createdAt} />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          sx={{ minHeight: isMobile ? 44 : 36 }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

