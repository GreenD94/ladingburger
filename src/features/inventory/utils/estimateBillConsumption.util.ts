import { Bill, BillItem } from '../types/bill.type';
import { Order, OrderStatus } from '@/features/database/types/index.type';
import { Burger } from '@/features/database/types/burger.type';

export interface MaterialConsumptionStatus {
  materialId: string;
  materialName: string;
  billQuantity: number;
  estimatedConsumed: number;
  remaining: number;
  isConsumed: boolean;
}

export interface BillConsumptionEstimate {
  billId: string;
  isFullyConsumed: boolean;
  consumptionPercentage: number;
  materialsStatus: MaterialConsumptionStatus[];
}

export function estimateBillConsumption(
  bill: Bill,
  orders: Order[],
  burgers: Record<string, Burger>
): BillConsumptionEstimate {
  const ordersSinceBill = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const billDate = new Date(bill.purchaseDate);
    return orderDate >= billDate && order.status === OrderStatus.COMPLETED;
  });

  const materialConsumption: Record<string, number> = {};

  ordersSinceBill.forEach(order => {
    order.items.forEach(item => {
      const burger = burgers[item.burgerId];
      if (burger && burger.recipe) {
        burger.recipe.materialRequirements.forEach(requirement => {
          const consumption = requirement.quantity * item.quantity;
          materialConsumption[requirement.materialId] = 
            (materialConsumption[requirement.materialId] || 0) + consumption;
        });
      }
    });
  });

  const materialsStatus: MaterialConsumptionStatus[] = bill.items.map(item => {
    const estimatedConsumed = materialConsumption[item.materialId] || 0;
    const remaining = Math.max(0, item.quantity - estimatedConsumed);
    const isConsumed = remaining <= 0;

    return {
      materialId: item.materialId,
      materialName: '',
      billQuantity: item.quantity,
      estimatedConsumed,
      remaining,
      isConsumed,
    };
  });

  const totalBillQuantity = bill.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalEstimatedConsumed = materialsStatus.reduce((sum, status) => sum + status.estimatedConsumed, 0);
  const consumptionPercentage = totalBillQuantity > 0
    ? (totalEstimatedConsumed / totalBillQuantity) * 100
    : 0;
  const isFullyConsumed = materialsStatus.every(status => status.isConsumed);

  return {
    billId: typeof bill._id === 'string' ? bill._id : bill._id?.toString() || '',
    isFullyConsumed,
    consumptionPercentage,
    materialsStatus,
  };
}

