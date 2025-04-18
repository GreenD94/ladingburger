import { WithId } from 'mongodb';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  _id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export type MenuItemWithId = WithId<MenuItem>;
export type MenuCategoryWithId = WithId<MenuCategory>; 