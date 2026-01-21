'use server';

import { removeDuplicateAdminsAction } from '../actions/removeDuplicateAdmins.action';
import { createAdminEmailIndexAction } from '../actions/createAdminEmailIndex.action';

export interface SetupAdminIndexResponse {
  success: boolean;
  duplicatesRemoved?: number;
  indexCreated?: boolean;
  message?: string;
  error?: string;
}

export async function setupAdminIndexUtil(): Promise<SetupAdminIndexResponse> {
  try {
    const removeDuplicatesResult = await removeDuplicateAdminsAction();
    
    if (!removeDuplicatesResult.success) {
      return {
        success: false,
        error: removeDuplicatesResult.error || 'Error removing duplicates',
      };
    }

    const createIndexResult = await createAdminEmailIndexAction();
    
    if (!createIndexResult.success) {
      return {
        success: false,
        duplicatesRemoved: removeDuplicatesResult.removedCount,
        error: createIndexResult.error || 'Error creating index',
      };
    }

    return {
      success: true,
      duplicatesRemoved: removeDuplicatesResult.removedCount || 0,
      indexCreated: true,
      message: `Successfully removed ${removeDuplicatesResult.removedCount || 0} duplicate(s) and created unique index on email field`,
    };
  } catch (error) {
    console.error('Error setting up admin index:', error);
    return {
      success: false,
      error: 'Error setting up admin index',
    };
  }
}

