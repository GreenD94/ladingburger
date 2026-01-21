'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from '@/features/shared/styles/PhoneNumberInput.module.css';

interface PhoneNumberInputProps {
  value: string;
  onChange: (phoneNumber: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const PHONE_LENGTH = 11;
const FIXED_DIGITS_COUNT = 2;
const FIRST_DIGIT = '0';
const SECOND_DIGIT = '4';
const PHONE_NUMBER_PREFIX = '04';

export function PhoneNumberInput({
  value,
  onChange,
  disabled = false,
  className = '',
  id,
}: PhoneNumberInputProps) {
  const initialDigits = [FIRST_DIGIT, SECOND_DIGIT, ...Array(9).fill('')];
  const [digits, setDigits] = useState<string[]>(initialDigits);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(PHONE_LENGTH).fill(null));
  const digitsRef = useRef<string[]>(initialDigits);

  useEffect(() => {
    if (value && value.length === PHONE_LENGTH && value.startsWith(PHONE_NUMBER_PREFIX)) {
      const phoneDigits = value.split('');
      const newDigits = [FIRST_DIGIT, SECOND_DIGIT, ...Array(9).fill('')];
      phoneDigits.forEach((digit, index) => {
        if (index >= FIXED_DIGITS_COUNT && index < PHONE_LENGTH) {
          newDigits[index] = digit;
        }
      });
      setDigits(newDigits);
      digitsRef.current = newDigits;
    } else if (!value || value.length === 0) {
      setDigits(initialDigits);
      digitsRef.current = initialDigits;
    }
  }, [value]);

  const handleDigitChange = useCallback(
    (index: number, inputValue: string) => {
      if (index < FIXED_DIGITS_COUNT || disabled) return;

      const digit = inputValue.slice(-1).replace(/\D/g, '');
      if (digit === '') {
        const newDigits = [...digitsRef.current];
        newDigits[index] = '';
        digitsRef.current = newDigits;
        setDigits(newDigits);
        onChange(newDigits.join(''));
        return;
      }

      if (!/^\d$/.test(digit)) return;

      const newDigits = [...digitsRef.current];
      newDigits[index] = digit;
      digitsRef.current = newDigits;
      setDigits(newDigits);
      onChange(newDigits.join(''));

      if (index < PHONE_LENGTH - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [disabled, onChange]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (index < FIXED_DIGITS_COUNT || disabled) return;

      if (e.key === 'Backspace' && digitsRef.current[index] === '' && index > FIXED_DIGITS_COUNT) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }
    },
    [disabled]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
      if (disabled) return;
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

      if (pastedData.length === 0) return;

      const newDigits = [...digitsRef.current];
      let pasteIndex = index;

      for (let i = 0; i < pastedData.length && pasteIndex < PHONE_LENGTH; i++) {
        if (pasteIndex < FIXED_DIGITS_COUNT) {
          if (pastedData[i] === (pasteIndex === 0 ? FIRST_DIGIT : SECOND_DIGIT)) {
            pasteIndex++;
          } else {
            break;
          }
        } else {
          newDigits[pasteIndex] = pastedData[i];
          pasteIndex++;
        }
      }

      digitsRef.current = newDigits;
      setDigits(newDigits);
      onChange(newDigits.join(''));

      const nextFocusIndex = Math.min(pasteIndex, PHONE_LENGTH - 1);
      if (inputRefs.current[nextFocusIndex]) {
        inputRefs.current[nextFocusIndex]?.focus();
      }
    },
    [disabled, onChange]
  );

  return (
    <div className={`${styles.container} ${className}`} id={id}>
      {digits.map((digit, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={index < FIXED_DIGITS_COUNT || disabled}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(e, index)}
            className={`${styles.digitInput} ${index < FIXED_DIGITS_COUNT ? styles.digitInputFixed : ''}`}
            aria-label={`Dígito ${index + 1} del número de teléfono`}
          />
          {index === 3 && <span className={styles.separator}>-</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

