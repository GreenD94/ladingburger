import { ObjectId } from 'mongodb';

export interface Material {
  _id?: ObjectId | string;
  name: string;
  unit: string;
  category: string;
  currentStock: number;
  averageCost: number;
  minStockLevel: number;
  lastPurchaseDate?: Date;
  lastPurchasePrice?: number;
  lastCalculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

