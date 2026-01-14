'use client';

import React from 'react';

interface CheckerboardBackgroundProps {
  backgroundColor: string;
  height?: string;
  position?: 'top' | 'bottom';
  paddingLeft?: string;
  paddingRight?: string;
  zIndex?: number;
  shouldAnimate?: boolean;
}

export const CheckerboardBackground: React.FC<CheckerboardBackgroundProps> = ({
  backgroundColor,
  height = '100%',
  position = 'top',
  paddingLeft = '0px',
  paddingRight = '0px',
  zIndex = 0,
  shouldAnimate = false,
}) => {
  const squareSize = 'clamp(70px, 12vw, 120px)';
  
  const squares = [];
  const numCols = 25;
  const numRows = 15;
  
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const isWhite = (row + col) % 2 === 0;
      squares.push(
        <div
          key={`${row}-${col}`}
          style={{
            width: squareSize,
            height: squareSize,
            backgroundColor: isWhite ? '#FFFFFF' : backgroundColor,
          }}
        />
      );
    }
  }

  const animationName = shouldAnimate 
    ? (position === 'top' ? 'slideInFromLeftNoFade' : 'slideInFromRightNoFade')
    : 'none';
  
  const initialTransform = shouldAnimate
    ? (position === 'top' ? 'translateX(-100%)' : 'translateX(100%)')
    : 'translateX(0)';

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 0,
        left: `calc(-1 * (${paddingLeft}))`,
        right: `calc(-1 * (${paddingRight}))`,
        height,
        width: '100vw',
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, ${squareSize})`,
        gridAutoRows: squareSize,
        backgroundColor,
        zIndex,
        overflow: 'hidden',
        transform: initialTransform,
        animation: shouldAnimate ? `${animationName} 1s ease-out forwards` : 'none',
      }}
    >
      {squares}
    </div>
  );
};

