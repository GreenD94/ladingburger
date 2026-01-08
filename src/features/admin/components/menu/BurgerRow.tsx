'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Burger } from '@/features/database/types';

interface BurgerRowProps {
  burger: Burger;
  onEdit: (burger: Burger) => void;
  onDelete: (burger: Burger) => void;
}

export const BurgerRow: React.FC<BurgerRowProps> = ({
  burger,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Avatar
            src={burger.image}
            alt={burger.name}
            variant="rounded"
            sx={{
              width: 120,
              height: 120,
              objectFit: 'cover',
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h6" component="h3">
                  {burger.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {burger.description}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={burger.isAvailable ? 'Disponible' : 'No Disponible'}
                  color={burger.isAvailable ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Precio:</strong> ${burger.price.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Categoría:</strong> {burger.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Ingredientes:</strong> {burger.ingredients.length}
              </Typography>
            </Stack>

            {burger.ingredients.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                {burger.ingredients.slice(0, 5).map((ingredient, index) => (
                  <Chip
                    key={index}
                    label={ingredient}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {burger.ingredients.length > 5 && (
                  <Chip
                    label={`+${burger.ingredients.length - 5} más`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => onEdit(burger)}
              size="small"
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(burger)}
              size="small"
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

