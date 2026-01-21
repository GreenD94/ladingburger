'use client';

import React from 'react';
import styles from '@/features/analytics/styles/MetricCard.module.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  const hasTrend = trend !== undefined;

  return (
    <div className={styles.card}>
      {icon && (
        <div className={styles.iconContainer}>
          <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.valueContainer}>
          <span className={styles.value}>{formattedValue}</span>
          {hasTrend && (
            <span className={`${styles.trend} ${trend.isPositive ? styles.trendPositive : styles.trendNegative}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}

