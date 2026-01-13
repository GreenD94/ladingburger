'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import {
  generateCustomerWhatsAppLink,
  messageTemplates,
  MessageTemplate,
} from '@/features/admin/utils/whatsapp';

interface WhatsAppActionsProps {
  phoneNumber: string;
  orderId: string;
  customerName?: string;
  disabled?: boolean;
}

export const WhatsAppActions: React.FC<WhatsAppActionsProps> = ({
  phoneNumber,
  orderId,
  customerName,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Don't show if phone is invalid
  if (!phoneNumber || phoneNumber.trim() === '') {
    return null;
  }

  const handleOpen = () => {
    setOpen(true);
    setSelectedTemplate(messageTemplates[0]?.id || '');
    setCustomMessage('');
    setUseCustom(false);
  };

  const handleSend = () => {
    let message = '';
    
    if (useCustom && customMessage.trim()) {
      message = customMessage.trim();
    } else if (selectedTemplate) {
      const template = messageTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        message = template.generate(orderId, customerName);
      }
    }

    if (message) {
      const link = generateCustomerWhatsAppLink(phoneNumber, selectedTemplate, orderId, customerName);
      if (link) {
        // Replace message if custom
        const finalLink = useCustom
          ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
          : link;
        window.open(finalLink, '_blank');
      }
      setOpen(false);
    }
  };

  const selectedTemplateObj = messageTemplates.find(t => t.id === selectedTemplate);
  const previewMessage = useCustom
    ? customMessage
    : selectedTemplateObj
    ? selectedTemplateObj.generate(orderId, customerName)
    : '';

  return (
    <>
      <Button
        variant="contained"
        startIcon={<WhatsAppIcon />}
        onClick={handleOpen}
        disabled={disabled}
        sx={{
          bgcolor: '#25D366',
          color: 'white',
          '&:hover': { bgcolor: '#128C7E' },
          minHeight: isMobile ? 44 : 36,
        }}
      >
        WhatsApp
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Enviar Mensaje por WhatsApp</Typography>
            <IconButton
              onClick={() => setOpen(false)}
              size="small"
              sx={{ minWidth: isMobile ? 44 : 40, minHeight: isMobile ? 44 : 40 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Template Selector */}
            <FormControl fullWidth>
              <InputLabel>Plantilla de Mensaje</InputLabel>
              <Select
                value={useCustom ? 'custom' : selectedTemplate}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setUseCustom(true);
                  } else {
                    setUseCustom(false);
                    setSelectedTemplate(e.target.value);
                  }
                }}
                label="Plantilla de Mensaje"
                sx={{ minHeight: isMobile ? 56 : 40 }}
              >
                {messageTemplates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.label}
                  </MenuItem>
                ))}
                <MenuItem value="custom">Mensaje Personalizado</MenuItem>
              </Select>
            </FormControl>

            {/* Custom Message Input */}
            {useCustom && (
              <TextField
                label="Mensaje Personalizado"
                multiline
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                fullWidth
                sx={{ minHeight: isMobile ? 120 : 100 }}
              />
            )}

            {/* Preview */}
            {previewMessage && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                }}
              >
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Vista Previa:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {previewMessage}
                </Typography>
              </Box>
            )}

            {/* Customer Info */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Enviar a: {phoneNumber}
              </Typography>
              {customerName && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Cliente: {customerName}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{ minHeight: isMobile ? 44 : 36 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            variant="contained"
            startIcon={<WhatsAppIcon />}
            disabled={!previewMessage.trim()}
            sx={{
              bgcolor: '#25D366',
              color: 'white',
              '&:hover': { bgcolor: '#128C7E' },
              minHeight: isMobile ? 44 : 36,
            }}
          >
            Abrir WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

