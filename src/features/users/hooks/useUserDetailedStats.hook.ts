import { useState, useEffect, useCallback } from 'react';
import { getUserDetailedStatsAction, UserDetailedStats } from '@/features/users/actions/getUserDetailedStats.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

interface UseUserDetailedStatsResult {
  stats: UserDetailedStats | null;
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

const EMPTY_STATS: UserDetailedStats = {
  totalOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  refundedOrders: 0,
  failedPaymentOrders: 0,
  lifetimeValue: 0,
  averageOrderValue: 0,
  totalRevenue: 0,
  totalRefunds: 0,
  paymentSuccessRate: 0,
  cancellationRate: 0,
  refundRate: 0,
  daysSinceLastOrder: 0,
  daysSinceFirstOrder: 0,
  orderFrequency: 0,
  ordersByMonth: [],
  ordersByDayOfWeek: [],
  ordersByHour: [],
  revenueByMonth: [],
  averageOrderValueByMonth: [],
  orderStatusDistribution: [],
  topProducts: [],
  churnRisk: 'high',
  projectedAnnualValue: 0,
  firstOrderDate: new Date(0),
  lastOrderDate: new Date(0),
};

export function useUserDetailedStats(phoneNumber: string): UseUserDetailedStatsResult {
  const [stats, setStats] = useState<UserDetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);

  const fetchStats = useCallback(async () => {
    if (!phoneNumber || phoneNumber === EMPTY_STRING) {
      setStats(EMPTY_STATS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(EMPTY_STRING);

      const response = await getUserDetailedStatsAction(phoneNumber);

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Error al cargar las estadísticas');
        setStats(EMPTY_STATS);
      }
    } catch (err) {
      const errorMessage = 'Ocurrió un error al cargar las estadísticas';
      setError(errorMessage);
      setStats(EMPTY_STATS);
      console.error('Error fetching user detailed stats:', err);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

