'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PRIMARY_GREEN, OFF_WHITE } from '../constants/cartColors.constants';
import { PHONE_INPUT_INSTRUCTIONS } from '../constants/messages.constants';
import { ANIMATION_DURATION_MEDIUM } from '../constants/animations.constants';

interface PhoneInputViewProps {
  onContinue: (phoneNumber: string) => void;
  onGoBack: () => void;
}

const PHONE_LENGTH = 11;
const FIXED_DIGITS = ['0', '4'];

export const PhoneInputView: React.FC<PhoneInputViewProps> = ({ onContinue, onGoBack }) => {
  const [digits, setDigits] = useState<string[]>(Array(PHONE_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setDigits(prev => {
      const newDigits = [...prev];
      newDigits[0] = FIXED_DIGITS[0];
      newDigits[1] = FIXED_DIGITS[1];
      return newDigits;
    });
  }, []);

  useEffect(() => {
    const firstEditableIndex = 2;
    if (inputRefs.current[firstEditableIndex]) {
      inputRefs.current[firstEditableIndex]?.focus();
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 0) return;

    const newDigits = [...digits];
    let pasteIndex = index;
    
    for (let i = 0; i < pastedData.length && pasteIndex < PHONE_LENGTH; i++) {
      if (pasteIndex < 2) {
        if (pastedData[i] === FIXED_DIGITS[pasteIndex]) {
          pasteIndex++;
        } else {
          break;
        }
      } else {
        newDigits[pasteIndex] = pastedData[i];
        pasteIndex++;
      }
    }

    setDigits(newDigits);

    const nextFocusIndex = Math.min(pasteIndex, PHONE_LENGTH - 1);
    if (inputRefs.current[nextFocusIndex]) {
      inputRefs.current[nextFocusIndex]?.focus();
    }
  }, [digits]);

  const handleChange = useCallback((index: number, value: string) => {
    if (index < 2) return;

    const digit = value.slice(-1).replace(/\D/g, '');
    if (digit === '') {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    if (!/^\d$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (index < PHONE_LENGTH - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (index < 2) return;

    if (e.key === 'Backspace' && digits[index] === '' && index > 2) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  }, [digits]);

  const isPhoneComplete = digits.every((digit, index) => {
    if (index < 2) {
      return digit === FIXED_DIGITS[index];
    }
    return digit !== '';
  });

  const handleContinue = () => {
    if (isPhoneComplete) {
      const phoneNumber = digits.join('');
      onContinue(phoneNumber);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '24px',
        paddingRight: 'calc(24px + env(safe-area-inset-right, 0px))',
        animation: `fadeIn ${ANIMATION_DURATION_MEDIUM} ease-out`,
      }}
    >
      <button
        onClick={onGoBack}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          color: OFF_WHITE,
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
          cursor: 'pointer',
          padding: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={OFF_WHITE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '32px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: OFF_WHITE,
            fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            lineHeight: '1.6',
            padding: '0 16px',
          }}
        >
          {PHONE_INPUT_INSTRUCTIONS}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '0 16px',
          }}
        >
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
                disabled={index < 2}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                style={{
                  width: 'clamp(40px, 8vw, 56px)',
                  height: 'clamp(56px, 10vw, 72px)',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  textAlign: 'center',
                  border: `2px solid ${OFF_WHITE}`,
                  borderRadius: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                  backgroundColor: index < 2 ? 'rgba(253, 252, 248, 0.2)' : PRIMARY_GREEN,
                  color: OFF_WHITE,
                  fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
                  fontWeight: 'bold',
                  outline: 'none',
                  cursor: index < 2 ? 'not-allowed' : 'text',
                  opacity: index < 2 ? 0.7 : 1,
                }}
              />
              {index === 3 && (
                <div
                  style={{
                    width: '16px',
                    height: '2px',
                    backgroundColor: OFF_WHITE,
                    opacity: 0.5,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!isPhoneComplete}
          style={{
            width: '100%',
            maxWidth: '448px',
            margin: '0 auto',
            backgroundColor: isPhoneComplete ? OFF_WHITE : 'rgba(253, 252, 248, 0.3)',
            color: isPhoneComplete ? PRIMARY_GREEN : 'rgba(253, 252, 248, 0.5)',
            padding: '24px',
            borderRadius: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            letterSpacing: '-0.025em',
            boxShadow: isPhoneComplete ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
            border: 'none',
            cursor: isPhoneComplete ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => {
            if (isPhoneComplete) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }
          }}
          onMouseLeave={(e) => {
            if (isPhoneComplete) {
              e.currentTarget.style.backgroundColor = OFF_WHITE;
            }
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

