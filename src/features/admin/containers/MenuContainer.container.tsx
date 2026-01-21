'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Burger } from '@/features/database/types/index.type';
import { EMPTY_BURGER } from '@/features/database/constants/emptyObjects.constants';
import { getAllMenuItems, createBurger, updateBurger, deleteBurger } from '@/features/menu/actions/menu.action';
import { MenuList } from '../components/menu/MenuList.component';
import { BurgerForm } from '../components/menu/BurgerForm.component';
import { DeleteConfirmDialog } from '../components/menu/DeleteConfirmDialog.component';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const EMPTY_SNACKBAR: SnackbarState = {
  open: false,
  message: '',
  severity: 'success',
};

export const MenuContainer: React.FC = () => {
  const { t } = useLanguage();
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBurger, setSelectedBurger] = useState<Burger>(EMPTY_BURGER);
  const [snackbar, setSnackbar] = useState<SnackbarState>(EMPTY_SNACKBAR);

  const fetchBurgers = async () => {
    try {
      setLoading(true);
      setError('');
      const allBurgers = await getAllMenuItems();
      setBurgers(allBurgers);
    } catch (err) {
      console.error('Error fetching burgers:', err);
      setError(t('errorLoadingMenu'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBurgers();
  }, []);

  const handleCreate = () => {
    setSelectedBurger(EMPTY_BURGER);
    setFormOpen(true);
  };

  const handleEdit = (burger: Burger) => {
    setSelectedBurger(burger);
    setFormOpen(true);
  };

  const handleDeleteClick = (burger: Burger) => {
    setSelectedBurger(burger);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (burgerData: Omit<Burger, '_id'>) => {
    try {
      const isEditing = selectedBurger._id !== '';
      if (isEditing) {
        const burgerId = typeof selectedBurger._id === 'string' ? selectedBurger._id : selectedBurger._id?.toString() || '';
        const result = await updateBurger({
          _id: burgerId,
          ...burgerData,
        });

        if (result.success) {
          setSnackbar({
            open: true,
            message: t('burgerUpdatedSuccess'),
            severity: 'success',
          });
          await fetchBurgers();
        } else {
          throw new Error(result.error || t('errorUpdatingBurger'));
        }
      } else {
        const result = await createBurger(burgerData);

        if (result.success) {
          setSnackbar({
            open: true,
            message: t('burgerCreatedSuccess'),
            severity: 'success',
          });
          await fetchBurgers();
        } else {
          throw new Error(result.error || t('errorCreatingBurger'));
        }
      }
    } catch (err) {
      console.error('Error saving burger:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : t('errorSavingBurger'),
        severity: 'error',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedBurger._id === '') return;

    try {
      const burgerId = typeof selectedBurger._id === 'string' ? selectedBurger._id : selectedBurger._id?.toString() || '';
      const result = await deleteBurger(burgerId);

      if (result.success) {
        setSnackbar({
          open: true,
          message: t('burgerDeletedSuccess'),
          severity: 'success',
        });
        setDeleteDialogOpen(false);
        setSelectedBurger(EMPTY_BURGER);
        await fetchBurgers();
      } else {
        throw new Error(result.error || t('errorDeletingBurger'));
      }
    } catch (err) {
      console.error('Error deleting burger:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : t('errorDeletingBurger'),
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isEditing = selectedBurger._id !== '';

  return (
    <Box sx={{ px: { xs: 1, sm: 0 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, width: { xs: '100%', sm: 'auto' } }}
        >
          {t('menuManagement')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {t('newBurger')}
        </Button>
      </Box>

      <MenuList
        burgers={burgers}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreate}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
      >
        <AddIcon />
      </Fab>

      <BurgerForm
        open={formOpen}
        burger={isEditing ? selectedBurger : undefined}
        onClose={() => {
          setFormOpen(false);
          setSelectedBurger(EMPTY_BURGER);
        }}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        burgerName={selectedBurger.name || ''}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedBurger(EMPTY_BURGER);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

