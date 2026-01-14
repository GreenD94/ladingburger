'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, useTheme, Paper, Divider } from '@mui/material';
import { BusinessContact } from '@/features/database/types/index.type';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Payment as PaymentIcon, WhatsApp as WhatsAppIcon, Info as InfoIcon } from '@mui/icons-material';

interface PaymentInfoDialogProps {
  open: boolean;
  onClose: () => void;
  businessContact: BusinessContact;
}

export const PaymentInfoDialog: React.FC<PaymentInfoDialogProps> = ({
  open,
  onClose,
  businessContact,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#FF6B00',
          color: 'white',
          textAlign: 'center',
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <PaymentIcon />
        Información de Pago
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 3 }}>
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <InfoIcon sx={{ color: '#FF6B00' }} />
            Transferencia Bancaria
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary, mb: 1 }}
              >
                Banco
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 'medium',
                }}
              >
                Banco de Venezuela
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary, mb: 1 }}
              >
                Número de Cuenta
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 'medium',
                  fontFamily: 'monospace',
                }}
              >
                {businessContact.venezuelaPayment.bankAccount}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary, mb: 1 }}
              >
                Cédula
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 'medium',
                  fontFamily: 'monospace',
                }}
              >
                {businessContact.venezuelaPayment.documentNumber}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <InfoIcon sx={{ color: '#FF6B00' }} />
            Tasa de Cambio
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#FF6B00',
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              1 USD = 35.5 Bs
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: 'block',
              }}
            >
              Actualizado: {format(new Date(), 'PPP', { locale: es })}
            </Typography>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: '#FFF8F0',
            borderRadius: 2,
            border: '1px solid #FF6B00',
            mt: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#FF6B00',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 'medium',
            }}
          >
            <WhatsAppIcon fontSize="small" sx={{ color: '#FF6B00' }} />
            * Una vez realizado el pago, por favor envía el comprobante a través de WhatsApp.
          </Typography>
        </Paper>
      </DialogContent>
      <Divider />
      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: 1,
            px: 3,
            borderColor: '#FF6B00',
            color: '#FF6B00',
            '&:hover': {
              borderColor: '#FF6B00',
              backgroundColor: '#FFF8F0',
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

