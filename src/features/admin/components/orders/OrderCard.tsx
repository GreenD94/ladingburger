'use client';

import { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack, Chip, Divider, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { Order, OrderStatus, OrderStatusType, PaymentStatus } from '@/features/database/types';
import { OrderStatusLabels } from '@/features/database/types';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import NoteIcon from '@mui/icons-material/Note';
import PaymentIcon from '@mui/icons-material/Payment';
import { OrderTimer } from './OrderTimer';
import PaymentModal from './PaymentModal';
import { IssueModal } from './IssueModal';
import { ConfirmCompleteModal } from './ConfirmCompleteModal';
import { ConfirmNextStatusModal } from './ConfirmNextStatusModal';
import { CustomerInfo } from './CustomerInfo';
import { CustomerHistoryModal } from './CustomerHistoryModal';
import { OrderPriorityComponent } from './OrderPriority';
import { OrderNotes } from './OrderNotes';
import { WhatsAppActions } from './WhatsAppActions';
import { updateOrderPriority } from '@/features/database/actions/orders/updateOrderPriority';
import { updateOrderNotes } from '@/features/database/actions/orders/updateOrderNotes';

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
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const getPaymentStatusColor = (status: number) => {
    switch (status) {
      case PaymentStatus.PAID: return 'success.main';
      case PaymentStatus.PENDING: return 'warning.main';
      case PaymentStatus.FAILED: return 'error.main';
      case PaymentStatus.REFUNDED: return 'info.main';
      default: return 'text.secondary';
    }
  };

  const getPaymentStatusText = (status: number) => {
    switch (status) {
      case PaymentStatus.PAID: return 'Pagado';
      case PaymentStatus.PENDING: return 'Pendiente';
      case PaymentStatus.FAILED: return 'Fallido';
      case PaymentStatus.REFUNDED: return 'Reembolsado';
      default: return 'Desconocido';
    }
  };

  const getNextStatus = (currentStatus: OrderStatusType): OrderStatusType | null => {
    switch (currentStatus) {
      case OrderStatus.WAITING_PAYMENT: return OrderStatus.COOKING;
      case OrderStatus.COOKING: return OrderStatus.IN_TRANSIT;
      case OrderStatus.IN_TRANSIT: return OrderStatus.WAITING_PICKUP;
      case OrderStatus.WAITING_PICKUP: return OrderStatus.COMPLETED;
      default: return null;
    }
  };

  const getPreviousStatus = (currentStatus: OrderStatusType): OrderStatusType | null => {
    switch (currentStatus) {
      case OrderStatus.COOKING: return OrderStatus.WAITING_PAYMENT;
      case OrderStatus.IN_TRANSIT: return OrderStatus.COOKING;
      case OrderStatus.WAITING_PICKUP: return OrderStatus.IN_TRANSIT;
      case OrderStatus.COMPLETED: return OrderStatus.WAITING_PICKUP;
      default: return null;
    }
  };

  const handlePriorityChange = async (orderId: string, priority: 'normal' | 'high' | 'urgent') => {
    try {
      setUpdatingPriority(true);
      const result = await updateOrderPriority(orderId, priority);
      if (result.success) {
        onPaymentUpdate(); // Refresh orders
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
        onPaymentUpdate(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setUpdatingNotes(false);
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Customer Info Section */}
        <Box sx={{ mb: 2 }}>
          <CustomerInfo
            phoneNumber={order.customerPhone}
            customerName={order.customerName}
            onViewHistory={() => setHistoryModalOpen(true)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Order Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: isMobile ? 'wrap' : 'nowrap', gap: 2 }}>
          <Box>
            <Typography variant="h6">
              Orden #{order._id?.toString().slice(-6)}
            </Typography>
            <OrderTimer createdAt={order.createdAt} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <WhatsAppActions
              phoneNumber={order.customerPhone}
              orderId={order._id!.toString()}
              customerName={order.customerName}
              disabled={updatingStatus[order._id!.toString()]}
            />
          </Box>
        </Box>

        {/* Priority */}
        <Box sx={{ mb: 2 }}>
          <OrderPriorityComponent
            order={order}
            onPriorityChange={handlePriorityChange}
            updating={updatingPriority}
          />
        </Box>

        {(order.status === OrderStatus.ISSUE || order.status === OrderStatus.COMPLETED) && (
          <Box sx={{ 
            backgroundColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(239, 83, 80, 0.12)' 
              : 'rgba(244, 67, 54, 0.1)', 
            p: 2, 
            borderRadius: 1,
            mb: 2
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: (theme) => theme.palette.mode === 'dark' 
                  ? theme.palette.error.light 
                  : theme.palette.error.main, 
                fontWeight: 'bold' 
              }}
            >
              Problema reportado:
            </Typography>
            <Typography variant="body2" sx={{ color: '#f44336', mt: 1 }}>
              {order.logs
                .filter(log => log.status === OrderStatus.ISSUE)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.comment || 'No se proporcionó descripción del problema'}
            </Typography>
          </Box>
        )}

        {/* Order Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Fecha: {new Date(order.createdAt).toLocaleString()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <PaymentIcon sx={{ fontSize: '1rem', mr: 0.5, color: getPaymentStatusColor(order.paymentInfo.paymentStatus) }} />
            <Typography variant="subtitle2" sx={{ color: getPaymentStatusColor(order.paymentInfo.paymentStatus) }}>
              Pago: {getPaymentStatusText(order.paymentInfo.paymentStatus)}
            </Typography>
          </Box>
          {order.paymentInfo.bankAccount && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
              Cuenta: {order.paymentInfo.bankAccount}
            </Typography>
          )}
          {order.paymentInfo.transferReference && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
              Referencia: {order.paymentInfo.transferReference}
            </Typography>
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

        {/* Internal Notes */}
        <OrderNotes
          order={order}
          onNotesChange={handleNotesChange}
          updating={updatingNotes}
        />

        <Divider sx={{ my: 2 }} />

        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ flexWrap: 'wrap' }}>
          {order.status !== OrderStatus.COMPLETED && (
            <>
              {getPreviousStatus(order.status) && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => onStatusChange(order._id!.toString(), getPreviousStatus(order.status)!)}
                  disabled={updatingStatus[order._id!.toString()]}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 44 : 36 }}
                >
                  Estado Anterior
                </Button>
              )}
              
              {order.status === OrderStatus.WAITING_PAYMENT && order.paymentInfo.paymentStatus === PaymentStatus.PENDING ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setPaymentModalOpen(true)}
                  disabled={updatingStatus[order._id!.toString()]}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 44 : 36 }}
                >
                  Registrar Pago
                </Button>
              ) : getNextStatus(order.status) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setNextStatusModalOpen(true)}
                  disabled={updatingStatus[order._id!.toString()]}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 44 : 36 }}
                >
                  Siguiente Estado
                </Button>
              )}

              {order.status !== OrderStatus.ISSUE && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setIssueModalOpen(true)}
                  disabled={updatingStatus[order._id!.toString()]}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 44 : 36 }}
                >
                  Marcar Problema
                </Button>
              )}

              {(order.status === OrderStatus.COOKING || 
                order.status === OrderStatus.WAITING_PICKUP || 
                order.status === OrderStatus.ISSUE) && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setCompleteModalOpen(true)}
                  disabled={updatingStatus[order._id!.toString()]}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 44 : 36 }}
                >
                  Completado
                </Button>
              )}
            </>
          )}
        </Stack>
      </CardContent>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={order._id!.toString()}
        onSuccess={onPaymentUpdate}
      />

      <IssueModal
        open={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        orderId={order._id!.toString()}
        onSuccess={onPaymentUpdate}
      />

      <ConfirmCompleteModal
        open={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        orderId={order._id!.toString()}
        onSuccess={onPaymentUpdate}
      />

      <ConfirmNextStatusModal
        open={nextStatusModalOpen}
        onClose={() => setNextStatusModalOpen(false)}
        orderId={order._id!.toString()}
        currentStatus={order.status}
        nextStatus={getNextStatus(order.status)!}
        onConfirm={() => onStatusChange(order._id!.toString(), getNextStatus(order.status)!)}
      />

      <CustomerHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        phoneNumber={order.customerPhone}
        customerName={order.customerName}
        getBurgerName={getBurgerName}
      />
    </Card>
  );
} 