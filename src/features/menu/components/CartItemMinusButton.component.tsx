'use client';

import React from 'react';
import { RED_COLOR, OFF_WHITE } from '../constants/cartColors.constants';
import { MINUS_BUTTON_SIZE, MINUS_ICON_SIZE } from '../constants/cartItem.constants';

interface CartItemMinusButtonProps {
  onDecrease: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

export const CartItemMinusButton: React.FC<CartItemMinusButtonProps> = ({ onDecrease }) => {
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
    onDecrease(e);
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.2)';
  };

  return (
    <button
      onClick={onDecrease}
      style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: `${MINUS_BUTTON_SIZE}px`,
        height: `${MINUS_BUTTON_SIZE}px`,
        borderRadius: '50%',
        backgroundColor: RED_COLOR,
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
        zIndex: 20,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <svg
        width={MINUS_ICON_SIZE}
        height={MINUS_ICON_SIZE}
        viewBox="0 0 24 24"
        fill="none"
        stroke={OFF_WHITE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
};

