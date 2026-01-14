'use client';

import React from 'react';
import { PRIMARY_GREEN, OFF_WHITE } from '../constants/cartColors.constants';
import { BADGE_SIZE } from '../constants/cartItem.constants';

interface CartItemBadgeProps {
  quantity: number;
}

export const CartItemBadge: React.FC<CartItemBadgeProps> = ({ quantity }) => {
  const formattedQuantity = quantity.toString().padStart(2, '0');

  return (
    <div
      style={{
        position: 'absolute',
        top: '-8px',
        left: '-8px',
        width: `${BADGE_SIZE}px`,
        height: `${BADGE_SIZE}px`,
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
      {formattedQuantity}
    </div>
  );
};

