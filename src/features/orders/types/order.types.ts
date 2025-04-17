import { Burger } from '@/features/database/types';

export interface CustomizedBurger extends Burger {
  removedIngredients: string[];
  note?: string;
}

export interface OrderItem {
  burgerId: string;
  removedIngredients: string[];
  quantity: number;
}

export interface OrderFormState {
  burgers: Burger[];
  selectedBurgers: CustomizedBurger[];
  phoneNumber: string;
  showPhoneDialog: boolean;
  loading: boolean;
} 