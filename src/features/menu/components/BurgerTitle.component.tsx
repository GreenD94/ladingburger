'use client';

import React from 'react';

interface BurgerTitleProps {
  restPart: string;
  primaryColor: string;
}

export const BurgerTitle: React.FC<BurgerTitleProps> = ({ restPart, primaryColor }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: '-0.5rem',
      }}
    >
      <div
        style={{
          fontSize: 'clamp(4rem, 10vw, 7.5rem)',
          fontWeight: 700,
          fontFamily: 'var(--font-playfair-display), "Playfair Display", "Times New Roman", serif',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 0.9,
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        {restPart.toUpperCase()}
      </div>
    </div>
  );
};

