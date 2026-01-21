'use client';

import React from 'react';
import { PRIMARY_GREEN, OFF_WHITE, WHATSAPP_GREEN } from '../constants/cartColors.constants';

interface CartFooterProps {
  onBuyNow: () => void;
  onWhatsApp: () => void;
  onBuyNowClick?: () => void;
}

export const CartFooter: React.FC<CartFooterProps> = ({ onBuyNow, onWhatsApp, onBuyNowClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    if (onBuyNowClick) {
      onBuyNowClick();
    } else {
      onBuyNow();
    }
  };
  return (
    <footer
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      style={{
        padding: '24px',
        paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
        paddingRight: 'calc(24px + env(safe-area-inset-right, 0px))',
        backgroundColor: PRIMARY_GREEN,
      }}
    >
      <div
        style={{
          maxWidth: '448px',
          margin: '0 auto',
        }}
      >
        <button
          type="button"
          onClick={handleClick}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          style={{
            width: '100%',
            backgroundColor: OFF_WHITE,
            color: PRIMARY_GREEN,
            padding: '24px',
            borderRadius: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
            letterSpacing: '-0.025em',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            transition: 'all 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            const arrow = e.currentTarget.querySelector('svg');
            if (arrow) {
              arrow.style.transform = 'translateX(4px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = OFF_WHITE;
            const arrow = e.currentTarget.querySelector('svg');
            if (arrow) {
              arrow.style.transform = 'translateX(0)';
            }
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          COMPRAR
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={PRIMARY_GREEN}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </footer>
  );
};

