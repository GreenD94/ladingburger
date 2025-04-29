'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  InputAdornment, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Grid, 
  Chip,
  Divider,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Burger } from '@/features/database/types';
import { INGREDIENT_COSTS, calculateTotalCost } from '@/features/admin/utils/ingredientCosts';

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

interface BurgerFormProps {
  burger: Burger | null;
  onSave: (burgerData: Burger) => void;
  onCancel: () => void;
}

export const BurgerForm: React.FC<BurgerFormProps> = ({ burger, onSave, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const defaultValues = {
    _id: burger?._id || undefined,
    name: burger?.name || '',
    description: burger?.description || '',
    price: burger?.price || 0,
    ingredients: burger?.ingredients || [],
    image: burger?.image || '',
    category: burger?.category || 'hamburguesa',
    isAvailable: burger?.isAvailable !== false
  };
  
  const { control, handleSubmit, setValue, watch } = useForm<Burger>({
    defaultValues
  });
  
  // State para controlar el campo de ingrediente personalizado
  const [customIngredient, setCustomIngredient] = useState('');
  
  // Obtener el valor actual de ingredients del formulario
  const currentIngredients = watch('ingredients');

  // Manejador para los checkbox de ingredientes
  const handleIngredientToggle = (ingredient: string) => {
    const updatedIngredients = [...currentIngredients];
    
    if (updatedIngredients.includes(ingredient)) {
      // Eliminar el ingrediente si ya está seleccionado
      setValue('ingredients', updatedIngredients.filter(ing => ing !== ingredient));
    } else {
      // Agregar el ingrediente si no está seleccionado
      setValue('ingredients', [...updatedIngredients, ingredient]);
    }
  };

  // Manejador para añadir un ingrediente personalizado
  const handleAddCustomIngredient = () => {
    if (customIngredient.trim() === '') return;
    
    if (!currentIngredients.includes(customIngredient.trim())) {
      setValue('ingredients', [...currentIngredients, customIngredient.trim()]);
      setCustomIngredient('');
    }
  };

  // Manejador para eliminar un ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    setValue('ingredients', currentIngredients.filter(ing => ing !== ingredient));
  };

  const onSubmit = (data: Burger) => {
    // Asegurarse de que el precio sea un número válido antes de enviar
    const finalData = {
      ...data,
      price: typeof data.price === 'number' && !isNaN(data.price) ? data.price : 0
    };
    
    onSave(finalData);
  };

  const totalCost = currentIngredients.reduce((total, ingredient) => {
    const cost = INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0;
    return total + cost;
  }, 0);

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: isMobile ? 2 : 3, 
        mx: 'auto', 
        maxWidth: '100%',
        mb: isMobile ? 4 : 0
      }}
    >
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        gutterBottom
        align={isMobile ? "center" : "left"}
      >
        {burger ? 'Editar Hamburguesa' : 'Agregar Nueva Hamburguesa'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? "El nombre es requerido" : ""}
                  InputProps={{
                    style: { fontSize: isMobile ? '16px' : undefined }
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="price"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Precio"
                  type="number"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    style: { fontSize: isMobile ? '16px' : undefined }
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error ? "El precio es requerido" : ""}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? "La descripción es requerida" : ""}
                  InputProps={{
                    style: { fontSize: isMobile ? '16px' : undefined }
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="URL de la imagen"
                  fullWidth
                  variant="outlined"
                  placeholder="https://..."
                  InputProps={{
                    style: { fontSize: isMobile ? '16px' : undefined }
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
              Ingredientes
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentIngredients.length > 0 ? (
                    currentIngredients.map((ingredient) => (
                      <Chip
                        key={ingredient}
                        label={ingredient}
                        onDelete={() => handleRemoveIngredient(ingredient)}
                        color="primary"
                        variant="outlined"
                        size={isMobile ? "medium" : "small"}
                        sx={{ margin: '3px' }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay ingredientes seleccionados
                    </Typography>
                  )}
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Ingredientes comunes:
                  </Typography>
                  <Grid container spacing={1}>
                    {COMMON_INGREDIENTS.map((ingredient) => {
                      const cost = INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0;
                      return (
                        <Grid item xs={6} sm={4} key={ingredient}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={currentIngredients.includes(ingredient)}
                                onChange={() => handleIngredientToggle(ingredient)}
                                color="primary"
                                size={isMobile ? "medium" : "small"}
                              />
                            }
                            label={
                              <Typography variant="body2">
                                {ingredient} (${cost.toFixed(1)})
                              </Typography>
                            }
                            sx={{ 
                              '& .MuiCheckbox-root': { 
                                padding: isMobile ? '9px' : '4px' 
                              } 
                            }}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size={isMobile ? "medium" : "small"}
                    value={customIngredient}
                    onChange={(e) => setCustomIngredient(e.target.value)}
                    placeholder="Ingrediente personalizado"
                    variant="outlined"
                    InputProps={{
                      style: { fontSize: isMobile ? '16px' : undefined }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAddCustomIngredient}
                    sx={{ minWidth: isMobile ? '90px' : '80px' }}
                  >
                    Añadir
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ 
          mt: 4, 
          pt: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3
          }}>
            <Typography variant="subtitle1">Costo de ingredientes:</Typography>
            <Typography variant="subtitle1" fontWeight="bold">${totalCost.toFixed(2)}</Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0
          }}>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={onCancel}
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
            >
              {burger ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}; 