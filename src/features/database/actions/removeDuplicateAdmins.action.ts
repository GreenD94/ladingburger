'use server';

import { connectToDatabase } from './connect.action';
import { ObjectId } from 'mongodb';

export interface RemoveDuplicatesResponse {
  success: boolean;
  removedCount?: number;
  message?: string;
  error?: string;
}

export async function removeDuplicateAdminsAction(): Promise<RemoveDuplicatesResponse> {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admins');

    const admins = await adminsCollection.find({}).toArray();
    const emailMap = new Map<string, typeof admins>();
    
    admins.forEach((admin) => {
      const normalizedEmail = (admin.email as string || '').trim().toLowerCase();
      if (!emailMap.has(normalizedEmail)) {
        emailMap.set(normalizedEmail, []);
      }
      emailMap.get(normalizedEmail)?.push(admin);
    });

    let removedCount = 0;
    const idsToRemove: ObjectId[] = [];

    emailMap.forEach((adminGroup, email) => {
      if (adminGroup.length > 1) {
        adminGroup.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });

        const keepAdmin = adminGroup[0];
        const duplicates = adminGroup.slice(1);
        
        duplicates.forEach((duplicate) => {
          if (duplicate._id) {
            idsToRemove.push(duplicate._id as ObjectId);
            removedCount++;
          }
        });
      }
    });

    if (idsToRemove.length > 0) {
      const result = await adminsCollection.deleteMany({
        _id: { $in: idsToRemove },
      });
      
      return {
        success: true,
        removedCount: result.deletedCount,
        message: `Removed ${result.deletedCount} duplicate admin(s). Kept the oldest admin for each email.`,
      };
    }

    return {
      success: true,
      removedCount: 0,
      message: 'No duplicate admins found',
    };
  } catch (error) {
    console.error('Error removing duplicate admins:', error);
    return {
      success: false,
      error: 'Error removing duplicate admins',
    };
  }
}

