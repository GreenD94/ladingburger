'use client';

import React from 'react';
import { Button, useTheme, useMediaQuery } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { BusinessContact } from '@/features/database/types';
import {
  generateBusinessWhatsAppLinkWithMessage,
  messageTemplates,
} from '@/features/admin/utils/whatsapp';

interface BusinessWhatsAppButtonProps {
  businessContact: BusinessContact | null;
  orderId: string;
  customerName?: string;
  templateId?: string;
  label?: string;
  disabled?: boolean;
}

export const BusinessWhatsAppButton: React.FC<BusinessWhatsAppButtonProps> = ({
  businessContact,
  orderId,
  customerName,
  templateId = 'orderConfirmed',
  label = 'WhatsApp Negocio',
  disabled = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Don't show if business WhatsApp is not configured
  if (!businessContact?.whatsappLink) {
    return null;
  }

  const handleClick = () => {
    const link = generateBusinessWhatsAppLinkWithMessage(
      businessContact.whatsappLink,
      templateId,
      orderId,
      customerName
    );

    if (link) {
      window.open(link, '_blank');
    } else {
      // Fallback: just open business WhatsApp without message
      window.open(businessContact.whatsappLink, '_blank');
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<WhatsAppIcon />}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        borderColor: '#25D366',
        color: '#25D366',
        '&:hover': {
          borderColor: '#128C7E',
          bgcolor: 'rgba(37, 211, 102, 0.1)',
        },
        minHeight: isMobile ? 44 : 36,
      }}
    >
      {label}
    </Button>
  );
};

