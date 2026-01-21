export type AnalyticsCategoryId = 
  | 'customer'
  | 'financial'
  | 'risk'
  | 'product'
  | 'operational';

export interface AnalyticsCategory {
  id: AnalyticsCategoryId;
  label: string;
  icon: string;
  description: string;
  componentIds: string[];
}

export const ANALYTICS_CATEGORIES: AnalyticsCategory[] = [
  {
    id: 'customer',
    label: 'Customer Analytics',
    icon: 'people',
    description: 'Customer metrics, segmentation, and retention analysis',
    componentIds: [
      'customer-analytics',
      'customer-segment',
      'customer-lifetime-value',
      'customer-retention',
      'churn-analysis',
    ],
  },
  {
    id: 'financial',
    label: 'Financial Metrics',
    icon: 'attach_money',
    description: 'Revenue, AOV, and profitability metrics',
    componentIds: [
      'sales-chart',
      'revenue-by-segment',
      'average-order-value',
      'revenue-trends',
    ],
  },
  {
    id: 'risk',
    label: 'Risk Indicators',
    icon: 'warning',
    description: 'Churn, refunds, cancellations, and issues',
    componentIds: [
      'refund-rate',
      'cancellation-rate',
      'issue-rate',
      'at-risk-customers',
    ],
  },
  {
    id: 'product',
    label: 'Product Analytics',
    icon: 'inventory',
    description: 'Top selling items and product performance',
    componentIds: [
      'top-selling-items',
      'product-performance',
      'product-trends',
    ],
  },
  {
    id: 'operational',
    label: 'Operational Metrics',
    icon: 'schedule',
    description: 'Peak hours, order timing, and efficiency',
    componentIds: [
      'peak-hours',
      'order-timing',
      'operational-efficiency',
    ],
  },
];

export const DEFAULT_CATEGORY: AnalyticsCategoryId = 'customer';

export function getCategoryById(id: AnalyticsCategoryId): AnalyticsCategory {
  const category = ANALYTICS_CATEGORIES.find(cat => cat.id === id);
  if (!category) {
    return ANALYTICS_CATEGORIES.find(cat => cat.id === DEFAULT_CATEGORY) || ANALYTICS_CATEGORIES[0];
  }
  return category;
}

