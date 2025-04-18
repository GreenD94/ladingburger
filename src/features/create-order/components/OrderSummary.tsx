import React from 'react';
import { Box, Typography, Card, CardContent, IconButton, Chip, Stack, TextField, Button, Divider, useTheme, useMediaQuery } from '@mui/material';
import { CustomizedBurger } from '../types/order.types';
import DeleteIcon from '@mui/icons-material/Delete';

interface OrderSummaryProps {
  selectedBurgers: CustomizedBurger[];
  onRemoveIngredient: (burgerIndex: number, ingredient: string) => void;
  onAddIngredient: (burgerIndex: number, ingredient: string) => void;
  onAddNote: (burgerIndex: number, note: string) => void;
  onRemoveBurger: (index: number) => void;
  onSubmitOrder: () => void;
  loading: boolean;
}

// Helper function to format prices with exactly 2 decimal places
const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedBurgers,
  onRemoveIngredient,
  onAddIngredient,
  onAddNote,
  onRemoveBurger,
  onSubmitOrder,
  loading
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate order summary
  const totalBurgers = selectedBurgers.length;
  const totalPrice = selectedBurgers.reduce((sum, burger) => sum + burger.price, 0);
  const burgersByType = selectedBurgers.reduce((acc, burger) => {
    acc[burger.name] = (acc[burger.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#2C1810' }}>
        Tu Pedido
      </Typography>

      {selectedBurgers.length > 0 && (
        <>
          {/* Price Summary */}
          <Card sx={{ mb: 3, bgcolor: '#FFF8F0', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#2C1810', mb: 2, fontWeight: 600 }}>
                Resumen del Pedido
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ color: '#2C1810', fontWeight: 500 }}>
                  Total Hamburguesas:
                </Typography>
                <Typography variant="body1" sx={{ color: '#2C1810', fontWeight: 600 }}>
                  {totalBurgers}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, bgcolor: '#FFE0B2' }} />

              {Object.entries(burgersByType).map(([name, quantity]) => {
                const burger = selectedBurgers.find(b => b.name === name);
                return (
                  <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#2C1810', fontWeight: 500 }}>
                      {name} x{quantity}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2C1810', fontWeight: 600 }}>
                      ${formatPrice((burger?.price || 0) * quantity)}
                    </Typography>
                  </Box>
                );
              })}

              <Divider sx={{ my: 1, bgcolor: '#FFE0B2' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6" sx={{ color: '#2C1810', fontWeight: 600 }}>
                  Total a Pagar:
                </Typography>
                <Typography variant="h6" sx={{ color: '#FF6B00', fontWeight: 700 }}>
                  ${formatPrice(totalPrice)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={onSubmitOrder}
            disabled={loading}
            sx={{
              bgcolor: '#FF6B00',
              '&:hover': { bgcolor: '#E55C00' },
              py: 2,
              mt: 0,
              mb: 2,
              borderRadius: '50px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? 'Procesando...' : 'Completar Pedido'}
          </Button>

          {/* Selected Burgers List */}
          <Box 
            sx={{ 
              ...(isMobile ? {
                display: 'flex',
                overflowX: 'auto',
                gap: 2,
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#FFF8F0',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#FF6B00',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#E55C00',
                  },
                },
              } : {
                height: 'calc(4 * 250px)',
                overflowY: 'auto',
                pr: 2,
                '&::-webkit-scrollbar': {
                  width: '12px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#FFF8F0',
                  borderRadius: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#FF6B00',
                  borderRadius: '6px',
                  '&:hover': {
                    background: '#E55C00',
                  },
                },
              })
            }}
          >
            <Box sx={{ 
              ...(isMobile ? {
                display: 'flex',
                gap: 2,
                minWidth: 'min-content',
              } : {
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              })
            }}>
              {selectedBurgers.map((burger, index) => (
                <Card 
                  key={index} 
                  sx={{ 
                    ...(isMobile ? {
                      minWidth: '280px',
                      flexShrink: 0,
                    } : {}),
                    borderRadius: 2 
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#2C1810' }}>{burger.name}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      {burger.ingredients.map((ingredient) => (
                        <Chip
                          key={ingredient}
                          label={ingredient}
                          size="small"
                          onDelete={
                            !burger.removedIngredients.includes(ingredient)
                              ? () => onRemoveIngredient(index, ingredient)
                              : undefined
                          }
                          onClick={
                            burger.removedIngredients.includes(ingredient)
                              ? () => onAddIngredient(index, ingredient)
                              : undefined
                          }
                          sx={{
                            bgcolor: burger.removedIngredients.includes(ingredient)
                              ? '#FFE0B2'
                              : '#FFF8F0',
                            color: '#2C1810',
                            textDecoration: burger.removedIngredients.includes(ingredient)
                              ? 'line-through'
                              : 'none',
                          }}
                        />
                      ))}
                    </Stack>
                    <TextField
                      fullWidth
                      label="Nota para esta hamburguesa"
                      variant="outlined"
                      size="small"
                      value={burger.note || ''}
                      onChange={(e) => onAddNote(index, e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#FF6B00' }}>
                        ${formatPrice(burger.price)}
                      </Typography>
                      <IconButton
                        onClick={() => onRemoveBurger(index)}
                        sx={{ color: '#FF6B00' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </>
      )}

      {selectedBurgers.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          Selecciona hamburguesas del menú para comenzar tu pedido
        </Typography>
      )}
    </Box>
  );
}; 