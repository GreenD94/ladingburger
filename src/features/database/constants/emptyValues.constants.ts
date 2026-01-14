import { OrdersFiltersState } from '@/features/admin/components/orders/OrdersFilters.component';

export const EMPTY_DATE = new Date(0);

export const EMPTY_STRING = '';

export const EMPTY_DATE_RANGE = {
  start: EMPTY_DATE,
  end: EMPTY_DATE,
};

export const EMPTY_AMOUNT_RANGE = {
  min: 0,
  max: 0,
};

export const EMPTY_FILTERS: OrdersFiltersState = {
  dateRange: {
    start: EMPTY_DATE,
    end: EMPTY_DATE,
  },
  statuses: [],
  paymentStatuses: [],
  amountRange: {
    min: 0,
    max: 0,
  },
};

export const EMPTY_ORDERS_FILTERS_STATE = EMPTY_FILTERS;

export const TOP_SELLING_ITEMS_LIMIT = 10;
export const HOURS_IN_DAY = 24;
export const COOKIE_MAX_AGE_ONE_DAY = 24 * 60 * 60;

