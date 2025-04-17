import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId | string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
} 