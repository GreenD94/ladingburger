import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';

interface PhoneDialogProps {
  open: boolean;
  phoneNumber: string;
  onClose: () => void;
  onPhoneNumberChange: (value: string) => void;
  onSubmit: () => void;
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

export const PhoneDialog: React.FC<PhoneDialogProps> = ({
  open,
  phoneNumber,
  onClose,
  onPhoneNumberChange,
  onSubmit
}) => {
  const [digits, setDigits] = useState<string[]>(['0', '4', ...Array(9).fill('')]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(11).fill(null));
  const digitsRef = useRef<string[]>(['0', '4', ...Array(9).fill('')]);

  // Initialize digits when dialog opens
  useEffect(() => {
    if (open) {
      const phoneDigits = phoneNumber.split('');
      const newDigits = ['0', '4', ...Array(9).fill('')];
      phoneDigits.forEach((digit, index) => {
        if (index >= 2 && index < 11) {
          newDigits[index] = digit;
        }
      });
      setDigits(newDigits);
      digitsRef.current = newDigits;
    }
  }, [open, phoneNumber, setDigits]);

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
    onPhoneNumberChange(newDigits.join(''));

    // Move to next input if a digit was entered
    if (value && index < 10) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  }, [onPhoneNumberChange]);

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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          maxWidth: '500px',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          color: '#2C1810',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          py: 3,
          borderBottom: '1px solid #FFF8F0',
        }}
      >
        Número de Teléfono
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 4 }}>
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
          Para poder procesar tu pedido y mantenerte informado sobre su estado, necesitamos tu número de teléfono. 
          Te contactaremos para confirmar tu orden y avisarte cuando esté lista.
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
          }}
        >
          Formato: 0412-1234567
        </Typography>
      </DialogContent>
      <DialogActions 
        sx={{ 
          justifyContent: 'center', 
          py: 3,
          px: 3,
          gap: 2,
          borderTop: '1px solid #FFF8F0',
        }}
      >
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            color: '#2C1810',
            borderColor: '#FFE0B2',
            px: 4,
            py: 1,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { 
              bgcolor: '#FFF8F0',
              borderColor: '#FF6B00',
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onClose();
            onSubmit();
          }}
          disabled={digits.join('').length !== 11}
          variant="contained"
          sx={{ 
            bgcolor: '#FF6B00',
            color: 'white',
            px: 4,
            py: 1,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { 
              bgcolor: '#FF8533',
            },
            '&.Mui-disabled': {
              bgcolor: '#FFE0B2',
              color: 'white'
            }
          }}
        >
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 