'use server';

import { connectToDatabase } from '../../actions/connect';
import { User } from '../../types';

export async function getUserByPhone(phoneNumber: string) {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ phoneNumber });
    
    if (!user) {
      return null;
    }

    return {
      ...user,
      _id: user._id.toString()
    } as User;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
} 