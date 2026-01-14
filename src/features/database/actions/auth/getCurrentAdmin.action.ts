'use server';

import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import clientPromise from '../../config/mongodb';
import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { EMPTY_ADMIN } from '../../constants/emptyObjects.constants';

interface CurrentAdmin {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token || token === '') {
      return {
        _id: '',
        email: '',
        createdAt: new Date(0),
        updatedAt: new Date(0),
      };
    }

    const decoded = verify(token, process.env.JWT_SECRET || '') as { id: string; email: string };
    
    const client = await clientPromise;
    const db = client.db('saborea');
    const admin = await db.collection('admins').findOne({ _id: new ObjectId(decoded.id) });

    if (!admin) {
      return {
        _id: '',
        email: '',
        createdAt: new Date(0),
        updatedAt: new Date(0),
      };
    }

    return {
      _id: admin._id.toString(),
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };
  } catch (error) {
    console.error('Error getting current admin:', error);
    return {
      _id: '',
      email: '',
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  }
}

export async function requireAuth() {
  const result = await getCurrentAdmin();
  if (result._id === '' || result.email === '') {
    redirect('/login');
  }
  return result;
}

