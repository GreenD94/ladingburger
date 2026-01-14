'use client';

import { useState } from 'react';
import { 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface InfoModalProps {
  title: string;
  description: string;
  goodScenario: string;
  badScenario: string;
  formula: string;
  dataSources: string[];
}

export default function InfoModal({ 
  title, 
  description, 
  goodScenario, 
  badScenario, 
  formula, 
  dataSources 
}: InfoModalProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton 
        onClick={handleOpen}
        size="small"
        sx={{ 
          ml: 1,
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText
          }
        }}
        title="Más información"
      >
        <InfoIcon />
      </IconButton>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          {title}
        </DialogTitle>
        
        <DialogContent dividers sx={{ 
          backgroundColor: theme.palette.background.default,
          '& .MuiDivider-root': {
            borderColor: theme.palette.divider,
            margin: '1rem 0'
          }
        }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 'bold'
            }}>
              Descripción
            </Typography>
            <Typography variant="body1" sx={{ 
              color: theme.palette.text.secondary,
              lineHeight: 1.6
            }}>
              {description}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 'bold'
            }}>
              Escenarios
            </Typography>
            <Box sx={{ 
              backgroundColor: theme.palette.success.light + '10',
              p: 2,
              borderRadius: 1,
              mb: 2
            }}>
              <Typography variant="subtitle1" sx={{ 
                color: theme.palette.success.main,
                fontWeight: 'bold',
                mb: 1
              }}>
                Buen escenario:
              </Typography>
              <Typography variant="body1" sx={{ 
                color: theme.palette.text.secondary,
                lineHeight: 1.6
              }}>
                {goodScenario}
              </Typography>
            </Box>
            <Box sx={{ 
              backgroundColor: theme.palette.error.light + '10',
              p: 2,
              borderRadius: 1
            }}>
              <Typography variant="subtitle1" sx={{ 
                color: theme.palette.error.main,
                fontWeight: 'bold',
                mb: 1
              }}>
                Mal escenario:
              </Typography>
              <Typography variant="body1" sx={{ 
                color: theme.palette.text.secondary,
                lineHeight: 1.6
              }}>
                {badScenario}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 'bold'
            }}>
              Fórmula Matemática
            </Typography>
            <Box sx={{ 
              backgroundColor: theme.palette.grey[100],
              p: 2,
              borderRadius: 1
            }}>
              <Typography variant="body1" sx={{ 
                fontFamily: 'monospace',
                color: theme.palette.text.primary,
                lineHeight: 1.6
              }}>
                {formula}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 'bold'
            }}>
              Fuentes de Datos
            </Typography>
            <List dense>
              {dataSources.map((source, index) => (
                <ListItem key={index} sx={{ 
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1,
                  mb: 1,
                  '&:last-child': { mb: 0 }
                }}>
                  <ListItemText 
                    primary={source}
                    primaryTypographyProps={{
                      sx: { 
                        color: theme.palette.text.secondary,
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          backgroundColor: theme.palette.background.paper,
          padding: 2
        }}>
          <Button 
            onClick={handleClose} 
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

