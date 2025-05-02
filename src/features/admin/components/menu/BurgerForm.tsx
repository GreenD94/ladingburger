'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  useTheme,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Burger, BURGER_IMAGES } from '@/features/database/types/burger';
import { INGREDIENT_COSTS, calculateTotalCost, calculateTotalCostWithOthers } from '@/features/admin/utils/ingredientCosts';
import { useIngredients } from '@/features/admin/hooks/useIngredients';
import { IngredientsAdmin } from '@/features/admin/components/ingredients/IngredientsAdmin';
import Dialog from '@mui/material/Dialog';
import EditIcon from '@mui/icons-material/Edit';

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
  
  // Estado para las notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Función para mostrar notificaciones
  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Función para cerrar la notificación
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const defaultValues = {
    _id: burger?._id || undefined,
    name: burger?.name || '',
    description: burger?.description || '',
    price: burger?.price || 0,
    ingredients: burger?.ingredients || [],
    image: burger?.image || BURGER_IMAGES.CLASSIC,
    category: burger?.category || 'hamburguesa',
    isAvailable: burger?.isAvailable !== false,
    otherCosts: burger?.otherCosts || 0,
    ingredientCosts: burger?.ingredientCosts || {}
  };
  
  const { control, handleSubmit, setValue, watch } = useForm<Burger>({
    defaultValues
  });
  
  // State para controlar el campo de ingrediente personalizado
  const [customIngredient, setCustomIngredient] = useState('');
  // Agregar estado para precio personalizado
  const [customIngredientPrice, setCustomIngredientPrice] = useState<number>(0);
  
  // Obtener los valores actuales de ingredients y otherCosts del formulario
  const currentIngredients = watch('ingredients') || [];
  const otherCostsValue = watch('otherCosts');
  
  // Agregar estado para los costos personalizados
  const [customIngredientCosts, setCustomIngredientCosts] = useState<Record<string, number>>({});

  // Cargar los costos personalizados cuando se carga una hamburguesa existente
  useEffect(() => {
    if (burger?.ingredientCosts) {
      setCustomIngredientCosts(burger.ingredientCosts);
    }
  }, [burger]);

  const { ingredients: dbIngredients, loading: loadingIngredients } = useIngredients();
  const getDbCost = (ingredient: string) => dbIngredients.find(i => i.name === ingredient)?.cost ?? 0;

  // Calcular el costo de ingredientes
  const ingredientsCost = currentIngredients.reduce((total, ingredient) => {
    // Primero buscar en los costos personalizados
    if (customIngredientCosts[ingredient] !== undefined) {
      return total + customIngredientCosts[ingredient];
    } 
    // Luego usar los costos predefinidos
    else {
      return total + getDbCost(ingredient);
    }
  }, 0);

  // Asegúrate de convertir otherCostsValue a número y usar 0 si es NaN
  const otherCostsNumber = typeof otherCostsValue === 'number' 
    ? otherCostsValue 
    : parseFloat(String(otherCostsValue || 0));

  // Calcular el costo total incluyendo otros costos
  const totalCost = ingredientsCost + otherCostsNumber;

  // Manejador para los checkbox de ingredientes
  const handleIngredientToggle = (ingredient: string) => {
    const updatedIngredients = [...currentIngredients];
    
    if (updatedIngredients.includes(ingredient)) {
      // Eliminar el ingrediente si ya está seleccionado
      setValue('ingredients', updatedIngredients.filter(ing => ing !== ingredient));
      showNotification(`Ingrediente "${ingredient}" removido de la lista`);
    } else {
      // Agregar el ingrediente si no está seleccionado
      setValue('ingredients', [...updatedIngredients, ingredient]);
      showNotification(`Ingrediente "${ingredient}" agregado a la lista`);
    }
  };

  // Manejador para añadir un ingrediente personalizado
  const handleAddCustomIngredient = () => {
    if (customIngredient.trim() === '') {
      showNotification('Por favor ingresa un nombre para el ingrediente', 'warning');
      return;
    }
    
    const trimmedIngredient = customIngredient.trim();
    
    if (!currentIngredients.includes(trimmedIngredient)) {
      // Añadir el ingrediente a la lista
      setValue('ingredients', [...currentIngredients, trimmedIngredient]);
      
      // Guardar el costo personalizado
      setCustomIngredientCosts(prev => ({
        ...prev,
        [trimmedIngredient]: customIngredientPrice
      }));
      
      showNotification(`Ingrediente personalizado "${trimmedIngredient}" agregado con costo $${customIngredientPrice.toFixed(2)}`);
      
      // Limpiar los campos
      setCustomIngredient('');
      setCustomIngredientPrice(0);
    } else {
      showNotification('Este ingrediente ya está en la lista', 'warning');
    }
  };

  // Manejador para eliminar un ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    setValue('ingredients', currentIngredients.filter(ing => ing !== ingredient));
    showNotification(`Ingrediente "${ingredient}" eliminado de la lista`);
  };

  const onSubmit = (data: Burger) => {
    // Validar campos requeridos
    if (!data.name.trim()) {
      showNotification('El nombre de la hamburguesa es requerido', 'error');
      return;
    }
    if (!data.description.trim()) {
      showNotification('La descripción de la hamburguesa es requerida', 'error');
      return;
    }
    if (data.price <= 0) {
      showNotification('El precio debe ser mayor a 0', 'error');
      return;
    }
    if (data.ingredients.length === 0) {
      showNotification('Debes agregar al menos un ingrediente', 'error');
      return;
    }

    // Asegurarse de que el precio sea un número válido antes de enviar
    const priceValue = typeof data.price === 'number' 
      ? data.price 
      : typeof data.price === 'string' 
        ? parseFloat(data.price) 
        : 0;

    const finalData = {
      ...data,
      price: !isNaN(priceValue) ? priceValue : 0,
      ingredientCosts: customIngredientCosts
    };
    
    onSave(finalData);
    showNotification(
      burger 
        ? 'Hamburguesa actualizada exitosamente' 
        : 'Nueva hamburguesa creada exitosamente'
    );
  };

  useEffect(() => {
    console.log({
      currentIngredients,
      otherCostsValue,
      ingredientsCost,
      otherCostsNumber,
      totalCost
    });
  }, [currentIngredients, otherCostsValue]);

  const [openIngredientsAdmin, setOpenIngredientsAdmin] = useState(false);

  return (
    <>
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
                    label="Precio de venta al público"
                    type="number"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log('Price field changed:', {
                        inputValue: value,
                        parsedValue: parseFloat(value),
                      });
                      field.onChange(parseFloat(value));
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      style: { fontSize: isMobile ? '16px' : undefined }
                    }}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? "El precio es requerido" : "Precio que verá el cliente en el menú"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderWidth: "2px",
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: "2px"
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="otherCosts"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Otros Costos"
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      style: { fontSize: isMobile ? '16px' : undefined }
                    }}
                    helperText="Costos adicionales relacionados con ingredientes (solo visible para administradores)"
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
                <IconButton size="small" onClick={() => setOpenIngredientsAdmin(true)} sx={{ ml: 1 }} title="Editar ingredientes">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {currentIngredients.length > 0 ? (
                      currentIngredients.map((ingredient) => {
                        // Obtener el precio del ingrediente
                        const cost = customIngredientCosts[ingredient] !== undefined
                          ? customIngredientCosts[ingredient]
                          : getDbCost(ingredient);
                          
                        return (
                          <Chip
                            key={ingredient}
                            label={`${ingredient} ($${cost.toFixed(1)})`}
                            onDelete={() => handleRemoveIngredient(ingredient)}
                            color="primary"
                            variant="outlined"
                            size={isMobile ? "medium" : "small"}
                            sx={{ margin: '3px' }}
                          />
                        );
                      })
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
                        const cost = getDbCost(ingredient);
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
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 1,
                    alignItems: 'flex-start'
                  }}>
                    <TextField
                      fullWidth
                      size={isMobile ? "medium" : "small"}
                      value={customIngredient}
                      onChange={(e) => setCustomIngredient(e.target.value)}
                      placeholder="Nombre del ingrediente"
                      variant="outlined"
                      InputProps={{
                        style: { fontSize: isMobile ? '16px' : undefined }
                      }}
                      sx={{ flex: 2 }}
                    />
                    
                    <TextField
                      type="number"
                      value={customIngredientPrice}
                      onChange={(e) => setCustomIngredientPrice(Number(e.target.value))}
                      placeholder="Precio"
                      variant="outlined"
                      size={isMobile ? "medium" : "small"}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        style: { fontSize: isMobile ? '16px' : undefined }
                      }}
                      sx={{ 
                        flex: 1,
                        minWidth: isMobile ? '100%' : '120px'
                      }}
                    />
                    
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleAddCustomIngredient}
                      sx={{ 
                        height: isMobile ? '48px' : '40px',
                        minWidth: isMobile ? '100%' : '100px'
                      }}
                    >
                      Agregar
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
              mb: 2
            }}>
              <Typography variant="subtitle1">Costo de ingredientes:</Typography>
              <Typography variant="subtitle1" fontWeight="bold">${ingredientsCost.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2
            }}>
              <Typography variant="subtitle1">Otros costos:</Typography>
              <Typography variant="subtitle1" fontWeight="bold">${otherCostsNumber.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              borderTop: '1px dashed',
              borderColor: 'divider',
              pt: 2
            }}>
              <Typography variant="subtitle1" fontWeight="medium">Costo total:</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main">${totalCost.toFixed(2)}</Typography>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={openIngredientsAdmin} onClose={() => setOpenIngredientsAdmin(false)} maxWidth="sm" fullWidth>
        <IngredientsAdmin />
      </Dialog>
    </>
  );
}; 