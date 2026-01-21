'use server';

import { connectToDatabase } from '../../actions/connect.action';
import { ObjectId } from 'mongodb';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { getEtiquetasAction } from '@/features/etiquetas/actions/getEtiquetas.action';
import { updateActiveOrdersForUser } from '@/features/orders/utils/updateActiveOrdersForUser.util';

export interface UpdateUserInput {
  phoneNumber?: string;
  name?: string;
  birthdate?: Date;
  gender?: string;
  notes?: string;
  tags?: string[];
}

export async function updateUser(userId: string, updates: UpdateUserInput) {
  try {
    const { db } = await connectToDatabase();
    
    if (updates.phoneNumber) {
      const existingUser = await db.collection('users').findOne({ 
        phoneNumber: updates.phoneNumber,
        _id: { $ne: new ObjectId(userId) }
      });
      
      if (existingUser) {
        return {
          success: false,
          error: 'Phone number already exists'
        };
      }
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date()
    };

    if (updates.phoneNumber !== undefined) {
      updateData.phoneNumber = updates.phoneNumber;
    }

    if (updates.name !== undefined) {
      updateData.name = updates.name.trim() !== EMPTY_STRING ? updates.name.trim() : undefined;
    }

    if (updates.birthdate !== undefined) {
      updateData.birthdate = updates.birthdate && !isNaN(updates.birthdate.getTime()) ? updates.birthdate : undefined;
    }

    if (updates.gender !== undefined) {
      updateData.gender = updates.gender.trim() !== EMPTY_STRING ? updates.gender.trim() : undefined;
    }

    if (updates.notes !== undefined) {
      updateData.notes = updates.notes.trim() !== EMPTY_STRING ? updates.notes.trim() : undefined;
    }

    if (updates.tags !== undefined) {
      const currentUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      const currentTags = (currentUser?.tags as string[]) || [];

      const etiquetasResponse = await getEtiquetasAction();
      const systemManagedTagNames: string[] = [];
      if (etiquetasResponse.success && etiquetasResponse.data) {
        etiquetasResponse.data
          .filter(etiqueta => etiqueta.isSystemManaged)
          .forEach(etiqueta => {
            systemManagedTagNames.push(etiqueta.name);
          });
      }

      const newTags = updates.tags.filter(tag => tag.trim() !== EMPTY_STRING);
      const currentSystemTags = currentTags.filter(tag => systemManagedTagNames.includes(tag));
      const finalTags = [...currentSystemTags, ...newTags.filter(tag => !systemManagedTagNames.includes(tag))];

      updateData.tags = finalTags;
    }

    const currentUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!currentUser) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const oldPhoneNumber = (currentUser.phoneNumber as string) || '';
    const oldName = (currentUser.name as string) || '';

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const phoneChanged = updates.phoneNumber !== undefined && updates.phoneNumber !== oldPhoneNumber;
    const nameChanged = updates.name !== undefined && updates.name.trim() !== (oldName || EMPTY_STRING);

    if (phoneChanged || nameChanged) {
      try {
        const newPhone = phoneChanged ? updates.phoneNumber : undefined;
        const newName = nameChanged ? (updates.name?.trim() || undefined) : undefined;
        await updateActiveOrdersForUser(userId, oldPhoneNumber, newPhone, newName);
      } catch (error) {
        console.error('Error updating active orders for user:', error);
      }
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

