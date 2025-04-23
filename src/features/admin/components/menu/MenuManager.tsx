'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { BurgerList } from './BurgerList';
import { BurgerForm } from './BurgerForm';
import { useMenuManager } from '../../hooks/useMenuManager';

export const MenuManager: React.FC = () => {
  const {
    burgers,
    isEditing,
    selectedBurger,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    handleUpdateIngredients
  } = useMenuManager();

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Gestión del Menú</Typography>
        <Button 
          variant="contained" 
          onClick={handleAddNew}
          sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E55C00' } }}
        >
          Agregar Nueva Hamburguesa
        </Button>
      </Box>

      {isEditing ? (
        <BurgerForm 
          burger={selectedBurger} 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <BurgerList 
          burgers={burgers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateIngredients={handleUpdateIngredients}
        />
      )}
    </Box>
  );
}; 