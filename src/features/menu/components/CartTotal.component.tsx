'use client';

import React from 'react';
import { OFF_WHITE, PRIMARY_GREEN } from '../constants/cartColors.constants';

interface CartTotalProps {
  total: number;
}

export const CartTotal: React.FC<CartTotalProps> = ({ total }) => {
  const formattedTotal = total.toFixed(2);

  return (
    <div
      style={{
        marginTop: '32px',
        paddingLeft: '8px',
        paddingRight: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: `2px dashed ${OFF_WHITE}4D`,
          paddingTop: '24px',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              color: `${OFF_WHITE}99`,
            }}
          >
            Total Amount
          </span>
          <p
            style={{
              fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: 'clamp(2.5rem, 6vw, 3rem)',
              margin: 0,
              marginTop: '4px',
              color: OFF_WHITE,
            }}
          >
            ${formattedTotal}
          </p>
        </div>
        <div
          style={{
            textAlign: 'right',
            paddingBottom: '4px',
            color: `${OFF_WHITE}99`,
          }}
        >
          <span
            style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.8125rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Tax included
          </span>
        </div>
      </div>
    </div>
  );
};

