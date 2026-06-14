import { ObjectId } from 'mongodb';
import { BurgerRecipe } from '@/features/inventory/types/recipe.type';

export const BURGER_IMAGES = {
  CLASSIC: '/media/burgers/classic-burger.jpg',
  DOUBLE_CHEESE: '/media/burgers/double-cheese.jpg',
} as const;

export type BurgerImage = typeof BURGER_IMAGES[keyof typeof BURGER_IMAGES];

export interface Burger {
  _id?: ObjectId | string;
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  image: BurgerImage;
  category: string;
  isAvailable: boolean;
  estimatedPrepTime?: number;
  recipe?: BurgerRecipe;
}

