import { UserDetailedStats } from '@/features/users/actions/getUserDetailedStats.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export function calculateRetentionLevel(totalOrders: number): 'Alta' | 'Media' | 'Baja' {
  if (totalOrders > 5) {
    return 'Alta';
  }
  if (totalOrders > 2) {
    return 'Media';
  }
  return 'Baja';
}

export function formatChurnRisk(churnRisk: 'low' | 'medium' | 'high'): string {
  switch (churnRisk) {
    case 'low':
      return 'Bajo';
    case 'medium':
      return 'Medio';
    case 'high':
      return 'Alto';
    default:
      return EMPTY_STRING;
  }
}

export function getChurnRiskColor(churnRisk: 'low' | 'medium' | 'high'): string {
  switch (churnRisk) {
    case 'low':
      return '#22c55e';
    case 'medium':
      return '#eab308';
    case 'high':
      return '#ef4444';
    default:
      return '#616f89';
  }
}

export function calculateDaysUntilNextOrder(
  daysSinceLastOrder: number,
  orderFrequency: number
): number {
  if (orderFrequency <= 0) {
    return 0;
  }
  const averageDaysBetweenOrders = 30 / orderFrequency;
  return Math.max(0, Math.round(averageDaysBetweenOrders - daysSinceLastOrder));
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getRiskScore(stats: UserDetailedStats): number {
  let score = 0;

  if (stats.daysSinceLastOrder > 90) {
    score += 30;
  } else if (stats.daysSinceLastOrder > 30) {
    score += 15;
  }

  if (stats.cancellationRate > 20) {
    score += 25;
  } else if (stats.cancellationRate > 10) {
    score += 12;
  }

  if (stats.refundRate > 10) {
    score += 25;
  } else if (stats.refundRate > 5) {
    score += 12;
  }

  if (stats.paymentSuccessRate < 70) {
    score += 20;
  } else if (stats.paymentSuccessRate < 85) {
    score += 10;
  }

  return Math.min(100, score);
}

export function getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' {
  if (riskScore < 30) {
    return 'low';
  }
  if (riskScore < 60) {
    return 'medium';
  }
  return 'high';
}

