import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Chip } from '@mui/material';
import { Burger } from '@/features/database/types/index.type';

interface MenuSectionProps {
  burgers: Burger[];
  onAddBurger: (burger: Burger) => void;
  isMobile: boolean;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ burgers, onAddBurger, isMobile }) => {
  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          color: '#2C1810',
          mb: 3,
          fontWeight: 'bold',
        }}
      >
        Nuestras Hamburguesas
      </Typography>

      <Box
        sx={{
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: isMobile ? 'none' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
          overflowX: isMobile ? 'auto' : 'visible',
          pb: isMobile ? 2 : 0,
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#FFF8F0',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#FFE0B2',
            borderRadius: '4px',
            '&:hover': {
              background: '#FF6B00',
            },
          },
        }}
      >
        {burgers.map((burger) => (
          <Card
            key={burger._id?.toString()}
            sx={{
              minWidth: isMobile ? '280px' : 'auto',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #FFE0B2',
              borderRadius: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box
              component="img"
              src={burger.image}
              alt={burger.name}
              sx={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
              }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  color: '#2C1810',
                  mb: 1,
                  fontWeight: 'bold',
                }}
              >
                {burger.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, color: '#2C1810' }}
              >
                {burger.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {burger.ingredients.map((ingredient: string) => (
                  <Chip
                    key={ingredient}
                    label={ingredient}
                    size="small"
                    sx={{
                      bgcolor: '#FFF8F0',
                      color: '#FF6B00',
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                ))}
              </Stack>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FF6B00',
                    fontWeight: 'bold',
                  }}
                >
                  ${burger.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => onAddBurger(burger)}
                  sx={{
                    bgcolor: '#FF6B00',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#FF8533',
                    },
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
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

