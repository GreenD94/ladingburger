'use client';

import React from 'react';
import { Button, Typography, Box, useMediaQuery, useTheme, Fab, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BurgerList } from './BurgerList';
import { BurgerForm } from './BurgerForm';
import { useMenuManager } from '@/features/admin/hooks/useMenuManager';

export const MenuManager: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
    <Box sx={{ mt: 0, mb: 2, position: 'relative', pb: isMobile ? 8 : 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 2, 
          py: 1,
          px: 2,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant="h5" fontWeight="medium" align={isMobile ? "center" : "left"}>
            Gestión del Menú
          </Typography>
          
          {!isMobile && (
            <Button 
              variant="contained" 
              color="warning"
              onClick={handleAddNew}
              sx={{ 
                bgcolor: '#FF4D00', 
                '&:hover': { bgcolor: '#E64500' } 
              }}
              startIcon={<AddIcon />}
            >
              Agregar Nueva Hamburguesa
            </Button>
          )}
        </Box>
      </Paper>

      {isEditing ? (
        <BurgerForm 
          burger={selectedBurger} 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <Box>
          <BurgerList 
            burgers={burgers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateIngredients={handleUpdateIngredients}
          />
        </Box>
      )}
      
      {/* Botón flotante para dispositivos móviles */}
      {isMobile && !isEditing && (
        <Fab 
          color="warning" 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20,
            bgcolor: '#FF4D00', 
            '&:hover': { bgcolor: '#E64500' },
            zIndex: 1000
          }}
          onClick={handleAddNew}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};
