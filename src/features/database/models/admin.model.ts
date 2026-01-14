import bcrypt from 'bcryptjs';
import { Admin, CreateAdmin } from '../types/admin.type';
import clientPromise from '../config/mongodb';

function createComparePassword(password: string) {
  return async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, password);
  };
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const client = await clientPromise;
    const db = client.db('saborea');
    
    const admin = await db.collection('admins').findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
    });
    
    if (!admin) {
      return null;
    }

    const result: Admin = {
      _id: admin._id.toString(),
      email: admin.email,
      password: admin.password,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      comparePassword: createComparePassword(admin.password)
    };
    
    return result;
  } catch (error) {
    console.error('Error in findAdminByEmail:', error);
    return null;
  }
}

export async function createAdmin(adminData: Omit<CreateAdmin, 'createdAt' | 'updatedAt'>): Promise<Admin> {
  const client = await clientPromise;
  const db = client.db('saborea');
  
  const hashedPassword = await bcrypt.hash(adminData.password, 10);
  const now = new Date();
  const admin: CreateAdmin = {
    ...adminData,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  };

  const result = await db.collection('admins').insertOne(admin);
  
  return {
    ...admin,
    _id: result.insertedId.toString(),
    comparePassword: createComparePassword(hashedPassword)
  };
} 