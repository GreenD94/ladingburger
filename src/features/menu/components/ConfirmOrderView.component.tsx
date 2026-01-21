'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext.context';
import { useUser } from '../contexts/UserContext.context';
import { PRIMARY_GREEN, OFF_WHITE } from '../constants/cartColors.constants';
import { ORDER_CONFIRMATION_TITLE } from '../constants/messages.constants';
import { CONFIRM_COUNTDOWN_SECONDS } from '../constants/drawer.constants';
import { ANIMATION_DURATION_MEDIUM } from '../constants/animations.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { CheckeredDivider } from './CheckeredDivider.component';

interface ConfirmOrderViewProps {
  onGoBack: () => void;
  onConfirm: (comment: string) => Promise<void>;
}

const ACCENT_BORDER = 'rgba(253, 252, 248, 0.2)';

export const ConfirmOrderView: React.FC<ConfirmOrderViewProps> = ({ onGoBack, onConfirm }) => {
  const { items, getTotalPrice } = useCart();
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(CONFIRM_COUNTDOWN_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const hasUserName = Boolean(
    user.name && 
    typeof user.name === 'string' && 
    user.name.trim().length > 0
  );
  const formattedPhone = user.phoneNumber !== EMPTY_STRING 
    ? `${user.phoneNumber.slice(0, 4)}-${user.phoneNumber.slice(4, 7)}-${user.phoneNumber.slice(7)}`
    : EMPTY_STRING;

  const handleConfirm = () => {
    setIsCountdownActive(true);
    setCountdown(CONFIRM_COUNTDOWN_SECONDS);
  };

  const handleCancel = () => {
    setIsCountdownActive(false);
    setCountdown(CONFIRM_COUNTDOWN_SECONDS);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };

  const handleSubmit = React.useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(comment);
    } catch (error) {
      console.error('Error confirming order:', error);
      setIsSubmitting(false);
      setIsCountdownActive(false);
      setCountdown(CONFIRM_COUNTDOWN_SECONDS);
    }
  }, [isSubmitting, comment, onConfirm]);

  useEffect(() => {
    if (isCountdownActive && countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsCountdownActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (countdown === 0 && !isSubmitting) {
      handleSubmit();
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isCountdownActive, countdown, isSubmitting, handleSubmit]);

  const totalPrice = getTotalPrice();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: PRIMARY_GREEN,
        animation: `fadeIn ${ANIMATION_DURATION_MEDIUM} ease-out`,
      }}
    >
      <header
        style={{
          paddingTop: '48px',
          paddingBottom: '24px',
          paddingLeft: '24px',
          paddingRight: 'calc(24px + env(safe-area-inset-right, 0px))',
        }}
      >
        <button
          onClick={onGoBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            background: 'none',
            border: 'none',
            color: OFF_WHITE,
            opacity: 0.9,
            cursor: 'pointer',
            padding: '4px',
            transition: 'opacity 0.2s',
            fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.9';
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
          <span>Volver</span>
        </button>
        <h1
          style={{
            color: OFF_WHITE,
            fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
            fontSize: 'clamp(2rem, 5vw, 2.25rem)',
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {ORDER_CONFIRMATION_TITLE}
        </h1>
      </header>

      <CheckeredDivider opacity={0.1} />

      <main
        data-scrollable
        style={{
          flex: 1,
          padding: '32px 24px',
          paddingRight: 'calc(24px + env(safe-area-inset-right, 0px))',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          touchAction: 'pan-y',
        }}
      >
        {(hasUserName || formattedPhone !== EMPTY_STRING) && (
          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {hasUserName && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <label
                  style={{
                    color: OFF_WHITE,
                    fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
                    fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: 0.6,
                  }}
                >
                  Nombre
                </label>
                <div
                  style={{
                    color: OFF_WHITE,
                    fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    borderBottom: `1px solid ${ACCENT_BORDER}`,
                    paddingBottom: '8px',
                  }}
                >
                  {user.name}
                </div>
              </div>
            )}
            {formattedPhone !== EMPTY_STRING && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <label
                  style={{
                    color: OFF_WHITE,
                    fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
                    fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: 0.6,
                  }}
                >
                  Teléfono
                </label>
                <div
                  style={{
                    color: OFF_WHITE,
                    fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    borderBottom: `1px solid ${ACCENT_BORDER}`,
                    paddingBottom: '8px',
                  }}
                >
                  {formattedPhone}
                </div>
              </div>
            )}
          </section>
        )}

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <label
            style={{
              color: OFF_WHITE,
              fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
              fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.6,
            }}
          >
            Tu Pedido
          </label>
          {items.map((item, index) => (
            <div
              key={item.burger._id?.toString() || index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'clamp(1rem, 2.5vw, 1.5rem)',
                padding: '20px',
                border: `1px solid ${ACCENT_BORDER}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3
                  style={{
                    color: OFF_WHITE,
                    fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
                    fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    lineHeight: 1.2,
                    marginBottom: '4px',
                  }}
                >
                  {item.burger.name}
                </h3>
                <p
                  style={{
                    color: OFF_WHITE,
                    fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    opacity: 0.6,
                    marginTop: '4px',
                  }}
                >
                  Precio unit. ${item.burger.price.toFixed(2)}
                </p>
              </div>
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    color: OFF_WHITE,
                    fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                    fontWeight: 900,
                    fontStyle: 'italic',
                  }}
                >
                  {item.quantity}x ${item.burger.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            paddingTop: '16px',
            borderTop: `1px solid ${ACCENT_BORDER}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span
            style={{
              color: OFF_WHITE,
              fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 900,
              fontStyle: 'italic',
            }}
          >
            Total
          </span>
          <span
            style={{
              color: OFF_WHITE,
              fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: 900,
              fontStyle: 'italic',
            }}
          >
            ${totalPrice.toFixed(2)}
          </span>
        </section>
      </main>

      <footer
        style={{
          padding: '24px',
          paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
          paddingRight: 'calc(24px + env(safe-area-inset-right, 0px))',
          backgroundColor: PRIMARY_GREEN,
          borderTop: `1px solid ${ACCENT_BORDER}`,
        }}
      >
        {!isCommentExpanded ? (
          <button
            type="button"
            onClick={() => setIsCommentExpanded(true)}
            disabled={isCountdownActive || isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              padding: '12px 0',
              cursor: isCountdownActive || isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isCountdownActive || isSubmitting ? 0.5 : 1,
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: 'clamp(32px, 8vw, 40px)',
                height: 'clamp(32px, 8vw, 40px)',
                borderRadius: '50%',
                border: `2px solid ${OFF_WHITE}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={OFF_WHITE}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <span
              style={{
                color: OFF_WHITE,
                fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 400,
              }}
            >
              Agregar Nota al Pedido
            </span>
          </button>
        ) : (
          <section
            style={{
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <label
                htmlFor="order-comment"
                style={{
                  color: OFF_WHITE,
                  fontFamily: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
                  fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  opacity: 0.6,
                }}
              >
                Comentario (opcional)
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCommentExpanded(false);
                  setComment('');
                }}
                disabled={isCountdownActive || isSubmitting}
                style={{
                  background: 'none',
                  border: 'none',
                  color: OFF_WHITE,
                  cursor: isCountdownActive || isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isCountdownActive || isSubmitting ? 0.5 : 0.7,
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <textarea
              id="order-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isCountdownActive || isSubmitting}
              placeholder="Agrega algún comentario sobre tu pedido..."
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: `1px solid ${ACCENT_BORDER}`,
                borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
                padding: '16px',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: OFF_WHITE,
                minHeight: '100px',
                resize: 'none',
                outline: 'none',
                opacity: isCountdownActive || isSubmitting ? 0.5 : 1,
                cursor: isCountdownActive || isSubmitting ? 'not-allowed' : 'text',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = OFF_WHITE;
                e.currentTarget.style.boxShadow = `0 0 0 1px ${OFF_WHITE}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = ACCENT_BORDER;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </section>
        )}

        {isCountdownActive ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'clamp(80px, 20vw, 120px)',
                height: 'clamp(80px, 20vw, 120px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  border: `clamp(4px, 1vw, 6px) solid ${OFF_WHITE}`,
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p
                style={{
                  position: 'relative',
                  zIndex: 1,
                  color: OFF_WHITE,
                  fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                {countdown}
              </p>
            </div>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              style={{
                width: '100%',
                backgroundColor: '#F44336',
                color: OFF_WHITE,
                padding: '24px',
                borderRadius: 'clamp(1rem, 2.5vw, 2rem)',
                fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                letterSpacing: '-0.025em',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease-in-out',
                opacity: isSubmitting ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#D32F2F';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#F44336';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              style={{
                width: '100%',
                backgroundColor: OFF_WHITE,
                color: PRIMARY_GREEN,
                padding: '24px',
                borderRadius: 'clamp(1rem, 2.5vw, 2rem)',
                fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                letterSpacing: '-0.02em',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease-in-out',
                opacity: isSubmitting ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              Confirmar Pedido
            </button>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  height: '4px',
                  width: '64px',
                  backgroundColor: 'rgba(253, 252, 248, 0.1)',
                  borderRadius: '9999px',
                }}
              />
            </div>
          </>
        )}
      </footer>

      <CheckeredDivider opacity={0.05} />

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
