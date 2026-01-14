'use client';

import React from 'react';
import { RED_COLOR, OFF_WHITE } from '../constants/cartColors.constants';
import { TRASH_ICON_SIZE, TRASH_ICON_SVG_SIZE, TRASH_PADDING } from '../constants/cartItem.constants';

interface SwipeTrashIconProps {
  progress: number;
}

export const SwipeTrashIcon: React.FC<SwipeTrashIconProps> = ({ progress }) => {
  const opacity = progress;
  const scale = 0.5 + progress * 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: `${TRASH_PADDING}px`,
        zIndex: 0,
      }}
    >
      <div
        style={{
          width: `${TRASH_ICON_SIZE}px`,
          height: `${TRASH_ICON_SIZE}px`,
          borderRadius: '50%',
          backgroundColor: RED_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          transform: `scale(${scale})`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
      >
        <svg
          width={TRASH_ICON_SVG_SIZE}
          height={TRASH_ICON_SVG_SIZE}
          viewBox="0 0 24 24"
          fill="none"
          stroke={OFF_WHITE}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </div>
    </div>
  );
};

