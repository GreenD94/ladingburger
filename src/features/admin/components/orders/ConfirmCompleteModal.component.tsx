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
import { updateOrderStatus } from '@/features/orders/actions/updateOrderStatus.action';
import { OrderStatus } from '@/features/database/types/index.type';

interface ConfirmCompleteModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export function ConfirmCompleteModal({ open, onClose, orderId, onSuccess }: ConfirmCompleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, OrderStatus.COMPLETED);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmar Completado</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas marcar esta orden como completada?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="success"
          disabled={loading}
        >
          {loading ? 'Completando...' : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

