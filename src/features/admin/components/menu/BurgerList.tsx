'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Stack, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  TextField,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Burger } from '@/features/database/types';

// Lista predefinida de ingredientes comunes para hamburguesas
const COMMON_INGREDIENTS = [
  'Carne', 
  'Queso Crema', 
  'Queso Cheddar', 
  'Tomate', 
  'Lechuga', 
  'Cebolla', 
  'Cebolla Caramelizada',
  'BBQ', 
  'Maíz', 
  'Bacon', 
  'Huevo',
  'Pepinillos',
  'Champiñones',
  'Aguacate',
  'Pan',
  'Salsa Especial'
];

interface BurgerListProps {
  burgers: Burger[];
  onEdit: (burger: Burger) => void;
  onDelete: (burgerId: string) => void;
  onUpdateIngredients?: (burgerId: string, ingredients: string[]) => Promise<{ success: boolean; error?: string }>;
}

export const BurgerList: React.FC<BurgerListProps> = ({ 
  burgers, 
  onEdit, 
  onDelete, 
  onUpdateIngredients 
}) => {
  const [editingIngredientsFor, setEditingIngredientsFor] = useState<string | null>(null);
  const [tempIngredients, setTempIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [saving, setSaving] = useState(false);

  // Obtener la hamburguesa que se está editando actualmente (si hay alguna)
  const currentBurger = editingIngredientsFor 
    ? burgers.find(b => b._id && b._id.toString() === editingIngredientsFor) 
    : null;

  // Abrir el diálogo de edición de ingredientes
  const handleOpenIngredientsEditor = (burger: Burger) => {
    if (burger._id) {
      console.log('Opening ingredients editor for burger:', burger);
      setEditingIngredientsFor(burger._id.toString());
      setTempIngredients([...burger.ingredients]);
    } else {
      console.error('Cannot edit ingredients: burger has no ID');
      showSnackbar('Error: No se puede editar los ingredientes', 'error');
    }
  };

  // Cerrar el diálogo sin guardar cambios
  const handleCloseIngredientsEditor = () => {
    setEditingIngredientsFor(null);
    setTempIngredients([]);
    setCustomIngredient('');
    setSaving(false);
  };

  // Mostrar notificación
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Guardar los cambios en los ingredientes
  const handleSaveIngredients = async () => {
    if (!editingIngredientsFor || !onUpdateIngredients) {
      console.error('Cannot save ingredients: missing burger ID or update function');
      return;
    }

    try {
      setSaving(true);
      console.log('Saving ingredients for burger:', editingIngredientsFor);
      console.log('Ingredients to save:', tempIngredients);
      
      const result = await onUpdateIngredients(editingIngredientsFor, tempIngredients);
      console.log('Save result:', result);
      
      if (result.success) {
        showSnackbar('Ingredientes actualizados con éxito', 'success');
        handleCloseIngredientsEditor();
      } else {
        console.error('Failed to update ingredients:', result.error);
        showSnackbar(`Error: ${result.error || 'No se pudieron actualizar los ingredientes'}`, 'error');
      }
    } catch (error) {
      console.error('Error saving ingredients:', error);
      showSnackbar('Error al guardar los ingredientes', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Manejar la selección/deselección de ingredientes
  const handleIngredientToggle = (ingredient: string) => {
    console.log('Toggling ingredient:', ingredient);
    if (tempIngredients.includes(ingredient)) {
      setTempIngredients(prev => prev.filter(ing => ing !== ingredient));
    } else {
      setTempIngredients(prev => [...prev, ingredient]);
    }
  };

  // Añadir un ingrediente personalizado
  const handleAddCustomIngredient = () => {
    if (customIngredient.trim() === '') return;
    
    console.log('Adding custom ingredient:', customIngredient);
    if (!tempIngredients.includes(customIngredient.trim())) {
      setTempIngredients(prev => [...prev, customIngredient.trim()]);
      setCustomIngredient('');
    }
  };

  // Eliminar un ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    console.log('Removing ingredient:', ingredient);
    setTempIngredients(prev => prev.filter(ing => ing !== ingredient));
  };

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {burgers.map((burger) => (
          <Card key={burger._id?.toString()} sx={{ position: 'relative' }}>
            <CardContent>
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton 
                  onClick={() => onEdit(burger)}
                  title="Editar hamburguesa"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => burger._id && onDelete(burger._id.toString())}
                  title="Eliminar hamburguesa"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {burger.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {burger.description}
              </Typography>
              
              <Typography variant="h6" color="primary">
                ${burger.price.toFixed(2)}
              </Typography>
              
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, pr: 5 }}>
                  {burger.ingredients.map((ingredient) => (
                    <Typography
                      key={ingredient}
                      variant="caption"
                      sx={{
                        bgcolor: '#FFF8F0',
                        color: '#FF6B00',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1
                      }}
                    >
                      {ingredient}
                    </Typography>
                  ))}
                </Stack>
                <IconButton 
                  onClick={() => handleOpenIngredientsEditor(burger)}
                  title="Editar ingredientes"
                  sx={{ 
                    color: '#FF6B00',
                    position: 'absolute',
                    right: -8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 248, 240, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 248, 240, 1)'
                    },
                    width: 36,
                    height: 36,
                    border: '1px solid #FF6B00',
                  }}
                >
                  <RestaurantIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Diálogo para editar ingredientes */}
      <Dialog 
        open={!!editingIngredientsFor} 
        onClose={handleCloseIngredientsEditor}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Editar Ingredientes: {currentBurger?.name}
        </DialogTitle>
        <DialogContent>
          {/* Sección de ingredientes seleccionados */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ingredientes seleccionados:
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                minHeight: '50px',
              }}
            >
              {tempIngredients.length > 0 ? (
                tempIngredients.map(ingredient => (
                  <Chip
                    key={ingredient}
                    label={ingredient}
                    onDelete={() => handleRemoveIngredient(ingredient)}
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      borderColor: '#FF6B00', 
                      color: '#FF6B00',
                      '& .MuiChip-deleteIcon': {
                        color: '#FF6B00',
                        '&:hover': {
                          color: '#E55C00'
                        }
                      }
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay ingredientes seleccionados
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Selección de ingredientes comunes */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ingredientes comunes:
            </Typography>
            <FormGroup>
              <Grid container spacing={1}>
                {COMMON_INGREDIENTS.map(ingredient => (
                  <Grid item xs={6} sm={4} key={ingredient}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={tempIngredients.includes(ingredient)}
                          onChange={() => handleIngredientToggle(ingredient)}
                          sx={{
                            color: '#FF6B00',
                            '&.Mui-checked': {
                              color: '#FF6B00',
                            },
                          }}
                        />
                      }
                      label={ingredient}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </Box>

          {/* Campo para añadir ingredientes personalizados */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Ingrediente personalizado"
              value={customIngredient}
              onChange={(e) => setCustomIngredient(e.target.value)}
              fullWidth
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={handleAddCustomIngredient}
              sx={{ 
                bgcolor: '#FF6B00', 
                '&:hover': { bgcolor: '#E55C00' },
                minWidth: '120px'
              }}
            >
              Añadir
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIngredientsEditor}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveIngredients}
            variant="contained"
            disabled={saving}
            sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E55C00' } }}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notificación de estado */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}; 