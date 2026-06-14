import { ObjectId } from 'mongodb';

export enum MaterialLossCause {
  EXPIRATION = 'expiration',
  SPOILAGE = 'spoilage',
  DAMAGE = 'damage',
  OVERCOOKING = 'overcooking',
  PREPARATION_ERROR = 'preparation_error',
  THEFT = 'theft',
  INVENTORY_ERROR = 'inventory_error',
  OTHER = 'other',
}

export interface MaterialLoss {
  _id?: ObjectId | string;
  materialId: string;
  quantity: number;
  unit: string;
  lossDate: Date;
  cause: MaterialLossCause;
  notes?: string;
  billId?: string;
  recordedBy: string;
  createdAt: Date;
}

