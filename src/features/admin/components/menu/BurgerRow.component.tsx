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
import { Burger } from '@/features/database/types/index.type';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';

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
  const { t } = useLanguage();
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
            alignItems: { xs: 'flex-start', sm: 'flex-start' },
          }}
        >
          <Avatar
            src={burger.image}
            alt={burger.name}
            variant="rounded"
            sx={{
              width: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 },
              objectFit: 'cover',
              alignSelf: { xs: 'center', sm: 'flex-start' },
            }}
          />

          <Box sx={{ flex: 1, width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'flex-start' },
                mb: 1,
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {burger.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                >
                  {burger.description}
                </Typography>
              </Box>
              <Chip
                label={burger.isAvailable ? 'Disponible' : 'No Disponible'}
                color={burger.isAvailable ? 'success' : 'default'}
                size="small"
                sx={{ alignSelf: { xs: 'flex-start', sm: 'flex-start' } }}
              />
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 0.5, sm: 2 }}
              sx={{ mt: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                <strong>Precio:</strong> ${burger.price.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                <strong>Categoría:</strong> {burger.category}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                <strong>Ingredientes:</strong> {burger.ingredients.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                <strong>{t('estimatedTime')}:</strong> {burger.estimatedPrepTime ? `${burger.estimatedPrepTime} ${t('minutes')}` : 'N/A'}
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
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                ))}
                {burger.ingredients.length > 5 && (
                  <Chip
                    label={`+${burger.ingredients.length - 5} más`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                )}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 1, sm: 0 },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => onEdit(burger)}
              size="small"
              sx={{ 
                flex: { xs: 1, sm: 'none' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(burger)}
              size="small"
              sx={{ 
                flex: { xs: 1, sm: 'none' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

