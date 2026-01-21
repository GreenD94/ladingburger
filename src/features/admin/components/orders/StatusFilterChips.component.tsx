'use client';

import { OrderStatus, OrderStatusType, OrderStatusLabels } from '@/features/database/types/index.type';
import styles from '@/features/admin/styles/StatusFilterChips.module.css';

import { NOT_LOADED } from '@/features/database/constants/emptyValues.constants';

interface StatusFilterChipsProps {
  selectedStatus: OrderStatusType;
  onStatusChange: (status: OrderStatusType) => void;
  orderCounts: Record<OrderStatusType, number>; // NOT_LOADED (-1) means not loaded yet
}

const getStatusColorClass = (status: OrderStatusType) => {
  switch (status) {
    case OrderStatus.WAITING_PAYMENT: return styles.chipWaitingPayment;
    case OrderStatus.PAYMENT_FAILED: return styles.chipPaymentFailed;
    case OrderStatus.COOKING: return styles.chipCooking;
    case OrderStatus.IN_TRANSIT: return styles.chipInTransit;
    case OrderStatus.WAITING_PICKUP: return styles.chipWaitingPickup;
    case OrderStatus.COMPLETED: return styles.chipCompleted;
    case OrderStatus.ISSUE: return styles.chipIssue;
    case OrderStatus.CANCELLED: return styles.chipCancelled;
    case OrderStatus.REFUNDED: return styles.chipRefunded;
    default: return styles.chipRefunded;
  }
};

export function StatusFilterChips({ selectedStatus, onStatusChange, orderCounts }: StatusFilterChipsProps) {
  const allStatuses = Object.values(OrderStatus);
  const halfIndex = Math.ceil(allStatuses.length / 2);
  const firstRowStatuses = allStatuses.slice(0, halfIndex);
  const secondRowStatuses = allStatuses.slice(halfIndex);

  const renderChip = (status: OrderStatusType) => {
    const count = orderCounts[status];
    const isSelected = selectedStatus === status;
    const colorClass = getStatusColorClass(status);
    
    // Show count if loaded, show "-" if not loaded yet
    const countDisplay = count === NOT_LOADED ? ' (-)' : count > 0 ? ` (${count})` : '';
    
    return (
      <button
        key={status}
        className={`${styles.chip} ${isSelected ? `${styles.chipSelected} ${colorClass}` : styles.chipUnselected}`}
        onClick={() => onStatusChange(status)}
      >
        {OrderStatusLabels[status]}{countDisplay}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {firstRowStatuses.map(renderChip)}
      </div>
      <div className={styles.row}>
        {secondRowStatuses.map(renderChip)}
      </div>
    </div>
  );
}
