'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Bill } from '../../types/bill.type';
import { Material } from '../../types/material.type';
import { Order } from '@/features/database/types/order.type';
import { Burger } from '@/features/database/types/burger.type';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

interface BillConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  bill: Bill;
  orders: Order[];
  burgers: Record<string, Burger>;
  materials: Material[];
  currentUserId: string;
  onSuccess: () => void;
}

export function BillConfirmationModal({
  open,
  onClose,
  bill,
  orders,
  burgers,
  materials,
  currentUserId,
  onSuccess,
}: BillConfirmationModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(EMPTY_STRING);

  const handleConfirm = async () => {
    setLoading(true);
    setError(EMPTY_STRING);

    try {
      const { confirmBillConsumption } = await import('../../actions/bills/confirmBillConsumption.action');
      const result = await confirmBillConsumption(bill._id?.toString() || '', currentUserId);

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || t('error'));
      }
    } catch (err) {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t('confirmBillConsumption')}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          {t('confirmBillConsumptionMessage')}
        </Typography>
        {error !== EMPTY_STRING && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? t('saving') : t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
