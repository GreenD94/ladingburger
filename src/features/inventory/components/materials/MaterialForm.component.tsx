'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { Material } from '../../types/material.type';
import { EMPTY_MATERIAL } from '../../constants/emptyObjects.constants';
import { MATERIAL_CATEGORIES, MATERIAL_CATEGORY_LABELS } from '../../constants/materialCategories.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';
import { createMaterial } from '../../actions/materials/createMaterial.action';
import { updateMaterial } from '../../actions/materials/updateMaterial.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

interface MaterialFormProps {
  open: boolean;
  material?: Material;
  onClose: () => void;
  onSuccess: () => void;
}

export function MaterialForm({ open, material, onClose, onSuccess }: MaterialFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(EMPTY_STRING);
  const [unit, setUnit] = useState(EMPTY_STRING);
  const [category, setCategory] = useState(MATERIAL_CATEGORIES.OTHER);
  const [minStockLevel, setMinStockLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(EMPTY_STRING);

  const isEditing = !!material;
  const materialId = material?._id ? (typeof material._id === 'string' ? material._id : material._id.toString()) : EMPTY_STRING;

  useEffect(() => {
    if (open) {
      const currentMaterial = material || EMPTY_MATERIAL;
      setName(currentMaterial.name);
      setUnit(currentMaterial.unit);
      setCategory(currentMaterial.category || MATERIAL_CATEGORIES.OTHER);
      setMinStockLevel(currentMaterial.minStockLevel);
      setError(EMPTY_STRING);
    }
  }, [open, material]);

  const categoryOptions: PillSelectOption[] = Object.values(MATERIAL_CATEGORIES).map(cat => ({
    id: cat,
    label: MATERIAL_CATEGORY_LABELS[cat] || cat,
    value: cat,
  }));

  const handleCategoryChange = (values: string[]) => {
    const selectedCategory = values[0] || MATERIAL_CATEGORIES.OTHER;
    setCategory(selectedCategory);
  };

  const handleSubmit = async () => {
    if (name.trim() === EMPTY_STRING) {
      setError('Material name is required');
      return;
    }

    if (unit.trim() === EMPTY_STRING) {
      setError('Unit is required');
      return;
    }

    setLoading(true);
    setError(EMPTY_STRING);

    try {
      if (isEditing) {
        const result = await updateMaterial(materialId, {
          name: name.trim(),
          unit: unit.trim(),
          category,
          minStockLevel,
        });

        if (result.success) {
          onSuccess();
          onClose();
        } else {
          setError(result.error || t('errorUpdatingMaterial'));
        }
      } else {
        const result = await createMaterial({
          name: name.trim(),
          unit: unit.trim(),
          category,
          minStockLevel,
        });

        if (result.success) {
          onSuccess();
          onClose();
        } else {
          setError(result.error || t('errorCreatingMaterial'));
        }
      }
    } catch (err) {
      setError(isEditing ? t('errorUpdatingMaterial') : t('errorCreatingMaterial'));
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = name.trim() !== EMPTY_STRING && unit.trim() !== EMPTY_STRING && !loading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        {isEditing ? t('updateMaterial') : t('createMaterial')}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label={t('materialName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />

          <TextField
            label={t('materialUnit')}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            fullWidth
            required
            disabled={loading}
            placeholder="kg, unidad, litro, etc."
          />

          <Box>
            <PillSelect
              options={categoryOptions}
              selectedValues={[category]}
              onSelectionChange={handleCategoryChange}
              multiple={false}
              searchable={false}
              placeholder={t('materialCategory')}
            />
          </Box>

          <TextField
            label={t('minStockLevel')}
            type="number"
            value={minStockLevel}
            onChange={(e) => setMinStockLevel(parseFloat(e.target.value) || 0)}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
            disabled={loading}
          />

          {error !== EMPTY_STRING && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? t('saving') : (isEditing ? t('update') : t('create'))}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

