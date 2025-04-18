'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { updateOrderPayment } from '@/features/database/actions/orders/updateOrderPayment';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export default function PaymentModal({
  open,
  onClose,
  orderId,
  onSuccess,
}: PaymentModalProps) {
  const [bankAccount, setBankAccount] = useState('');
  const [transferReference, setTransferReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await updateOrderPayment(orderId, bankAccount, transferReference);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Pago</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Cuenta Bancaria"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Referencia de Transferencia"
            value={transferReference}
            onChange={(e) => setTransferReference(e.target.value)}
            fullWidth
            required
          />
          {error && (
            <Box sx={{ color: 'error.main', mt: 1 }}>
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 