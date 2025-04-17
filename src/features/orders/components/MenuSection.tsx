import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Chip, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Burger } from '@/features/database/types';

interface MenuSectionProps {
  burgers: Burger[];
  onAddBurger: (burger: Burger) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ burgers, onAddBurger }) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#2C1810' }}>
        Nuestro Menú
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
        {burgers.map((burger) => (
          <Card key={burger._id?.toString()} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="200"
              image={burger.image}
              alt={burger.name}
            />
            <CardContent>
              <Typography variant="h6" sx={{ color: '#2C1810' }}>{burger.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {burger.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {burger.ingredients.map((ingredient) => (
                  <Chip
                    key={ingredient}
                    label={ingredient}
                    size="small"
                    sx={{ bgcolor: '#FFF8F0', color: '#2C1810' }}
                  />
                ))}
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#FF6B00' }}>
                  ${burger.price}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => onAddBurger(burger)}
                  sx={{
                    bgcolor: '#FF6B00',
                    '&:hover': { bgcolor: '#E55C00' }
                  }}
                >
                  Agregar
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}; 