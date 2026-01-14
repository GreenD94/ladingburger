'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { OrderStatus, OrderStatusLabels, OrderStatusType } from '@/features/database/types/index.type';

interface ConfirmNextStatusModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  currentStatus: OrderStatusType;
  nextStatus: OrderStatusType | undefined;
  onConfirm: () => void;
}

export function ConfirmNextStatusModal({ 
  open, 
  onClose, 
  orderId, 
  currentStatus, 
  nextStatus,
  onConfirm 
}: ConfirmNextStatusModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas cambiar el estado de la orden de "{OrderStatusLabels[currentStatus]}" a "{nextStatus ? OrderStatusLabels[nextStatus] : 'siguiente estado'}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

