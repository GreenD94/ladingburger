'use server';

import { cookies } from 'next/headers';
import { getOrCreateUser } from '@/features/database/actions/users/getOrCreateUser.action';
import { getUserByPhone } from '@/features/database/actions/users/getUserByPhone.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { User } from '@/features/database/types/index.type';

const USER_PHONE_COOKIE_NAME = 'userPhone';

export async function loginUser(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!phoneNumber || phoneNumber.length !== 11 || !phoneNumber.startsWith('04')) {
      return {
        success: false,
        error: 'Invalid phone number format. Must be 11 digits starting with 04',
      };
    }

    const { userId } = await getOrCreateUser(phoneNumber);

    const cookieStore = await cookies();
    cookieStore.set(USER_PHONE_COOKIE_NAME, phoneNumber, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { success: true };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      success: false,
      error: 'Failed to login user',
    };
  }
}

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(USER_PHONE_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error('Error logging out user:', error);
    return { success: false };
  }
}

export async function getCurrentUser(): Promise<{ phoneNumber: string }> {
  try {
    const cookieStore = await cookies();
    const phoneNumber = cookieStore.get(USER_PHONE_COOKIE_NAME)?.value || EMPTY_STRING;
    return { phoneNumber };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { phoneNumber: EMPTY_STRING };
  }
}

export async function checkUserSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const phoneNumber = cookieStore.get(USER_PHONE_COOKIE_NAME)?.value || EMPTY_STRING;
    const hasValidPhoneNumber = phoneNumber !== EMPTY_STRING && phoneNumber.length === 11;
    return hasValidPhoneNumber;
  } catch (error) {
    console.error('Error checking user session:', error);
    return false;
  }
}

export async function getCurrentUserData(): Promise<User> {
  try {
    const cookieStore = await cookies();
    const phoneNumber = cookieStore.get(USER_PHONE_COOKIE_NAME)?.value || EMPTY_STRING;
    const hasValidPhoneNumber = phoneNumber !== EMPTY_STRING && phoneNumber.length === 11;
    
    if (!hasValidPhoneNumber) {
      return {
        phoneNumber: EMPTY_STRING,
        name: '',
        birthdate: new Date(0),
        gender: '',
        notes: '',
        tags: [],
        createdAt: new Date(0),
        updatedAt: new Date(0),
      };
    }
    
    const user = await getUserByPhone(phoneNumber);
    return user;
  } catch (error) {
    console.error('Error getting current user data:', error);
    return {
      phoneNumber: EMPTY_STRING,
      name: '',
      birthdate: new Date(0),
      gender: '',
      notes: '',
      tags: [],
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  }
}

