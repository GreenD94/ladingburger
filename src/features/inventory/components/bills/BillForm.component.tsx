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
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Bill, BillItem } from '../../types/bill.type';
import { Material } from '../../types/material.type';
import { EMPTY_BILL } from '../../constants/emptyObjects.constants';
import { registerBill } from '../../actions/bills/registerBill.action';
import { getMaterials } from '../../actions/materials/getMaterials.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

interface BillFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface BillItemForm {
  materialId: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export function BillForm({ open, onClose, onSuccess }: BillFormProps) {
  const { t } = useLanguage();
  const [billNumber, setBillNumber] = useState(EMPTY_STRING);
  const [supplier, setSupplier] = useState(EMPTY_STRING);
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [items, setItems] = useState<BillItemForm[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(EMPTY_STRING);

  useEffect(() => {
    if (open) {
      setBillNumber(EMPTY_STRING);
      setSupplier(EMPTY_STRING);
      setPurchaseDate(new Date());
      setItems([]);
      setError(EMPTY_STRING);
      fetchMaterials();
    }
  }, [open]);

  const fetchMaterials = async () => {
    const response = await getMaterials();
    if (response.success && response.data) {
      setMaterials(response.data);
    }
  };

  const materialOptions: PillSelectOption[] = materials.map(material => ({
    id: typeof material._id === 'string' ? material._id : material._id?.toString() || '',
    label: `${material.name} (${material.unit})`,
    value: typeof material._id === 'string' ? material._id : material._id?.toString() || '',
  }));

  const handleAddItem = () => {
    setItems([...items, {
      materialId: EMPTY_STRING,
      quantity: 0,
      unit: EMPTY_STRING,
      unitCost: 0,
      totalCost: 0,
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof BillItemForm, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'materialId') {
      const material = materials.find(m => {
        const materialId = typeof m._id === 'string' ? m._id : m._id?.toString() || '';
        return materialId === value;
      });
      if (material) {
        item.materialId = value as string;
        item.unit = material.unit;
      }
    } else {
      item[field] = value as never;
    }

    if (field === 'quantity' || field === 'unitCost') {
      item.totalCost = item.quantity * item.unitCost;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (billNumber.trim() === EMPTY_STRING) {
      setError('Bill number is required');
      return;
    }

    if (supplier.trim() === EMPTY_STRING) {
      setError('Supplier is required');
      return;
    }

    if (items.length === 0) {
      setError('At least one item is required');
      return;
    }

    const hasInvalidItems = items.some(item => 
      item.materialId === EMPTY_STRING || item.quantity <= 0 || item.unitCost <= 0
    );

    if (hasInvalidItems) {
      setError('All items must have material, quantity > 0, and unit cost > 0');
      return;
    }

    setLoading(true);
    setError(EMPTY_STRING);

    try {
      const billItems: Omit<BillItem, 'totalCost'>[] = items.map(item => ({
        materialId: item.materialId,
        quantity: item.quantity,
        unit: item.unit,
        unitCost: item.unitCost,
      }));

      const result = await registerBill({
        billNumber: billNumber.trim(),
        supplier: supplier.trim(),
        purchaseDate,
        items: billItems,
      });

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || t('errorRegisteringBill'));
      }
    } catch (err) {
      setError(t('errorRegisteringBill'));
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalCost, 0);
  const canSubmit = billNumber.trim() !== EMPTY_STRING && 
                   supplier.trim() !== EMPTY_STRING && 
                   items.length > 0 && 
                   !loading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>{t('registerBill')}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label={t('billNumber')}
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />

          <TextField
            label={t('supplier')}
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />

          <TextField
            label={t('purchaseDate')}
            type="date"
            value={purchaseDate.toISOString().split('T')[0]}
            onChange={(e) => setPurchaseDate(new Date(e.target.value))}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('billItems')}</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                size="small"
                disabled={loading}
              >
                {t('addMaterial')}
              </Button>
            </Box>

            {items.map((item, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="subtitle2">
                    {t('billItems')} #{index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveItem(index)}
                    size="small"
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Stack spacing={2}>
                  <PillSelect
                    options={materialOptions}
                    selectedValues={item.materialId ? [item.materialId] : []}
                    onSelectionChange={(values) => handleItemChange(index, 'materialId', values[0] || EMPTY_STRING)}
                    multiple={false}
                    searchable={true}
                    placeholder={t('materialName')}
                  />

                  <TextField
                    label={t('materialQuantity')}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    size="small"
                    disabled={loading}
                  />

                  <TextField
                    label={t('unitCost')}
                    type="number"
                    value={item.unitCost}
                    onChange={(e) => handleItemChange(index, 'unitCost', parseFloat(e.target.value) || 0)}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    size="small"
                    disabled={loading}
                  />

                  <Typography variant="body2" color="text.secondary">
                    {t('totalCost')}: ${item.totalCost.toFixed(2)}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="h6">
              {t('billTotal')}: ${totalAmount.toFixed(2)}
            </Typography>
          </Box>

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
          {loading ? t('saving') : t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

