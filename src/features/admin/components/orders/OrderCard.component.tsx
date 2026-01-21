'use client';

import { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack, Chip, Divider, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { Order, OrderStatus, OrderStatusType, OrderStatusLabels } from '@/features/database/types/index.type';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import NoteIcon from '@mui/icons-material/Note';
import { OrderTimer } from './OrderTimer.component';
import PaymentModal from './PaymentModal.component';
import { IssueModal } from './IssueModal.component';
import { ConfirmCompleteModal } from './ConfirmCompleteModal.component';
import { ConfirmNextStatusModal } from './ConfirmNextStatusModal.component';
import { CancelOrderModal } from './CancelOrderModal.component';
import { CustomerInfo } from './CustomerInfo.component';
import { CustomerHistoryModal } from './CustomerHistoryModal.component';
import { OrderPriorityComponent } from './OrderPriority.component';
import { OrderNotes } from './OrderNotes.component';
import { WhatsAppActions } from './WhatsAppActions.component';
import { updateOrderPriority } from '@/features/orders/actions/updateOrderPriority.action';
import { updateOrderNotes } from '@/features/orders/actions/updateOrderNotes.action';
import { getValidNextStatuses } from '@/features/orders/utils/validateStatusTransition.util';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatusType) => Promise<void>;
  updatingStatus: Record<string, boolean>;
  getBurgerName: (burgerId: string) => string;
  onPaymentUpdate: () => void;
}

