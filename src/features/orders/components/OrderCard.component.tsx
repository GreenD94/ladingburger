'use client';

import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { Order, Burger, OrderStatus } from '@/features/database/types/index.type';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderCardProps {
  order: Order;
  orderNumber: number;
  burgers: Burger[];
}

const OrderCard: React.FC<OrderCardProps> = ({ order, orderNumber, burgers }) => {
  const theme = useTheme();

  const getBurgerName = (burgerId: string) => {
    const burger = burgers.find(b => b._id?.toString() === burgerId);
    return burger?.name || 'Hamburguesa no encontrada';
  };

  const getBurgerPrice = (burgerId: string) => {
    const burger = burgers.find(b => b._id?.toString() === burgerId);
    return burger?.price || 0;
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case OrderStatus.WAITING_PAYMENT: return '#FFB74D';
      case OrderStatus.PAYMENT_FAILED: return '#F44336';
      case OrderStatus.COOKING: return '#FF5722';
      case OrderStatus.IN_TRANSIT: return '#4CAF50';
      case OrderStatus.WAITING_PICKUP: return '#2196F3';
      case OrderStatus.COMPLETED: return '#4CAF50';
      case OrderStatus.ISSUE: return '#F44336';
      case OrderStatus.CANCELLED: return '#757575';
      case OrderStatus.REFUNDED: return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusName = (status: number) => {
    switch (status) {
      case OrderStatus.WAITING_PAYMENT: return 'Esperando Pago';
      case OrderStatus.PAYMENT_FAILED: return 'Pago Fallido';
      case OrderStatus.COOKING: return 'En Cocina';
      case OrderStatus.IN_TRANSIT: return 'En Camino';
      case OrderStatus.WAITING_PICKUP: return 'Esperando Recoger';
      case OrderStatus.COMPLETED: return 'Completado';
      case OrderStatus.ISSUE: return 'Con Problema';
      case OrderStatus.CANCELLED: return 'Cancelado';
      case OrderStatus.REFUNDED: return 'Reembolsado';
      default: return 'Desconocido';
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            {(order.logs || []).map((log, index) => (
              <React.Fragment key={index}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '120px',
                      height: '40px',
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(log.status),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      padding: '0 16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {getStatusName(log.status)}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      color: theme.palette.text.secondary,
                      textAlign: 'center',
                    }}
                  >
                    {format(new Date(log.createdAt), "d 'de' MMMM, h:mm a", { locale: es })}
                  </Typography>
                </Box>
                {index < (order.logs || []).length - 1 && (
                  <Box
                    sx={{
                      width: '40px',
                      height: '2px',
                      backgroundColor: theme.palette.divider,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        width: '10px',
                        height: '10px',
                        borderTop: `2px solid ${theme.palette.divider}`,
                        borderRight: `2px solid ${theme.palette.divider}`,
                        transform: 'translateY(-50%) rotate(45deg)',
                      },
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Pedido #{orderNumber}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            {format(new Date(order.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          {order.items.map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {getBurgerName(item.burgerId)}
                </Typography>
                {item.note && item.note !== '' && (
                  <Box
                    sx={{
                      backgroundColor: '#FFF3E0',
                      color: '#FF6F00',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      mt: 1,
                      ml: 2,
                      border: '1px solid #FFB74D',
                      boxShadow: '0 2px 4px rgba(255, 111, 0, 0.1)',
                    }}
                  >
                    📝 {item.note}
                  </Box>
                )}
                {item.removedIngredients.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, ml: 2 }}>
                    {item.removedIngredients.map((ingredient, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          backgroundColor: '#FFE0B2',
                          color: '#E65100',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          display: 'inline-flex',
                          alignItems: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        Sin {ingredient}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                }}
              >
                ${(getBurgerPrice(item.burgerId) * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
          pt: 2,
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Total
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            ${order.totalPrice.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default OrderCard;

