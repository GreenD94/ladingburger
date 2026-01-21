'use client';

import React, { ReactNode } from 'react';
import styles from '@/features/analytics/styles/MetricGrid.module.css';

interface MetricGridProps {
  children: ReactNode;
  columns?: number;
}

export function MetricGrid({ children, columns = 1 }: MetricGridProps) {
  return (
    <div 
      className={styles.grid}
      style={{ '--columns': columns } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

