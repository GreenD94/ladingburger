'use client';

import React, { ReactNode } from 'react';

interface SafeAreaProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SafeArea: React.FC<SafeAreaProps> = ({ children, className, style }) => {
  return (
    <div
      className={className}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

