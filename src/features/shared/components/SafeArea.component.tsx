'use client';

import React, { ReactNode } from 'react';

interface SafeAreaProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sides?: 'all' | 'top' | 'bottom' | 'horizontal' | 'vertical';
}

export const SafeArea: React.FC<SafeAreaProps> = ({ 
  children, 
  className, 
  style,
  sides = 'all'
}) => {
  const safeAreaStyle: React.CSSProperties = {
    ...style,
  };

  if (sides === 'all' || sides === 'top' || sides === 'vertical') {
    safeAreaStyle.paddingTop = `env(safe-area-inset-top, 0px)`;
  }
  if (sides === 'all' || sides === 'bottom' || sides === 'vertical') {
    safeAreaStyle.paddingBottom = `env(safe-area-inset-bottom, 0px)`;
  }
  if (sides === 'all' || sides === 'horizontal') {
    safeAreaStyle.paddingLeft = `env(safe-area-inset-left, 0px)`;
    safeAreaStyle.paddingRight = `env(safe-area-inset-right, 0px)`;
  }

  return (
    <div className={className} style={safeAreaStyle}>
      {children}
    </div>
  );
};

