import bcrypt from 'bcryptjs';
import { Admin, CreateAdmin } from '../types/admin';
import clientPromise from '../config/mongodb';

// Helper function to create the comparePassword method
function createComparePassword(password: string) {
  return async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, password);
  };
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  try {
    // Normalize email by trimming whitespace and converting to lowercase
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Searching for admin with email:', normalizedEmail);
    
    const client = await clientPromise;
    // Explicitly use the 'saborea' database
    const db = client.db('saborea');
    
    // Debug: List all collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Debug: Count documents in admins collection
    const count = await db.collection('admins').countDocuments();
    console.log('Total documents in admins collection:', count);
    
    // Debug: List all admins
    const allAdmins = await db.collection('admins').find({}).toArray();
    console.log('All admins in collection:', allAdmins.map(a => ({ 
      _id: a._id.toString(), 
      email: a.email 
    })));
    
    // Try a simpler query without any type constraints
    const admin = await db.collection('admins').findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
    });
    
    console.log('Query result:', admin ? {
      _id: admin._id.toString(),
      email: admin.email
    } : null);
    
    if (!admin) {
      console.log('No admin found with email:', normalizedEmail);
      return null;
    }

    // Convert ObjectId to string and create Admin object
    const result: Admin = {
      _id: admin._id.toString(),
      email: admin.email,
      password: admin.password,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      comparePassword: createComparePassword(admin.password)
    };
    
    console.log('Returning admin:', { 
      _id: result._id,
      email: result.email,
      hasPassword: !!result.password,
      hasComparePassword: !!result.comparePassword
    });
    
    return result;
  } catch (error) {
    console.error('Error in findAdminByEmail:', error);
    return null;
  }
}

export async function createAdmin(adminData: Omit<CreateAdmin, 'createdAt' | 'updatedAt'>): Promise<Admin> {
  const client = await clientPromise;
  const db = client.db();
  
  const hashedPassword = await bcrypt.hash(adminData.password, 10);
  const now = new Date();
  const admin: CreateAdmin = {
    ...adminData,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  };

  const result = await db.collection('admins').insertOne(admin);
  
  // Convert ObjectId to string to match Admin interface
  return {
    ...admin,
    _id: result.insertedId.toString(),
    comparePassword: createComparePassword(hashedPassword)
  };
} 