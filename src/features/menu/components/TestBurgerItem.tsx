'use client';

import React from 'react';
import { InteractiveBurger } from './InteractiveBurger';

const DARK_GREEN = '#1a4d3a';
const ORANGE = '#FF6B35';

export const TestBurgerItem: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: DARK_GREEN,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        padding: 'clamp(24px, 5vw, 48px)',
        paddingTop: 'clamp(48px, 8vw, 96px)',
        paddingBottom: 'clamp(32px, 6vw, 64px)',
      }}
    >
      <div
        style={{
          flex: '1 1 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: 0,
        }}
      >
        <InteractiveBurger
          framesPath="/media/burgers/animated/classic/frames"
          frameNamePrefix="frame"
          maxFrames={36}
          size="3xl"
        />
      </div>
    </div>
  );
};

