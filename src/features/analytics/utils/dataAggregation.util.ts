import { SalesData, CustomerData } from '@/features/database/models/analytics.model';

export type TimeRange = 'daily' | 'weekly' | 'monthly';

export function determineTimeRange(days: number): TimeRange {
  if (days <= 7) return 'daily';
  if (days <= 30) return 'weekly';
  return 'monthly';
}

export function aggregateSalesData(data: SalesData[], range: TimeRange): SalesData[] {
  if (data.length === 0) return [];

  const aggregatedData = new Map<string, { revenue: number; orders: number }>();

  data.forEach(item => {
    const date = new Date(item.date);
    let key: string;

    switch (range) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    const current = aggregatedData.get(key) || { revenue: 0, orders: 0 };
    aggregatedData.set(key, {
      revenue: current.revenue + item.revenue,
      orders: current.orders + item.orders
    });
  });

  return Array.from(aggregatedData.entries())
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function aggregateCustomerData(data: CustomerData[], range: TimeRange): CustomerData[] {
  if (data.length === 0) return [];

  const aggregatedData = new Map<string, {
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
    averageOrderValue: number;
    orderCount: number;
  }>();

  data.forEach(item => {
    const date = new Date(item.date);
    let key: string;

    switch (range) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    const current = aggregatedData.get(key) || {
      newCustomers: 0,
      returningCustomers: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      orderCount: 0
    };

    aggregatedData.set(key, {
      newCustomers: current.newCustomers + item.newCustomers,
      returningCustomers: current.returningCustomers + item.returningCustomers,
      totalCustomers: current.totalCustomers + item.totalCustomers,
      averageOrderValue: current.averageOrderValue + item.averageOrderValue,
      orderCount: current.orderCount + 1
    });
  });

  return Array.from(aggregatedData.entries())
    .map(([date, data]) => ({
      date,
      newCustomers: data.newCustomers,
      returningCustomers: data.returningCustomers,
      totalCustomers: data.totalCustomers,
      averageOrderValue: data.orderCount > 0 ? data.averageOrderValue / data.orderCount : 0
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function formatDateLabel(date: string, range: TimeRange): string {
  const d = new Date(date);
  switch (range) {
    case 'daily':
      return d.toLocaleDateString();
    case 'weekly':
      return `Week of ${d.toLocaleDateString()}`;
    case 'monthly':
      return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }
}

