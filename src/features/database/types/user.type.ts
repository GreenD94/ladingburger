import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId | string;
  phoneNumber: string;
  name?: string;
  birthdate?: Date;
  gender?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

