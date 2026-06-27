'use server';

import { apiGet } from '@/features/api/utils/apiClient.util';
import { ProductFromAPI } from '@/features/api/types/api.type';
import { Burger, BURGER_IMAGES } from '@/features/database/types/burger.type';

export async function getAvailableBurgers(): Promise<Burger[]> {
  try {
    const products = await apiGet<ProductFromAPI[]>('/api/v1/catalog/products');
    return products
      .filter((p) => p.is_active)
      .map((p) => ({
        _id: String(p.id),
        name: p.name,
        description: p.description ?? '',
        price: Number(p.price),
        ingredients: [],
        image: BURGER_IMAGES.CLASSIC,
        category: '',
        isAvailable: true,
      }));
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}
