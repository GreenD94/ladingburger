import { OrderItem } from '@/features/database/types/order.type';
import { Burger } from '@/features/database/types/burger.type';

export function calculateEstimatedPrepTime(
  items: OrderItem[],
  burgers: Map<string, Burger>
): number {
  if (items.length === 0) {
    return 0;
  }

  const uniqueBurgerIds = new Set(items.map(item => item.burgerId));
  const prepTimes: number[] = [];

  uniqueBurgerIds.forEach(burgerId => {
    const burger = burgers.get(burgerId);
    if (burger && burger.estimatedPrepTime && burger.estimatedPrepTime > 0) {
      prepTimes.push(burger.estimatedPrepTime);
    }
  });

  if (prepTimes.length === 0) {
    return 0;
  }

  return Math.max(...prepTimes);
}

