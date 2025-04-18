'use client';

import React, { useState, useRef, useCallback, memo } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
}

interface DigitInputProps {
  value: string;
  index: number;
  inputRef: (el: HTMLInputElement | null) => void;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent) => void;
  disabled: boolean;
}

// Memoized DigitInput component to prevent unnecessary re-renders
const DigitInput = memo(({ 
  value, 
  index, 
  inputRef, 
  onChange, 
  onKeyDown,
  disabled
}: DigitInputProps) => (
  <input
    ref={inputRef}
    value={value}
    onChange={(e) => onChange(index, e.target.value)}
    onKeyDown={(e) => onKeyDown(index, e)}
    type="text"
    maxLength={1}
    disabled={disabled}
    style={{ 
      width: '48px',
      height: '48px',
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '8px',
      border: '1px solid #FFE0B2',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: disabled ? '#FFF8F0' : 'white',
      color: disabled ? '#FF6B00' : '#2C1810',
      fontWeight: disabled ? 'bold' : 'normal',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#FF6B00';
      e.target.style.boxShadow = '0 0 0 2px rgba(255,107,0,0.2)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#FFE0B2';
      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    }}
  />
));

DigitInput.displayName = 'DigitInput';

export const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit }) => {
  const [digits, setDigits] = useState<string[]>(['0', '4', ...Array(9).fill('')]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(11).fill(null));
  const digitsRef = useRef<string[]>(['0', '4', ...Array(9).fill('')]);

  const handleDigitChange = useCallback((index: number, value: string) => {
    // Skip first two digits as they are fixed
    if (index < 2) return;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the digit in both state and ref
    const newDigits = [...digitsRef.current];
    newDigits[index] = value;
    digitsRef.current = newDigits;
    setDigits(newDigits);

    // Move to next input if a digit was entered
    if (value && index < 10) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    // Skip first two digits as they are fixed
    if (index < 2) return;

    if (e.key === 'Backspace' && !digitsRef.current[index] && index > 0) {
      // If backspace is pressed on an empty input, move to the previous input
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '500px',
        p: 4,
        borderRadius: '16px',
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#2C1810',
        }}
      >
        Consulta tus pedidos
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          textAlign: 'center',
          lineHeight: 1.6,
          color: '#FF6B00',
          fontWeight: 600,
          fontSize: '1.1rem',
          px: 2,
          py: 2,
          bgcolor: '#FFF8F0',
          borderRadius: '12px',
          border: '1px solid #FFE0B2',
        }}
      >
        Ingresa tu número de teléfono para ver el historial de tus pedidos
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          mb: 2,
          flexWrap: 'wrap',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {digits.map((digit, index) => (
          <DigitInput
            key={index}
            value={digit}
            index={index}
            inputRef={el => inputRefs.current[index] = el}
            onChange={handleDigitChange}
            onKeyDown={handleKeyDown}
            disabled={index < 2}
          />
        ))}
      </Box>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: '#FF6B00',
          fontWeight: 'medium',
          fontSize: '0.9rem',
          mb: 3,
        }}
      >
        Formato: 0412-1234567
      </Typography>
      <Button
        fullWidth
        variant="contained"
        onClick={() => onSubmit(digits.join(''))}
        disabled={digits.join('').length !== 11}
        sx={{
          py: 1.5,
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: '1rem',
          bgcolor: '#FF6B00',
          color: 'white',
          '&:hover': {
            bgcolor: '#FF8533',
          },
          '&.Mui-disabled': {
            bgcolor: '#FFE0B2',
            color: 'white'
          }
        }}
      >
        Ver mis pedidos
      </Button>
    </Box>
  );
}; 