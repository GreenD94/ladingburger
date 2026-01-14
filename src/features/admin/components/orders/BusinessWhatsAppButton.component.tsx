'use client';

import React from 'react';
import { Button, useTheme, useMediaQuery } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { BusinessContact } from '@/features/database/types/index.type';
import { EMPTY_BUSINESS_CONTACT } from '@/features/database/constants/emptyObjects.constants';
import {
  generateBusinessWhatsAppLinkWithMessage,
  messageTemplates,
} from '@/features/admin/utils/whatsapp.util';

interface BusinessWhatsAppButtonProps {
  businessContact: BusinessContact;
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

  const hasWhatsAppLink = businessContact.whatsappLink && businessContact.whatsappLink !== '';

  if (!hasWhatsAppLink) {
    return null;
  }

  const handleClick = () => {
    const link = generateBusinessWhatsAppLinkWithMessage(
      businessContact.whatsappLink,
      templateId,
      orderId,
      customerName
    );

    if (link && link !== '') {
      window.open(link, '_blank');
    } else {
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

