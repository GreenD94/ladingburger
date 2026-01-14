'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { updateOrderStatus } from '@/features/orders/actions/updateOrderStatus.action';
import { OrderStatus } from '@/features/database/types/index.type';

interface IssueModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export function IssueModal({ open, onClose, orderId, onSuccess }: IssueModalProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, OrderStatus.ISSUE, comment);
      onSuccess();
      onClose();
      setComment('');
    } catch (error) {
      console.error('Error marking order as issue:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reportar Problema</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descripción del problema"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe el problema que ha ocurrido con esta orden..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="error"
          disabled={loading || !comment.trim()}
        >
          {loading ? 'Guardando...' : 'Reportar Problema'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

