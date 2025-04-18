import { Document } from 'mongoose';

export interface Admin extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
} 