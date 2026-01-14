'use client';

import React from 'react';
import { CartItem } from '../contexts/CartContext.context';
import { PRIMARY_GREEN, OFF_WHITE, RED_COLOR } from '../constants/cartColors.constants';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onAddNote: () => void;
  index: number;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
  onAddNote,
  index,
}) => {
  const itemPrice = item.burger.price * item.quantity;
  const quantity = item.quantity;

  const handleIncrease = () => {
    onUpdateQuantity(quantity + 1);
  };

  const formattedIndex = (index + 1).toString().padStart(2, '0');
  const hasDecimals = item.burger.price % 1 !== 0;
  const formattedPrice = hasDecimals ? item.burger.price.toFixed(2) : item.burger.price.toString();

  return (
    <div
      style={{
        position: 'relative',
        padding: '16px',
        borderRadius: 'clamp(1.5rem, 4vw, 2rem)',
        backgroundColor: OFF_WHITE,
        color: PRIMARY_GREEN,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'clamp(80px, 20vw, 96px)',
          height: 'clamp(80px, 20vw, 96px)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: PRIMARY_GREEN,
            color: OFF_WHITE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            border: `2px solid ${OFF_WHITE}`,
            zIndex: 10,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          {formattedIndex}
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'clamp(1rem, 2.5vw, 1.5rem)',
            overflow: 'hidden',
          }}
        >
          <img
            src={item.burger.image}
            alt={item.burger.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          paddingRight: '16px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            lineHeight: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: PRIMARY_GREEN,
            margin: 0,
          }}
        >
          {item.burger.name}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            marginTop: '8px',
            opacity: 0.8,
            color: PRIMARY_GREEN,
            marginBottom: 0,
          }}
        >
          ${formattedPrice}
        </p>
      </div>
      <button
        onClick={handleIncrease}
        style={{
          position: 'absolute',
          bottom: '-8px',
          right: '-8px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: PRIMARY_GREEN,
          color: OFF_WHITE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: `2px solid ${OFF_WHITE}`,
          cursor: 'pointer',
          transition: 'transform 0.1s ease-in-out',
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={OFF_WHITE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};

