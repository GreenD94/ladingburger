import { ObjectId } from 'mongodb';

export interface BillItem {
  materialId: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export type BillStatus = 'active' | 'consumed' | 'archived';

export interface Bill {
  _id?: ObjectId | string;
  billNumber: string;
  supplier: string;
  purchaseDate: Date;
  totalAmount: number;
  items: BillItem[];
  status: BillStatus;
  confirmedBy?: string;
  confirmedAt?: Date;
  reconciliationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

