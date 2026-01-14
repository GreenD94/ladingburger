import { getBurgers } from './getBurgers.action';
import { createBurger } from './createBurger.action';
import { updateBurger } from './updateBurger.action';
import { deleteBurger } from './deleteBurger.action';
import { getBurgers as getAllBurgers } from '@/features/database/actions/burgers.action';

export async function getAvailableBurgers() {
  const result = await getBurgers();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch available burgers');
  }
  return result.burgers;
}

export async function getAllMenuItems() {
  const burgers = await getAllBurgers();
  return burgers || [];
}

export { createBurger, updateBurger, deleteBurger };

