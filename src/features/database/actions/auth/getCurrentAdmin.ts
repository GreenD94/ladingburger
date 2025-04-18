'use server';

import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import clientPromise from '../../config/mongodb';
import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';

interface CurrentAdmin {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    
    const client = await clientPromise;
    const db = client.db('saborea');
    const admin = await db.collection('admins').findOne({ _id: new ObjectId(decoded.id) });

    if (!admin) {
      return null;
    }

    return {
      _id: admin._id.toString(),
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
}

export async function requireAuth() {
  const result = await getCurrentAdmin();
  if (!result) {
    redirect('/login');
  }
  return result;
} 