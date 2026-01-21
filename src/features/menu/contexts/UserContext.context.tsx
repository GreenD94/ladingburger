'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/features/database/types/index.type';
import { EMPTY_USER } from '@/features/database/constants/emptyObjects.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { getCurrentUserData, checkUserSession } from '../actions/userAuth.action';
import { logError } from '../utils/logError.util';

const USER_STORAGE_KEY = 'saborea_user_data';

interface UserContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
  logout: () => Promise<void>;
}

const EMPTY_USER_CONTEXT_VALUE: UserContextType = {
  user: EMPTY_USER,
  isAuthenticated: false,
  isLoading: true,
  refreshUser: async () => {},
  clearUser: () => {},
  logout: async () => {},
};

const UserContext = createContext<UserContextType>(EMPTY_USER_CONTEXT_VALUE);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(EMPTY_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserFromStorage = useCallback((): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt),
        };
      }
    } catch (error) {
      logError('Error loading user from storage:', error);
    }
    return null;
  }, []);

  const saveUserToStorage = useCallback((userData: User) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      logError('Error saving user to storage:', error);
    }
  }, []);

  const clearUserFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      logError('Error clearing user from storage:', error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const isLoggedIn = await checkUserSession();
      
      if (isLoggedIn) {
        const userData = await getCurrentUserData();
        const hasValidUser = userData.phoneNumber !== EMPTY_STRING;
        
        if (hasValidUser) {
          setUser(userData);
          setIsAuthenticated(true);
          saveUserToStorage(userData);
        } else {
          setUser(EMPTY_USER);
          setIsAuthenticated(false);
          clearUserFromStorage();
        }
      } else {
        setUser(EMPTY_USER);
        setIsAuthenticated(false);
        clearUserFromStorage();
      }
    } catch (error) {
      logError('Error refreshing user:', error);
      setUser(EMPTY_USER);
      setIsAuthenticated(false);
      clearUserFromStorage();
    } finally {
      setIsLoading(false);
    }
  }, [saveUserToStorage, clearUserFromStorage]);

  const clearUser = useCallback(() => {
    setUser(EMPTY_USER);
    setIsAuthenticated(false);
    clearUserFromStorage();
  }, [clearUserFromStorage]);

  const logout = useCallback(async () => {
    try {
      const { logoutUser } = await import('../actions/userAuth.action');
      await logoutUser();
      clearUser();
    } catch (error) {
      logError('Error logging out:', error);
      clearUser();
    }
  }, [clearUser]);

  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = loadUserFromStorage();
      
      if (storedUser && storedUser.phoneNumber !== EMPTY_STRING) {
        setUser(storedUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        refreshUser();
      } else {
        await refreshUser();
      }
    };

    initializeUser();
  }, [loadUserFromStorage, refreshUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        refreshUser,
        clearUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  const hasContext = context !== undefined;
  
  if (!hasContext) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};

