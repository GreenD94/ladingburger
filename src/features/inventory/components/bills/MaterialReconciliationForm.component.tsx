'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { MaterialReconciliation } from '../../types/reconciliation.type';
import { MaterialLossCause } from '../../types/loss.type';
import { LOSS_CAUSE_LABELS } from '../../constants/lossCauses.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';

interface MaterialReconciliationFormProps {
  material: MaterialReconciliation;
  onChange: (updated: MaterialReconciliation) => void;
}

export function MaterialReconciliationForm({
  material,
  onChange,
}: MaterialReconciliationFormProps) {
  const { t } = useLanguage();
  
  const lossCauseOptions: PillSelectOption[] = Object.values(MaterialLossCause).map(cause => ({
    id: cause,
    label: LOSS_CAUSE_LABELS[cause],
    value: cause,
  }));

  const handleActualConsumedChange = (value: string) => {
    const actualConsumed = parseFloat(value) || 0;
    const difference = actualConsumed - material.estimatedConsumed;
    
    onChange({
      ...material,
      actualConsumed,
      difference,
    });
  };

  const handleLossQuantityChange = (value: string) => {
    const lossQuantity = parseFloat(value) || 0;
    onChange({
      ...material,
      lossQuantity: lossQuantity > 0 ? lossQuantity : undefined,
    });
  };

  const handleLossCauseChange = (values: string[]) => {
    const cause = values[0] as MaterialLossCause;
    onChange({
      ...material,
      lossCause: cause || undefined,
    });
  };

  const handleLeftoverQuantityChange = (value: string) => {
    const leftoverQuantity = parseFloat(value) || 0;
    onChange({
      ...material,
      leftoverQuantity: leftoverQuantity > 0 ? leftoverQuantity : undefined,
    });
  };

  const hasDifference = material.difference !== 0;
  const hasLoss = material.lossQuantity && material.lossQuantity > 0;
  const hasLeftover = material.leftoverQuantity && material.leftoverQuantity > 0;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {material.materialName}
      </Typography>
      
      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('estimatedConsumed')}: {material.estimatedConsumed}
          </Typography>
          <TextField
            label={t('actualConsumed')}
            type="number"
            value={material.actualConsumed}
            onChange={(e) => handleActualConsumedChange(e.target.value)}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
            size="small"
          />
          {hasDifference && (
            <Typography
              variant="caption"
              color={material.difference > 0 ? 'error' : 'success'}
              sx={{ mt: 0.5, display: 'block' }}
            >
              {t('difference')}: {material.difference > 0 ? '+' : ''}{material.difference}
            </Typography>
          )}
        </Box>

        {hasDifference && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('recordLosses')}
            </Typography>
            <TextField
              label={t('lossQuantity')}
              type="number"
              value={material.lossQuantity || ''}
              onChange={(e) => handleLossQuantityChange(e.target.value)}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              size="small"
              sx={{ mb: 2 }}
            />
            {hasLoss && (
              <Box sx={{ mb: 2 }}>
                <PillSelect
                  options={lossCauseOptions}
                  selectedValues={material.lossCause ? [material.lossCause] : []}
                  onSelectionChange={handleLossCauseChange}
                  multiple={false}
                  searchable={false}
                  placeholder={t('lossCause')}
                />
                <TextField
                  label={t('notes')}
                  value={material.lossNotes || ''}
                  onChange={(e) => onChange({ ...material, lossNotes: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('recordLeftovers')}
          </Typography>
          <TextField
            label={t('leftoverQuantity')}
            type="number"
            value={material.leftoverQuantity || ''}
            onChange={(e) => handleLeftoverQuantityChange(e.target.value)}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
            size="small"
          />
          {hasLeftover && (
            <TextField
              label={t('notes')}
              value={material.leftoverNotes || ''}
              onChange={(e) => onChange({ ...material, leftoverNotes: e.target.value })}
              fullWidth
              multiline
              rows={2}
              size="small"
              sx={{ mt: 2 }}
            />
          )}
        </Box>

        <TextField
          label={t('notes')}
          value={material.notes || ''}
          onChange={(e) => onChange({ ...material, notes: e.target.value })}
          fullWidth
          multiline
          rows={2}
          size="small"
        />
      </Stack>
    </Paper>
  );
}

