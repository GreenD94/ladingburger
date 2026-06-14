'use client';

import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import { Bill } from '../../types/bill.type';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { BillConsumptionEstimate } from '../../utils/estimateBillConsumption.util';
import styles from '../../styles/BillRow.module.css';

interface BillRowProps {
  bill: Bill;
  estimate?: BillConsumptionEstimate;
  onConfirm: (bill: Bill) => void;
}

export function BillRow({ bill, estimate, onConfirm }: BillRowProps) {
  const { t } = useLanguage();
  
  const isActive = bill.status === 'active';
  const isConsumed = bill.status === 'consumed';
  const canConfirm = isActive && estimate?.isFullyConsumed;
  const consumptionPercentage = estimate?.consumptionPercentage || 0;

  return (
    <Paper className={styles.billCard} elevation={1}>
      <Box className={styles.billHeader}>
        <Box className={styles.billInfo}>
          <Typography variant="h6" className={styles.billNumber}>
            {t('billNumber')}: {bill.billNumber}
          </Typography>
          <Typography variant="body2" className={styles.supplier}>
            {bill.supplier}
          </Typography>
          <Typography variant="body2" className={styles.purchaseDate}>
            {new Date(bill.purchaseDate).toLocaleDateString()}
          </Typography>
        </Box>
        <Chip
          label={isConsumed ? t('consumed') : t('active')}
          color={isConsumed ? 'default' : 'primary'}
          size="small"
        />
      </Box>

      <Box className={styles.billDetails}>
        <Box className={styles.detailRow}>
          <Typography variant="body2" className={styles.detailLabel}>
            {t('billTotal')}:
          </Typography>
          <Typography variant="body2" className={styles.detailValue}>
            ${bill.totalAmount.toFixed(2)}
          </Typography>
        </Box>

        <Box className={styles.detailRow}>
          <Typography variant="body2" className={styles.detailLabel}>
            {t('billItems')}:
          </Typography>
          <Typography variant="body2" className={styles.detailValue}>
            {bill.items.length}
          </Typography>
        </Box>

        {estimate && isActive && (
          <Box className={styles.detailRow}>
            <Typography variant="body2" className={styles.detailLabel}>
              {t('estimatedConsumed')}:
            </Typography>
            <Typography variant="body2" className={styles.detailValue}>
              {consumptionPercentage.toFixed(1)}%
            </Typography>
          </Box>
        )}

        {isConsumed && bill.confirmedAt && (
          <Box className={styles.detailRow}>
            <Typography variant="body2" className={styles.detailLabel}>
              {t('confirmedAt')}:
            </Typography>
            <Typography variant="body2" className={styles.detailValue}>
              {new Date(bill.confirmedAt).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </Box>

      {canConfirm && (
        <Box className={styles.actions}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onConfirm(bill)}
            className={styles.confirmButton}
            fullWidth
          >
            {t('confirmBill')}
          </Button>
        </Box>
      )}
    </Paper>
  );
}

