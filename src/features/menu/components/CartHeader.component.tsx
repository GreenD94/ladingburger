'use client';

import React from 'react';
import { PRIMARY_GREEN, OFF_WHITE, WHATSAPP_GREEN } from '../constants/cartColors.constants';

interface CartHeaderProps {
  total: number;
  onWhatsApp?: () => void;
}

export const CartHeader: React.FC<CartHeaderProps> = ({ total, onWhatsApp }) => {
  const hasDecimals = total % 1 !== 0;
  const formattedTotal = hasDecimals ? total.toFixed(2) : total.toString();

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWhatsApp) {
      onWhatsApp();
    }
  };

  return (
    <header
      style={{
        position: 'relative',
        paddingTop: '56px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PRIMARY_GREEN,
      }}
    >
      {onWhatsApp && (
        <button
          onClick={handleWhatsAppClick}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: 'clamp(56px, 14vw, 72px)',
            height: 'clamp(56px, 14vw, 72px)',
            borderRadius: '50%',
            backgroundColor: WHATSAPP_GREEN,
            border: `3px solid ${OFF_WHITE}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)',
            padding: 0,
            margin: 0,
            outline: 'none',
            transition: 'all 0.2s ease-in-out',
            zIndex: 10,
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.currentTarget.style.transform = 'scale(0.9)';
            e.currentTarget.style.boxShadow = '0 5px 15px -3px rgba(0, 0, 0, 0.2), 0 2px 8px -2px rgba(0, 0, 0, 0.15)';
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)';
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            e.currentTarget.style.transform = 'scale(0.9)';
            e.currentTarget.style.boxShadow = '0 5px 15px -3px rgba(0, 0, 0, 0.2), 0 2px 8px -2px rgba(0, 0, 0, 0.15)';
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)';
          }}
        >
          <svg
            width="clamp(28px, 7vw, 36px)"
            height="clamp(28px, 7vw, 36px)"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </button>
      )}
      <h1
        style={{
          fontFamily: 'var(--font-playfair-display), "Playfair Display", "Times New Roman", serif',
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: 'clamp(3.75rem, 9vw, 6rem)',
          letterSpacing: '-0.025em',
          lineHeight: 1,
          color: OFF_WHITE,
          margin: 0,
        }}
      >
        ${formattedTotal}
      </h1>
    </header>
  );
};

