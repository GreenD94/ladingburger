import { Material } from '../types/material.type';
import { Bill } from '../types/bill.type';
import { MaterialLoss } from '../types/loss.type';
import { MaterialRequirement, BurgerRecipe } from '../types/recipe.type';
import { EMPTY_DATE, EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export const EMPTY_MATERIAL: Material = {
  name: EMPTY_STRING,
  unit: EMPTY_STRING,
  category: EMPTY_STRING,
  currentStock: 0,
  averageCost: 0,
  minStockLevel: 0,
  lastCalculatedAt: EMPTY_DATE,
  createdAt: EMPTY_DATE,
  updatedAt: EMPTY_DATE,
};

export const EMPTY_BILL: Bill = {
  billNumber: EMPTY_STRING,
  supplier: EMPTY_STRING,
  purchaseDate: EMPTY_DATE,
  totalAmount: 0,
  items: [],
  status: 'active',
  createdAt: EMPTY_DATE,
  updatedAt: EMPTY_DATE,
};

export const EMPTY_MATERIAL_LOSS: MaterialLoss = {
  materialId: EMPTY_STRING,
  quantity: 0,
  unit: EMPTY_STRING,
  lossDate: EMPTY_DATE,
  cause: 'other' as const,
  recordedBy: EMPTY_STRING,
  createdAt: EMPTY_DATE,
};

export const EMPTY_MATERIAL_REQUIREMENT: MaterialRequirement = {
  materialId: EMPTY_STRING,
  quantity: 0,
  unit: EMPTY_STRING,
};

export const EMPTY_BURGER_RECIPE: BurgerRecipe = {
  materialRequirements: [],
  currentCost: 0,
  lastCostUpdate: EMPTY_DATE,
};

