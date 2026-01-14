'use server';

import { connectToDatabase } from '../../actions/connect.action';
import { ObjectId } from 'mongodb';

export async function updateUser(userId: string, newPhoneNumber: string) {
  try {
    const { db } = await connectToDatabase();
    
    const existingUser = await db.collection('users').findOne({ 
      phoneNumber: newPhoneNumber,
      _id: { $ne: new ObjectId(userId) }
    });
    
    if (existingUser) {
      return {
        success: false,
        error: 'Phone number already exists'
      };
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: {
          phoneNumber: newPhoneNumber,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    return {
      success: true,
      message: 'User updated successfully'
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: 'Failed to update user'
    };
  }
}

