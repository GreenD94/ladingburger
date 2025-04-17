'use server';

import { connectToDatabase } from '../../actions/connect';
import { ObjectId } from 'mongodb';

export async function deleteUser(userId: string) {
  try {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: 'Failed to delete user'
    };
  }
} 