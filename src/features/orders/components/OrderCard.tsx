'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Divider,
  useTheme,
  Stack
} from '@mui/material';
import { Order, OrderStatusLabels, PaymentStatusLabels } from '@/features/database/types';
import { Burger } from '@/features/database/types';
import { motion } from 'framer-motion';

interface OrderCardProps {
  order: Order;
  orderNumber: number;
  burgers: Record<string, Burger>;
}

const getStatusColor = (status: number) => {
  switch (status) {
    case 1: return 'warning';
    case 2: return 'info';
    case 3: return 'primary';
    case 4: return 'secondary';
    case 5: return 'success';
    case 6: return 'error';
    default: return 'default';
  }
};

const getPaymentStatusColor = (status: number) => {
  switch (status) {
    case 1: return 'warning';
    case 2: return 'success';
    case 3: return 'error';
    case 4: return 'info';
    default: return 'default';
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, orderNumber, burgers }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease-in-out'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              Pedido #{orderNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              label={OrderStatusLabels[order.status]} 
              color={getStatusColor(order.status)}
              size="small"
            />
            <Chip 
              label={PaymentStatusLabels[order.paymentInfo.paymentStatus]} 
              color={getPaymentStatusColor(order.paymentInfo.paymentStatus)}
              size="small"
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            {order.items.map((item, index) => {
              const burger = burgers[item.burgerId];
              return (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {burger?.name || 'Burger no disponible'} x {item.quantity}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  
                  {item.note && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Nota: {item.note}
                    </Typography>
                  )}
                  
                  {item.removedIngredients.length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="error" sx={{ display: 'inline' }}>
                        Sin: 
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', ml: 0.5 }}>
                        {item.removedIngredients.join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${order.totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderCard; 