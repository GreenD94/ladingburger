'use client';

import React from 'react';
import { MenuThemeConfig } from '../themes/menuThemes';
import { BADGE_SHADOW, WHITE_COLOR } from '../constants/colors.constants';
import { MAX_BADGE_COUNT } from '../constants/defaults.constants';

interface CartBadgeProps {
  itemCount: number;
  theme: MenuThemeConfig;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ itemCount, theme }) => {
  const hasItems = itemCount > 0;
  const exceedsMaxBadge = itemCount > MAX_BADGE_COUNT;
  
  if (!hasItems) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        backgroundColor: WHITE_COLOR,
        color: theme.backgroundColor,
        borderRadius: '50%',
        width: 'clamp(24px, 6vw, 28px)',
        height: 'clamp(24px, 6vw, 28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(11px, 2.8vw, 13px)',
        fontWeight: 'bold',
        boxShadow: BADGE_SHADOW,
        border: `2px solid ${theme.backgroundColor}`,
        animation: hasItems ? 'pulse 2s ease-in-out infinite' : 'none',
      }}
    >
      {exceedsMaxBadge ? `${MAX_BADGE_COUNT}+` : itemCount}
    </div>
  );
};

