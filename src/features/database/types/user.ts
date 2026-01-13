import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId | string;
  phoneNumber: string;
  name?: string;
  notes?: string; // customer preferences, allergies
  tags?: string[]; // 'frequent', 'vip', etc.
  createdAt: Date;
  updatedAt: Date;
} 