'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Burger } from '@/features/database/types/index.type';
import { DEFAULT_QUANTITY } from '../constants/defaults.constants';
import { EMPTY_STRING_ARRAY, EMPTY_CART_ITEMS } from '../constants/emptyArrays.constants';

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

const EMPTY_CART_CONTEXT_VALUE: CartContextType = {
  items: [],
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0,
};

const CartContext = createContext<CartContextType>(EMPTY_CART_CONTEXT_VALUE);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (
    burger: Burger,
    quantity: number = DEFAULT_QUANTITY,
    removedIngredients: string[] = EMPTY_STRING_ARRAY,
    note?: string
  ) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.burger._id === burger._id);
      const hasExistingItem = existingItem !== undefined;
      
      if (hasExistingItem) {
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
    const shouldRemoveItem = quantity <= 0;
    
    if (shouldRemoveItem) {
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
    setItems(EMPTY_CART_ITEMS);
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
  const hasContext = context !== undefined;
  
  if (!hasContext) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

