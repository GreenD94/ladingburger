'use client';

import React from 'react';

interface CheckeredDividerProps {
  opacity?: number;
}

export const CheckeredDivider: React.FC<CheckeredDividerProps> = ({ opacity = 0.15 }) => {
  return (
    <div
      style={{
        backgroundImage: `
          linear-gradient(45deg, #FDFCF8 25%, transparent 25%), 
          linear-gradient(-45deg, #FDFCF8 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #FDFCF8 75%), 
          linear-gradient(-45deg, transparent 75%, #FDFCF8 75%)
        `,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 0 8px, 8px 8px, 8px 0',
        opacity,
        height: '16px',
        width: '100%',
      }}
    />
  );
};

