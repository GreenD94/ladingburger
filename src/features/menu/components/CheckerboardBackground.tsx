'use client';

import React from 'react';

interface CheckerboardBackgroundProps {
  backgroundColor: string;
  height?: string;
  position?: 'top' | 'bottom';
  paddingLeft?: string;
  paddingRight?: string;
  zIndex?: number;
}

export const CheckerboardBackground: React.FC<CheckerboardBackgroundProps> = ({
  backgroundColor,
  height = '100%',
  position = 'top',
  paddingLeft = '0px',
  paddingRight = '0px',
  zIndex = 0,
}) => {
  const squareSize = 'clamp(70px, 12vw, 120px)';
  
  // Create a grid of squares - enough to cover the viewport
  const squares = [];
  const numCols = 25; // Enough columns to cover width
  const numRows = 15; // Enough rows to cover height
  
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
      }}
    >
      {squares}
    </div>
  );
};
