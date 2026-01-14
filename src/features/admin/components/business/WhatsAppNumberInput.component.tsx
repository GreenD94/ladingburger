'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { getBusinessContact } from '@/features/database/actions/businessContacts/getBusinessContact.action';
import { updateBusinessContact } from '@/features/database/actions/businessContacts/updateBusinessContact.action';

const extractPhoneFromLink = (link: string): string => {
  if (!link || link === '') return '';
  if (link.includes('wa.me/')) {
    const match = link.match(/wa\.me\/(\d+)/);
    return match ? match[1] : '';
  }
  return link.replace(/\D/g, '');
};

const formatPhoneToLink = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone === '') return '';
  return `https://wa.me/${cleanPhone}`;
};

export function WhatsAppNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinessContact = async () => {
      try {
        setIsLoading(true);
        const contact = await getBusinessContact();
        const phone = extractPhoneFromLink(contact.whatsappLink);
        setPhoneNumber(phone);
      } catch (err) {
        setError('Error al cargar el número de WhatsApp');
        console.error('Error fetching business contact:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessContact();
  }, []);

  const handleSave = async () => {
    if (phoneNumber.trim() === '') {
      setError('Por favor ingresa un número de WhatsApp');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('El número de WhatsApp debe tener al menos 10 dígitos');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSaveSuccess(false);

      const whatsappLink = formatPhoneToLink(phoneNumber);
      const result = await updateBusinessContact({ whatsappLink });

      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || 'Error al guardar el número de WhatsApp');
      }
    } catch (err) {
      setError('Error al guardar el número de WhatsApp');
      console.error('Error saving WhatsApp number:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setError('');
    setSaveSuccess(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Número de WhatsApp
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Ingresa el número de WhatsApp del negocio. Los clientes podrán contactarte desde el menú.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Número de WhatsApp"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="584125188174"
          helperText="Ingresa el número con código de país (ej: 584125188174)"
          error={error !== ''}
          disabled={isSaving}
        />
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaveSuccess(false)}>
          Número de WhatsApp guardado exitosamente
        </Alert>
      )}
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isSaving || phoneNumber.trim() === ''}
        sx={{ mt: 1 }}
      >
        {isSaving ? <CircularProgress size={24} /> : 'Guardar'}
      </Button>
    </Box>
  );
}

