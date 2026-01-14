'use client';

import React from 'react';
import { PRIMARY_GREEN, OFF_WHITE } from '../constants/cartColors.constants';
import { PLUS_BUTTON_SIZE, PLUS_ICON_SIZE } from '../constants/cartItem.constants';

interface CartItemPlusButtonProps {
  onIncrease: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

export const CartItemPlusButton: React.FC<CartItemPlusButtonProps> = ({ onIncrease }) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.currentTarget.style.transform = 'scale(0.9)';
    e.currentTarget.style.boxShadow = '0 5px 15px -3px rgba(0, 0, 0, 0.2), 0 2px 8px -2px rgba(0, 0, 0, 0.15)';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)';
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.currentTarget.style.transform = 'scale(0.9)';
    e.currentTarget.style.boxShadow = '0 5px 15px -3px rgba(0, 0, 0, 0.2), 0 2px 8px -2px rgba(0, 0, 0, 0.15)';
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onIncrease(e);
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)';
  };

  return (
    <button
      onClick={onIncrease}
      style={{
        position: 'absolute',
        bottom: '-8px',
        right: '-8px',
        width: `${PLUS_BUTTON_SIZE}px`,
        height: `${PLUS_BUTTON_SIZE}px`,
        borderRadius: '50%',
        backgroundColor: PRIMARY_GREEN,
        color: OFF_WHITE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)',
        border: `2px solid ${OFF_WHITE}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        transform: 'scale(1)',
        outline: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <svg
        width={PLUS_ICON_SIZE}
        height={PLUS_ICON_SIZE}
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
  );
};

