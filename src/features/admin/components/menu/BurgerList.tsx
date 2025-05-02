'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { Burger } from '@/features/database/types/burger';
import { INGREDIENT_COSTS, calculateTotalCost, formatIngredientCosts } from '@/features/admin/utils/ingredientCosts';
import { useIngredients } from '@/features/admin/hooks/useIngredients';

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
  onUpdateIngredients?: (burgerId: string, ingredients: string[], ingredientCosts?: Record<string, number>) => Promise<{ success: boolean; error?: string }>;
  onUpdatePrice?: (burgerId: string, price: number) => Promise<{ success: boolean; error?: string }>;
}

export const BurgerList: React.FC<BurgerListProps> = ({ 
  burgers, 
  onEdit, 
  onDelete, 
  onUpdateIngredients,
  onUpdatePrice
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [editingIngredientsFor, setEditingIngredientsFor] = useState<string | null>(null);
  const [tempIngredients, setTempIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [customIngredientPrice, setCustomIngredientPrice] = useState<number>(0);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [localBurgers, setLocalBurgers] = useState<Burger[]>(burgers);
  // Estado para mantener los costos personalizados
  const [customIngredientCosts, setCustomIngredientCosts] = useState<Record<string, number>>({});
  const { ingredients: dbIngredients, loading: loadingIngredients } = useIngredients();
  const getDbCost = (ingredient: string) => dbIngredients.find(i => i.name === ingredient)?.cost ?? 0;

  // Calcular el costo total de los ingredientes temporales utilizando costos personalizados
  const tempTotalCost = useMemo(() => {
    return tempIngredients.reduce((total, ingredient) => {
      // Primero buscar en costos personalizados, luego en INGREDIENT_COSTS
      const cost = customIngredientCosts[ingredient] !== undefined 
        ? customIngredientCosts[ingredient]
        : getDbCost(ingredient);
      return total + cost;
    }, 0);
  }, [tempIngredients, customIngredientCosts, getDbCost]);

  // Obtener la hamburguesa que se está editando actualmente (si hay alguna)
  const currentBurger = editingIngredientsFor 
    ? localBurgers.find(b => b._id && b._id.toString() === editingIngredientsFor) 
    : null;

  // Función auxiliar para obtener el costo de un ingrediente
  const getIngredientCost = (ingredient: string, burgerSpecificCosts?: Record<string, number> | null) => {
    // Buscar primero en los costos específicos de la hamburguesa si se proporcionaron
    if (burgerSpecificCosts && burgerSpecificCosts[ingredient] !== undefined) {
      return burgerSpecificCosts[ingredient];
    } 
    // Luego buscar en los costos personalizados locales
    else if (customIngredientCosts[ingredient] !== undefined) {
      return customIngredientCosts[ingredient];
    } 
    // Finalmente usar los costos predefinidos
    else {
      return getDbCost(ingredient);
    }
  };

  // Abrir el diálogo de edición de ingredientes
  const handleOpenIngredientsEditor = (burger: Burger) => {
    if (burger._id) {
      setEditingIngredientsFor(burger._id.toString());
      setTempIngredients([...burger.ingredients]);
      setTempPrice(burger.price);
      
      // Cargar los costos personalizados de ingredientes si existen
      // Usar type assertion para evitar errores de linter
      const burgerWithCosts = burger as Burger & { ingredientCosts?: Record<string, number> };
      if (burgerWithCosts.ingredientCosts) {
        console.log('Cargando costos personalizados:', burgerWithCosts.ingredientCosts);
        setCustomIngredientCosts(burgerWithCosts.ingredientCosts);
      } else {
        // Limpiar los costos personalizados si no hay ninguno
        setCustomIngredientCosts({});
      }
      
      setCustomIngredientPrice(0);
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
    setTempPrice(0);
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
      
      // Filtrar el objeto customIngredientCosts para incluir solo los ingredientes que están en tempIngredients
      const relevantCosts: Record<string, number> = {};
      tempIngredients.forEach(ingredient => {
        if (customIngredientCosts[ingredient] !== undefined) {
          relevantCosts[ingredient] = customIngredientCosts[ingredient];
        }
      });
      
      console.log('Guardando ingredientes con costos personalizados:', relevantCosts);
      
      const result = await onUpdateIngredients(
        editingIngredientsFor, 
        tempIngredients,
        relevantCosts // Enviar los costos personalizados
      );
      
      // Si hay cambios en el precio, guardamos esos también
      if (result.success && onUpdatePrice && editingIngredientsFor) {
        await handleSavePrice();
      }
      
      if (result.success) {
        // Actualizar también los costos de ingredientes a nivel local
        setLocalBurgers(prevBurgers => 
          prevBurgers.map(burger => 
            burger._id && burger._id.toString() === editingIngredientsFor
              ? {...burger, ingredients: tempIngredients, ingredientCosts: relevantCosts}
              : burger
          )
        );
        
        showSnackbar('Hamburguesa actualizada con éxito', 'success');
        handleCloseIngredientsEditor();
      } else {
        showSnackbar(`Error: ${result.error || 'No se pudo actualizar la hamburguesa'}`, 'error');
      }
    } catch (error) {
      showSnackbar('Error al guardar los cambios', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Guardar los cambios en el precio
  const handleSavePrice = async () => {
    if (!editingIngredientsFor || !onUpdatePrice) {
      return { success: false, error: 'No se puede actualizar el precio' };
    }

    try {
      const result = await onUpdatePrice(
        editingIngredientsFor,
        tempPrice
      );
      
      // Actualizamos el precio a nivel local inmediatamente
      if (result.success) {
        setLocalBurgers(prevBurgers => 
          prevBurgers.map(burger => 
            burger._id && burger._id.toString() === editingIngredientsFor
              ? {...burger, price: tempPrice}
              : burger
          )
        );
      }

      return result;
    } catch (error) {
      console.error('Error al actualizar el precio:', error);
      return { success: false, error: 'Error al actualizar el precio' };
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
    
    const trimmedIngredient = customIngredient.trim();
    
    if (!tempIngredients.includes(trimmedIngredient)) {
      // Añadir a los ingredientes temporales
      setTempIngredients(prev => [...prev, trimmedIngredient]);
      
      // Guardar el costo personalizado en el estado
      setCustomIngredientCosts(prev => ({
        ...prev,
        [trimmedIngredient]: customIngredientPrice
      }));
      
      console.log(`Añadido ingrediente personalizado: ${trimmedIngredient} con precio: ${customIngredientPrice}`);
      
      // Limpiar los campos de entrada
      setCustomIngredient('');
      setCustomIngredientPrice(0);
    }
  };

  // Eliminar un ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    setTempIngredients(prev => prev.filter(ing => ing !== ingredient));
  };

  // Función para actualizar ingredientes y costos
  const handleUpdateBurgerCosts = async (burgerId: string, ingredients: string[], newOtherCosts: number, price?: number) => {
    // Actualización local inmediata
    setLocalBurgers(prevBurgers => 
      prevBurgers.map(burger => 
        burger._id && burger._id.toString() === burgerId 
          ? {...burger, ingredients, otherCosts: newOtherCosts, price: price || burger.price}
          : burger
      )
    );
    
    // Actualización en base de datos (en paralelo)
    try {
      if (onUpdateIngredients) {
        await onUpdateIngredients(burgerId, ingredients);
      }
    } catch (error) {
      console.error("Error al actualizar en base de datos:", error);
    }
  };

  // Función para renderizar una tarjeta de hamburguesa según la imagen
  const renderBurgerCard = (burger: Burger, index: number) => {
    // Type assertion para acceder a ingredientCosts
    const burgerWithCosts = burger as Burger & { ingredientCosts?: Record<string, number> };
    
    // Calcular el costo total de los ingredientes usando también los costos personalizados
    const ingredientsCost = burger.ingredients.reduce((total, ingredient) => {
      // Buscar primero en los costos personalizados de la hamburguesa específica
      if (burgerWithCosts.ingredientCosts && burgerWithCosts.ingredientCosts[ingredient] !== undefined) {
        return total + burgerWithCosts.ingredientCosts[ingredient];
      } 
      // Luego buscar en los costos personalizados locales
      else if (customIngredientCosts[ingredient] !== undefined) {
        return total + customIngredientCosts[ingredient];
      } 
      // Finalmente usar los costos predefinidos
      else {
        return total + getDbCost(ingredient);
      }
    }, 0);
    
    // Obtener otros costos (si existen) y convertirlo a número
    const otherCosts = Number(burger.otherCosts || 0);
    
    // Calcular el costo total incluyendo otros costos 
    const totalCost = ingredientsCost + otherCosts;
    
    // Formatear los costos de ingredientes para mostrar
    const ingredientCostsText = burger.ingredients.slice(0, 3)
      .map(ingredient => {
        // Buscar primero en los costos personalizados de la hamburguesa específica
        if (burgerWithCosts.ingredientCosts && burgerWithCosts.ingredientCosts[ingredient] !== undefined) {
          return `${ingredient}:$${burgerWithCosts.ingredientCosts[ingredient].toFixed(1)}`;
        } 
        // Luego buscar en los costos personalizados locales
        else if (customIngredientCosts[ingredient] !== undefined) {
          return `${ingredient}:$${customIngredientCosts[ingredient].toFixed(1)}`;
        } 
        // Finalmente usar los costos predefinidos
        else {
          const cost = getDbCost(ingredient);
          return `${ingredient}:$${cost.toFixed(1)}`;
        }
      })
      .join(', ');
    
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
            height={isMobile ? "200" : "260"}
            image={burger.image || 'https://via.placeholder.com/400x300?text=Hamburguesa'}
            alt={burger.name}
            sx={{ 
              objectFit: 'cover',
              objectPosition: 'center',
              backgroundColor: '#fafafa',
              width: '100%',
              maxHeight: isMobile ? '200px' : '260px',
              p: 0
            }}
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
              {burger.ingredients.slice(0, isMobile ? 3 : 5).map((ingredient, index) => {
                const cost = getIngredientCost(ingredient, burgerWithCosts.ingredientCosts);
                return (
                  <Chip 
                    key={index} 
                    label={`${ingredient} ($${cost.toFixed(1)})`}
                    size="small" 
                    variant="outlined"
                    color="primary"
                    sx={{ margin: '2px' }}
                  />
                );
              })}
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
            <Box>
              <Typography variant="caption" sx={{ display: 'block' }}>
                <strong>Costos de producción:</strong>
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', pl: 1 }}>
                • Ingredientes: {ingredientCostsText}{burger.ingredients.length > 3 ? '...' : ''}
              </Typography>
              {otherCosts > 0 && (
                <Typography variant="caption" sx={{ display: 'block', pl: 1 }}>
                  • Adicionales: {"$" + Number(otherCosts).toFixed(2)}
                </Typography>
              )}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0.5
            }}>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Costo total: ${Number(totalCost).toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Precio venta: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>${burger.price.toFixed(2)}</span>
                </Typography>
              </Box>
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

  // Sincronizar localBurgers con las props burgers
  useEffect(() => {
    setLocalBurgers(burgers);
  }, [burgers]);

  return (
    <>
      <Grid container spacing={isMobile ? 2 : 3}>
        {localBurgers.map((burger, index) => renderBurgerCard(burger, index))}
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
                  const cost = getIngredientCost(ingredient, null);
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
                alignItems: 'center',
                mb: 2
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

            {/* Campo para editar el precio de venta */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" color="primary" fontWeight="medium" gutterBottom>
                Precio de venta al público:
              </Typography>
              <TextField
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(Number(e.target.value))}
                placeholder="Precio de venta"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ 
                  "& .MuiOutlinedInput-root": {
                    borderWidth: "2px",
                    borderColor: theme.palette.primary.main,
                    "&:hover": {
                      borderColor: theme.palette.primary.dark
                    }
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Este precio se mostrará a los clientes y es independiente del costo de producción.
              </Typography>
            </Box>
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
              const cost = getDbCost(ingredient);
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
              const cost = getDbCost(ingredient);
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
              const cost = getDbCost(ingredient);
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
              const cost = getDbCost(ingredient);
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
            
            <TextField
              type="number"
              value={customIngredientPrice}
              onChange={(e) => setCustomIngredientPrice(Number(e.target.value))}
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
          {/* Solo mostrar mensajes que NO sean de eliminación */}
          {snackbarMessage.includes('eliminad') ? null : snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}; 