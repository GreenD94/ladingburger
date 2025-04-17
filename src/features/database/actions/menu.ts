import { getBurgers } from './menu/getBurgers';
import { seedDatabase as seedDatabaseAction } from './menu/seedDatabase';

export async function getAvailableBurgers() {
  const result = await getBurgers();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch available burgers');
  }
  return result.burgers;
}

export async function seedDatabase(): Promise<{ success: boolean; message: string; error?: string }> {
  const result = await seedDatabaseAction();
  if (!result.success) {
    throw new Error(result.error || 'Failed to seed database');
  }
  return {
    success: true,
    message: result.message || 'Database seeded successfully'
  };
} 