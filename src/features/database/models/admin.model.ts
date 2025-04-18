import { Schema, model, Document } from 'mongoose';
import { Admin } from '../types/admin';
import bcrypt from 'bcryptjs';

interface AdminDocument extends Admin, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<AdminDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, {
  timestamps: true,
});

// Hash password before saving
adminSchema.pre('save', async function(this: AdminDocument, next: (err?: Error) => void) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(this: AdminDocument, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const AdminModel = model<AdminDocument>('Admin', adminSchema); 