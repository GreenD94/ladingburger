import { useState, useEffect } from 'react';
import { Burger } from '@/features/database/types/index.type';
import { OrderFormState } from '../types/order.type';
import { getAvailableBurgers } from '@/features/menu/actions/menu.action';
import { createOrder } from '@/features/orders/actions/orders.action';
import { OrderStatus } from '@/features/database/types/index.type';
import { OrderStatusLabels } from '@/features/database/types/index.type';

export const useOrderForm = () => {
  const [state, setState] = useState<OrderFormState>({
    burgers: [],
    selectedBurgers: [],
    phoneNumber: '',
    showPhoneDialog: false,
    loading: false
  });

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const availableBurgers = await getAvailableBurgers();
        if (availableBurgers) {
          setState(prev => ({ ...prev, burgers: availableBurgers }));
        }
      } catch (error) {
        console.error('Error al cargar el menú:', error);
      }
    };

    fetchBurgers();
  }, []);

  const handleAddBurger = (burger: Burger) => {
    setState(prev => ({
      ...prev,
      selectedBurgers: [...prev.selectedBurgers, { ...burger, removedIngredients: [] }]
    }));
  };

  const handleRemoveIngredient = (burgerIndex: number, ingredient: string) => {
    setState(prev => {
      const updated = [...prev.selectedBurgers];
      if (!updated[burgerIndex].removedIngredients.includes(ingredient)) {
        updated[burgerIndex].removedIngredients.push(ingredient);
      }
      return { ...prev, selectedBurgers: updated };
    });
  };

  const handleAddIngredient = (burgerIndex: number, ingredient: string) => {
    setState(prev => {
      const updated = [...prev.selectedBurgers];
      updated[burgerIndex].removedIngredients = updated[burgerIndex].removedIngredients.filter(i => i !== ingredient);
      return { ...prev, selectedBurgers: updated };
    });
  };

  const handleAddNote = (burgerIndex: number, note: string) => {
    setState(prev => {
      const updated = [...prev.selectedBurgers];
      updated[burgerIndex].note = note;
      return { ...prev, selectedBurgers: updated };
    });
  };

  const handleRemoveBurger = (index: number) => {
    setState(prev => ({
      ...prev,
      selectedBurgers: prev.selectedBurgers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitOrder = async () => {
    if (!state.phoneNumber || state.phoneNumber === '') {
      setState(prev => ({ ...prev, showPhoneDialog: true }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    try {
      const order = await createOrder({
        customerPhone: state.phoneNumber,
        items: state.selectedBurgers
          .filter(burger => burger._id)
          .map(burger => ({
            burgerId: burger._id?.toString() || '',
            removedIngredients: burger.removedIngredients || [],
            quantity: 1,
            note: burger.note || ''
          }))
      });

      if (order.success) {
        window.location.href = `/orders?phoneNumber=${state.phoneNumber}`;
      }
    } catch (error) {
      console.error('Error al crear la orden:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    state,
    setState,
    handleAddBurger,
    handleRemoveIngredient,
    handleAddIngredient,
    handleAddNote,
    handleRemoveBurger,
    handleSubmitOrder
  };
};

