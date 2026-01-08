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
import { Burger } from '@/features/database/types';
import { getAllMenuItems, createBurger, updateBurger, deleteBurger } from '@/features/database/actions/menu';
import { MenuList } from '../components/menu/MenuList';
import { BurgerForm } from '../components/menu/BurgerForm';
import { DeleteConfirmDialog } from '../components/menu/DeleteConfirmDialog';

export const MenuContainer: React.FC = () => {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchBurgers = async () => {
    try {
      setLoading(true);
      setError(null);
      const allBurgers = await getAllMenuItems();
      setBurgers(allBurgers);
    } catch (err) {
      console.error('Error fetching burgers:', err);
      setError('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBurgers();
  }, []);

  const handleCreate = () => {
    setSelectedBurger(null);
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
      if (selectedBurger) {
        // Update existing burger
        const result = await updateBurger({
          _id: selectedBurger._id!.toString(),
          ...burgerData,
        });

        if (result.success) {
          setSnackbar({
            open: true,
            message: 'Hamburguesa actualizada exitosamente',
            severity: 'success',
          });
          await fetchBurgers();
        } else {
          throw new Error(result.error || 'Error al actualizar');
        }
      } else {
        // Create new burger
        const result = await createBurger(burgerData);

        if (result.success) {
          setSnackbar({
            open: true,
            message: 'Hamburguesa creada exitosamente',
            severity: 'success',
          });
          await fetchBurgers();
        } else {
          throw new Error(result.error || 'Error al crear');
        }
      }
    } catch (err) {
      console.error('Error saving burger:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Error al guardar la hamburguesa',
        severity: 'error',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBurger) return;

    try {
      const result = await deleteBurger(selectedBurger._id!.toString());

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Hamburguesa eliminada exitosamente',
          severity: 'success',
        });
        setDeleteDialogOpen(false);
        setSelectedBurger(null);
        await fetchBurgers();
      } else {
        throw new Error(result.error || 'Error al eliminar');
      }
    } catch (err) {
      console.error('Error deleting burger:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Error al eliminar la hamburguesa',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
          Gestión de Menú
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
          Nueva Hamburguesa
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
        burger={selectedBurger}
        onClose={() => {
          setFormOpen(false);
          setSelectedBurger(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        burgerName={selectedBurger?.name || ''}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedBurger(null);
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

