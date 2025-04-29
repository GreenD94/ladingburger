'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Stack,
  Fab,
  Tooltip,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Burger } from '@/features/database/types';
import { INGREDIENT_COSTS, calculateTotalCost, formatIngredientCosts } from '@/features/admin/utils/ingredientCosts';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [editingIngredientsFor, setEditingIngredientsFor] = useState<string | null>(null);
  const [tempIngredients, setTempIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [customIngredientPrice, setCustomIngredientPrice] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Calcular el costo total de los ingredientes temporales
  const tempTotalCost = useMemo(() => {
    return calculateTotalCost(tempIngredients);
  }, [tempIngredients]);

  // Obtener la hamburguesa que se está editando actualmente (si hay alguna)
  const currentBurger = editingIngredientsFor 
    ? burgers.find(b => b._id && b._id.toString() === editingIngredientsFor) 
    : null;

  // Abrir el diálogo de edición de ingredientes
  const handleOpenIngredientsEditor = (burger: Burger) => {
    if (burger._id) {
      setEditingIngredientsFor(burger._id.toString());
      setTempIngredients([...burger.ingredients]);
    } else {
      showSnackbar('Error: No se puede editar los ingredientes', 'error');
    }
  };

  // Cerrar el diálogo sin guardar cambios
  const handleCloseIngredientsEditor = () => {
    setEditingIngredientsFor(null);
    setTempIngredients([]);
    setCustomIngredient('');
    setCustomIngredientPrice(0);
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
      return;
    }

    try {
      setSaving(true);
      const result = await onUpdateIngredients(editingIngredientsFor, tempIngredients);
      
      if (result.success) {
        showSnackbar('Ingredientes actualizados con éxito', 'success');
        handleCloseIngredientsEditor();
      } else {
        showSnackbar(`Error: ${result.error || 'No se pudieron actualizar los ingredientes'}`, 'error');
      }
    } catch (error) {
      showSnackbar('Error al guardar los ingredientes', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Manejar la selección/deselección de ingredientes
  const handleIngredientToggle = (ingredient: string) => {
    if (tempIngredients.includes(ingredient)) {
      setTempIngredients(prev => prev.filter(ing => ing !== ingredient));
    } else {
      setTempIngredients(prev => [...prev, ingredient]);
    }
  };

  // Añadir un ingrediente personalizado
  const handleAddCustomIngredient = () => {
    if (customIngredient.trim() === '') return;
    
    if (!tempIngredients.includes(customIngredient.trim())) {
      setTempIngredients(prev => [...prev, customIngredient.trim()]);
      
      const updatedCosts = {...INGREDIENT_COSTS};
      updatedCosts[customIngredient.trim() as keyof typeof INGREDIENT_COSTS] = customIngredientPrice;
      
      setCustomIngredient('');
      setCustomIngredientPrice(0);
    }
  };

  // Eliminar un ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    setTempIngredients(prev => prev.filter(ing => ing !== ingredient));
  };

  // Función para renderizar una tarjeta de hamburguesa según la imagen
  const renderBurgerCard = (burger: Burger, index: number) => {
    // Calcular el costo total de los ingredientes
    const totalCost = calculateTotalCost(burger.ingredients);
    
    // Formatear los costos de ingredientes para mostrar
    const ingredientCostsText = formatIngredientCosts(burger.ingredients);
    
    return (
      <Grid item xs={12} sm={6} md={4} key={burger._id?.toString() || index}>
        <Card sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          boxShadow: 2
        }}>
          <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', borderRadius: '16px', px: 1, py: 0.5 }}>
            <Typography variant="caption">hamburguesa</Typography>
          </Box>
          
          <CardMedia
            component="img"
            height={isMobile ? "150" : "200"}
            image={burger.image || 'https://via.placeholder.com/400x300?text=Hamburguesa'}
            alt={burger.name}
            sx={{ objectFit: 'cover' }}
          />
          
          <CardContent sx={{ 
            flexGrow: 1, 
            pb: 1,
            pt: 2,
            px: 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              mb: 1
            }}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                mb: 0.5
              }}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    width: 'calc(100% - 80px)',
                    fontSize: {
                      xs: burger.name.length > 15 ? '1rem' : '1.1rem',
                      sm: burger.name.length > 20 ? '1rem' : '1.15rem',
                      md: burger.name.length > 25 ? '1rem' : '1.2rem'
                    },
                    fontWeight: 'bold'
                  }}
                >
                  {burger.name}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  ml: 1, 
                  gap: 1,
                }}>
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(burger)}
                    color="primary"
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'primary.main',
                      padding: '4px',
                      '&:hover': {
                        bgcolor: 'primary.50'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  
                  <IconButton 
                    size="small" 
                    onClick={() => setConfirmDelete(burger._id?.toString() || '')}
                    color="error"
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'error.main',
                      padding: '4px',
                      '&:hover': {
                        bgcolor: 'error.50'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 1, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                display: '-webkit-box', 
                WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical',
                height: '40px',
                lineHeight: '1.3'
              }}
            >
              {burger.description}
            </Typography>
            
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                mb: 1,
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              ${burger.price.toFixed(2)}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {burger.ingredients.slice(0, isMobile ? 3 : 5).map((ingredient, index) => (
                <Chip 
                  key={index} 
                  label={ingredient} 
                  size="small" 
                  variant="outlined"
                  color="primary"
                  sx={{ margin: '2px' }}
                />
              ))}
              {burger.ingredients.length > (isMobile ? 3 : 5) && (
                <Chip 
                  label={`+${burger.ingredients.length - (isMobile ? 3 : 5)}`} 
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={() => handleOpenIngredientsEditor(burger)}
                  sx={{ cursor: 'pointer' }}
                />
              )}
            </Box>
          </CardContent>
          
          <Box sx={{ 
            p: isMobile ? 1 : 1.5, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Costo: {ingredientCostsText}{burger.ingredients.length > 3 ? '...' : ''}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0.5
            }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Costo total: ${totalCost.toFixed(2)}
              </Typography>
              <Button 
                size="small" 
                variant="text" 
                color="primary"
                onClick={() => handleOpenIngredientsEditor(burger)}
              >
                Editar Ing.
              </Button>
            </Box>
          </Box>
        </Card>
      </Grid>
    );
  };

  return (
    <>
      <Grid container spacing={isMobile ? 2 : 3}>
        {burgers.map((burger, index) => renderBurgerCard(burger, index))}
      </Grid>

      {/* Dialog para editar ingredientes */}
      <Dialog 
        open={editingIngredientsFor !== null} 
        onClose={handleCloseIngredientsEditor}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: isMobile ? 1 : 3,
            width: isMobile ? 'calc(100% - 16px)' : undefined
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1
        }}>
          <Typography variant="h6">Editar Ingredientes</Typography>
          <IconButton 
            size="large" 
            onClick={handleCloseIngredientsEditor}
            sx={{ p: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ px: isMobile ? 2 : 3, py: 3 }}>
          {/* Chips de ingredientes seleccionados con precio */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1.5,
              mb: 2 
            }}>
              {tempIngredients.length > 0 ? (
                tempIngredients.map(ingredient => {
                  const cost = INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0;
                  return (
                    <Chip 
                    key={ingredient} 
                      label={`${ingredient} ($${cost.toFixed(1)})`}
                      onDelete={() => handleRemoveIngredient(ingredient)}
                      color="primary"
                      variant="outlined"
                      size="medium"
                      deleteIcon={<CloseIcon />}
                      sx={{ 
                        borderRadius: '16px',
                        height: 36,
                        fontSize: '0.95rem',
                        '& .MuiChip-deleteIcon': {
                          fontSize: '1.2rem',
                          color: 'inherit',
                          '&:hover': {
                            color: 'error.main'
                          }
                        }
                      }}
                    />
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  No hay ingredientes seleccionados
                </Typography>
              )}
            </Box>
            
            {/* Panel de costo actual */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: 'background.default', 
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="subtitle1">Costo de ingredientes:</Typography>
              <Typography 
                variant="h6" 
                color="primary.main" 
                fontWeight="bold"
              >
                ${tempTotalCost.toFixed(2)}
              </Typography>
            </Paper>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Lista de ingredientes categorizada */}
          <Typography variant="subtitle1" gutterBottom>
            Seleccionar ingredientes:
          </Typography>
          
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {/* Primera categoría: Proteínas y básicos */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                Básicos:
              </Typography>
            </Grid>
            {['Carne', 'Pan', 'Huevo', 'Bacon'].map(ingredient => {
              const cost = INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0;
              return (
                <Grid item xs={6} key={ingredient}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={tempIngredients.includes(ingredient)} 
                        onChange={() => handleIngredientToggle(ingredient)}
                        color="primary"
                        sx={{ padding: isMobile ? '12px 9px' : '9px' }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body2">{ingredient}</Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="medium">${cost.toFixed(1)}</Typography>
                      </Box>
                    }
                    sx={{ 
                      width: '100%',
                      margin: 0,
                      padding: '4px 8px',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                </Grid>
              );
            })}
            
            {/* Segunda categoría: Quesos */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 0.5 }}>
                Quesos:
              </Typography>
            </Grid>
            {['Queso Cheddar', 'Queso Crema'].map(ingredient => {
              const cost = INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0;
              return (
                <Grid item xs={6} key={ingredient}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={tempIngredients.includes(ingredient)} 
                        onChange={() => handleIngredientToggle(ingredient)}
                        color="primary"
                        sx={{ padding: isMobile ? '12px 9px' : '9px' }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body2">{ingredient}</Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="medium">${cost.toFixed(1)}</Typography>
                      </Box>
                    }
                    sx={{ 
                      width: '100%',
                      margin: 0,
                      padding: '4px 8px',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                </Grid>
              );
            })}

            {/* Tercera categoría: Vegetales */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 0.5 }}>
                Vegetales:
              </Typography>
            </Grid>
            {['Tomate', 'Lechuga', 'Cebolla', 'Cebolla Caramelizada', 'Aguacate', 'Champiñones', 'Pepinillos', 'Maíz'].map(ingredient => {
              const cost = INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0;
              return (
                <Grid item xs={6} key={ingredient}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={tempIngredients.includes(ingredient)} 
                        onChange={() => handleIngredientToggle(ingredient)}
                        color="primary"
                        sx={{ padding: isMobile ? '12px 9px' : '9px' }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body2">{ingredient}</Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="medium">${cost.toFixed(1)}</Typography>
                      </Box>
                    }
                    sx={{ 
                      width: '100%',
                      margin: 0,
                      padding: '4px 8px',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                </Grid>
              );
            })}

            {/* Cuarta categoría: Salsas */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 0.5 }}>
                Salsas:
              </Typography>
            </Grid>
            {['BBQ', 'Salsa Especial'].map(ingredient => {
              const cost = INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0;
              return (
                <Grid item xs={6} key={ingredient}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                      checked={tempIngredients.includes(ingredient)}
                      onChange={() => handleIngredientToggle(ingredient)}
                        color="primary"
                        sx={{ padding: isMobile ? '12px 9px' : '9px' }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body2">{ingredient}</Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="medium">${cost.toFixed(1)}</Typography>
                      </Box>
                    }
                    sx={{ 
                      width: '100%',
                      margin: 0,
                      padding: '4px 8px',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Agregar ingrediente personalizado con campo de precio */}
          <Typography variant="subtitle1" gutterBottom>
            Agregar ingrediente personalizado:
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 1,
            alignItems: 'flex-start'
          }}>
            <TextField
                  value={customIngredient}
                  onChange={(e) => setCustomIngredient(e.target.value)}
              placeholder="Nombre del ingrediente"
              variant="outlined"
              fullWidth
              size={isMobile ? "medium" : "small"}
              sx={{ flex: 2 }}
            />
            
            {/* Nuevo: Campo para precio del ingrediente personalizado */}
            <TextField
              type="number"
              placeholder="Precio"
              variant="outlined"
              size={isMobile ? "medium" : "small"}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
        </DialogContent>
        
        <DialogActions 
          sx={{ 
            padding: isMobile ? '16px' : '16px 24px',
            borderTop: '1px solid',
            borderColor: 'divider',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}
        >
          {/* Resumen visual del costo con barra de progreso */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 1 
            }}>
              <Typography variant="subtitle1">Costo Total:</Typography>
              <Typography 
                variant="h5" 
                color="primary.main" 
                fontWeight="bold"
              >
                ${tempTotalCost.toFixed(2)}
              </Typography>
            </Box>
            
            {/* Barra de progreso visual */}
            <Box 
              sx={{ 
                width: '100%', 
                height: '8px', 
                bgcolor: 'grey.200',
                borderRadius: '4px',
                overflow: 'hidden',
                mb: 2
              }}
            >
              <Box 
                sx={{ 
                  width: `${Math.min(tempTotalCost / 15 * 100, 100)}%`, 
                  height: '100%', 
                  bgcolor: 'primary.main',
                  transition: 'width 0.5s ease-in-out'
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2,
            width: '100%',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Button 
              onClick={handleCloseIngredientsEditor} 
              color="inherit"
              size="large"
              variant="outlined"
              fullWidth={isMobile}
              sx={{ py: isMobile ? 1.5 : 1 }}
              >
                Cancelar
            </Button>
            <Button 
                onClick={handleSaveIngredients}
              color="primary" 
              variant="contained" 
                disabled={saving}
              size="large"
              fullWidth={isMobile}
              sx={{ py: isMobile ? 1.5 : 1 }}
              >
                {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DeleteIcon color="error" fontSize="large" sx={{ mr: 2 }} />
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar esta hamburguesa?
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          padding: isMobile ? '16px' : '8px 16px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={() => setConfirmDelete(null)} 
            color="inherit"
            variant="outlined"
            size="large"
            sx={{ minWidth: '120px' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              if (confirmDelete) {
                onDelete(confirmDelete);
                setConfirmDelete(null);
              }
            }} 
            color="error" 
            variant="contained"
            size="large"
            sx={{ minWidth: '120px' }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ 
          vertical: isMobile ? 'bottom' : 'bottom', 
          horizontal: isMobile ? 'center' : 'right' 
        }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
              {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}; 