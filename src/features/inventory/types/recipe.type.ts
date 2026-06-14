import { ObjectId } from 'mongodb';

export interface MaterialRequirement {
  materialId: string;
  quantity: number;
  unit: string;
}

export interface CostSnapshot {
  date: Date;
  cost: number;
  materialCosts: {
    materialId: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
}

export interface BurgerRecipe {
  materialRequirements: MaterialRequirement[];
  currentCost: number;
  lastCostUpdate: Date;
  costHistory?: CostSnapshot[];
}