export function OrderCard({ order, onStatusChange, updatingStatus, getBurgerName, onPaymentUpdate }: OrderCardProps) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [nextStatusModalOpen, setNextStatusModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status: OrderStatusType) => {
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

  const validNextStatuses = getValidNextStatuses(order.status);
  const nextStatus = validNextStatuses.find(s => {
    if (order.status === OrderStatus.WAITING_PAYMENT || order.status === OrderStatus.PAYMENT_FAILED) return s === OrderStatus.COOKING;
    if (order.status === OrderStatus.COOKING) return s === OrderStatus.IN_TRANSIT;
    if (order.status === OrderStatus.IN_TRANSIT) return s === OrderStatus.WAITING_PICKUP;
    if (order.status === OrderStatus.WAITING_PICKUP) return s === OrderStatus.COMPLETED;
    return false;
  });

  const previousStatus = validNextStatuses.find(s => {
    if (order.status === OrderStatus.COOKING) return s === OrderStatus.WAITING_PAYMENT;
    if (order.status === OrderStatus.IN_TRANSIT) return s === OrderStatus.COOKING;
    if (order.status === OrderStatus.WAITING_PICKUP) return s === OrderStatus.IN_TRANSIT;
    return false;
  });

  const handlePriorityChange = async (orderId: string, priority: 'normal' | 'high' | 'urgent') => {
    try {
      setUpdatingPriority(true);
      const result = await updateOrderPriority(orderId, priority);
      if (result.success) {
        onPaymentUpdate();
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    } finally {
      setUpdatingPriority(false);
    }
  };

  const handleNotesChange = async (orderId: string, notes: string) => {
    try {
      setUpdatingNotes(true);
      const result = await updateOrderNotes(orderId, notes);
      if (result.success) {
        onPaymentUpdate();
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setUpdatingNotes(false);
    }
  };

  const orderId = order._id?.toString() || '';
  const displayOrderNumber = order.orderNumber || orderId.slice(-6);
  const isCancelled = order.status === OrderStatus.CANCELLED;
  const isCompleted = order.status === OrderStatus.COMPLETED;
  const isRefunded = order.status === OrderStatus.REFUNDED;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ mb: 2 }}>
          <CustomerInfo
            phoneNumber={order.customerPhone}
            customerName={order.customerName}
            onViewHistory={() => setHistoryModalOpen(true)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : 'auto' }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Pedido #{displayOrderNumber}
            </Typography>
            <OrderTimer createdAt={order.createdAt} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <WhatsAppActions
              phoneNumber={order.customerPhone}
              orderId={orderId}
              customerName={order.customerName}
              disabled={updatingStatus[orderId] || isCancelled}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <OrderPriorityComponent
            order={order}
            onPriorityChange={handlePriorityChange}
            updating={updatingPriority}
          />
        </Box>

        {order.status === OrderStatus.PAYMENT_FAILED && (
          <Box sx={{ 
            backgroundColor: 'rgba(244, 67, 54, 0.1)', 
            p: 2, 
            borderRadius: 1,
            mb: 2,
            border: '1px solid rgba(244, 67, 54, 0.3)'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#f44336', 
                fontWeight: 'bold',
                mb: 1
              }}
            >
              Pago Fallido
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              El pago no pudo ser procesado. Puedes reintentar el pago o cancelar el pedido.
            </Typography>
          </Box>
        )}

        {order.status === OrderStatus.REFUNDED && (
          <Box sx={{ 
            backgroundColor: 'rgba(158, 158, 158, 0.1)', 
            p: 2, 
            borderRadius: 1,
            mb: 2,
            border: '1px solid rgba(158, 158, 158, 0.3)'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#9E9E9E', 
                fontWeight: 'bold',
                mb: 1
              }}
            >
              Pedido Reembolsado
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              El pago de este pedido ha sido reembolsado.
            </Typography>
          </Box>
        )}

        {isCancelled && (
          <Box sx={{ 
            backgroundColor: 'rgba(117, 117, 117, 0.1)', 
            p: 2, 
            borderRadius: 1,
            mb: 2,
            border: '1px solid rgba(117, 117, 117, 0.3)'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#757575', 
                fontWeight: 'bold',
                mb: 1
              }}
            >
              Pedido Cancelado
            </Typography>
            {order.cancellationReason && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Razón: {order.cancellationReason}
              </Typography>
            )}
            {order.cancelledAt && (
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                Cancelado el: {new Date(order.cancelledAt).toLocaleString()}
              </Typography>
            )}
          </Box>
        )}

        {(order.status === OrderStatus.ISSUE) && (
          <Box sx={{ 
            backgroundColor: 'rgba(244, 67, 54, 0.1)', 
            p: 2, 
            borderRadius: 1,
            mb: 2,
            border: '1px solid rgba(244, 67, 54, 0.3)'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#f44336', 
                fontWeight: 'bold',
                mb: 1
              }}
            >
              Problema reportado:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {order.logs
                ?.filter(log => log.status === OrderStatus.ISSUE)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.comment || 'No se proporcionó descripción del problema'}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Fecha: {new Date(order.createdAt).toLocaleString()}
          </Typography>
          {(order.paymentInfo.bankAccount || order.paymentInfo.transferReference) && (
            <Box sx={{ mt: 1 }}>
              {order.paymentInfo.bankAccount && (
                <Typography variant="subtitle2" color="text.secondary">
                  Cuenta: {order.paymentInfo.bankAccount}
                </Typography>
              )}
              {order.paymentInfo.transferReference && (
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Referencia: {order.paymentInfo.transferReference}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Productos:
          </Typography>
          {order.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {getBurgerName(item.burgerId)} x {item.quantity}
                </Typography>
                <Typography>
                  ${(item.price * item.quantity).toLocaleString()}
                </Typography>
              </Box>
              
              {item.removedIngredients.length > 0 && (
                <List dense sx={{ pl: 2, py: 0 }}>
                  <ListItem sx={{ py: 0 }}>
                    <DoNotDisturbIcon sx={{ color: 'error.main', mr: 1, fontSize: '1rem' }} />
                    <ListItemText 
                      primary="Ingredientes eliminados:"
                      secondary={item.removedIngredients.join(', ')}
                      secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                </List>
              )}

              {item.note && (
                <List dense sx={{ pl: 2, py: 0 }}>
                  <ListItem sx={{ py: 0 }}>
                    <NoteIcon sx={{ color: 'info.main', mr: 1, fontSize: '1rem' }} />
                    <ListItemText 
                      primary="Nota:"
                      secondary={item.note}
                      secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                </List>
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ textAlign: 'right' }}>
            Total: ${order.totalPrice.toLocaleString()}
          </Typography>
        </Box>

        <OrderNotes
          order={order}
          onNotesChange={handleNotesChange}
          updating={updatingNotes}
        />

        <Divider sx={{ my: 2 }} />

        {!isCancelled && !isCompleted && !isRefunded && (
          <Stack direction="column" spacing={1.5} sx={{ mt: 2 }}>
            {(order.status === OrderStatus.WAITING_PAYMENT || order.status === OrderStatus.PAYMENT_FAILED) && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setPaymentModalOpen(true)}
                disabled={updatingStatus[orderId]}
                fullWidth
                sx={{ 
                  minHeight: 48,
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                {order.status === OrderStatus.PAYMENT_FAILED ? 'Reintentar Pago' : 'Registrar Pago'}
              </Button>
            )}

            {nextStatus && order.status !== OrderStatus.WAITING_PAYMENT && order.status !== OrderStatus.PAYMENT_FAILED && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setNextStatusModalOpen(true)}
                disabled={updatingStatus[orderId]}
                fullWidth
                sx={{ 
                  minHeight: 48,
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                Siguiente Estado
              </Button>
            )}

            {(order.status === OrderStatus.COOKING || 
              order.status === OrderStatus.WAITING_PICKUP || 
              order.status === OrderStatus.ISSUE) && (
              <Button
                variant="contained"
                color="success"
                onClick={() => setCompleteModalOpen(true)}
                disabled={updatingStatus[orderId]}
                fullWidth
                sx={{ 
                  minHeight: 48,
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                Completar Pedido
              </Button>
            )}

            <Stack direction="row" spacing={1}>
              {previousStatus && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => onStatusChange(orderId, previousStatus)}
                  disabled={updatingStatus[orderId]}
                  fullWidth
                  sx={{ 
                    minHeight: 48,
                    fontSize: '0.9rem',
                    py: 1.5
                  }}
                >
                  Estado Anterior
                </Button>
              )}

              {order.status !== OrderStatus.ISSUE && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setIssueModalOpen(true)}
                  disabled={updatingStatus[orderId]}
                  fullWidth
                  sx={{ 
                    minHeight: 48,
                    fontSize: '0.9rem',
                    py: 1.5
                  }}
                >
                  Problema
                </Button>
              )}

              {validNextStatuses.includes(OrderStatus.CANCELLED) && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setCancelModalOpen(true)}
                  disabled={updatingStatus[orderId]}
                  fullWidth
                  sx={{ 
                    minHeight: 48,
                    fontSize: '0.9rem',
                    py: 1.5,
                    borderColor: '#757575',
                    color: '#757575',
                    '&:hover': {
                      borderColor: '#424242',
                      backgroundColor: 'rgba(117, 117, 117, 0.04)'
                    }
                  }}
                >
                  Cancelar
                </Button>
              )}
            </Stack>
          </Stack>
        )}
      </CardContent>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={orderId}
        onSuccess={onPaymentUpdate}
      />

      <IssueModal
        open={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        orderId={orderId}
        onSuccess={onPaymentUpdate}
      />

      <ConfirmCompleteModal
        open={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        orderId={orderId}
        onSuccess={onPaymentUpdate}
      />

      {nextStatus && (
        <ConfirmNextStatusModal
          open={nextStatusModalOpen}
          onClose={() => setNextStatusModalOpen(false)}
          orderId={orderId}
          currentStatus={order.status}
          nextStatus={nextStatus}
          onConfirm={() => onStatusChange(orderId, nextStatus)}
        />
      )}

      <CustomerHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        phoneNumber={order.customerPhone}
        customerName={order.customerName}
        getBurgerName={getBurgerName}
      />

      <CancelOrderModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        orderId={orderId}
        orderNumber={order.orderNumber}
        onSuccess={onPaymentUpdate}
      />
    </Card>
  );
}

