'use client';

import React from 'react';
import styles from '@/features/users/styles/UserSegmentFilter.module.css';

type UserSegment = 'TODOS' | 'VIP' | 'NUEVO' | 'EN RIESGO';

interface UserSegmentFilterProps {
  selectedSegment: UserSegment;
  onSegmentChange: (segment: UserSegment) => void;
}

const SEGMENTS: UserSegment[] = ['TODOS', 'VIP', 'NUEVO', 'EN RIESGO'];

export function UserSegmentFilter({ selectedSegment, onSegmentChange }: UserSegmentFilterProps) {
  return (
    <div className={styles.filterContainer}>
      {SEGMENTS.map((segment) => {
        const isSelected = selectedSegment === segment;
        return (
          <button
            key={segment}
            className={`${styles.segmentButton} ${isSelected ? styles.segmentButtonSelected : ''}`}
            onClick={() => onSegmentChange(segment)}
            aria-pressed={isSelected}
          >
            {segment}
          </button>
        );
      })}
    </div>
  );
}

