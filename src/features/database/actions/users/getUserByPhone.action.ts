'use server';

import { connectToDatabase } from '../../actions/connect.action';
import { User } from '../../types/index.type';
import { EMPTY_USER } from '../../constants/emptyObjects.constants';

export async function getUserByPhone(phoneNumber: string): Promise<User> {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ phoneNumber });
    
    if (!user) {
      return EMPTY_USER;
    }

    return {
      ...user,
      _id: user._id.toString()
    } as User;
  } catch (error) {
    console.error('Error getting user:', error);
    return EMPTY_USER;
  }
}

