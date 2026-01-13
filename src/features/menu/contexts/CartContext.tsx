'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Burger } from '@/features/database/types';

export interface CartItem {
  burger: Burger;
  quantity: number;
  removedIngredients?: string[];
  note?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (burger: Burger, quantity?: number, removedIngredients?: string[], note?: string) => void;
  removeItem: (burgerId: string) => void;
  updateQuantity: (burgerId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (
    burger: Burger,
    quantity: number = 1,
    removedIngredients: string[] = [],
    note?: string
  ) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.burger._id === burger._id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.burger._id === burger._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { burger, quantity, removedIngredients, note }];
    });
  };

  const removeItem = (burgerId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.burger._id !== burgerId));
  };

  const updateQuantity = (burgerId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(burgerId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.burger._id === burgerId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.burger.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

