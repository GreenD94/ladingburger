import { useState, useEffect } from 'react';
import { Burger } from '@/features/database/types';
import { OrderFormState } from '../types/order.types';
import { getAvailableBurgers } from '@/features/database/actions/menu';
import { createOrder } from '@/features/database/actions/orders';
import { OrderStatus, PaymentStatus } from '@/features/database/types';

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
    if (!state.phoneNumber) {
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
            burgerId: burger._id!.toString(),
            removedIngredients: burger.removedIngredients,
            quantity: 1
          })),
        totalPrice: state.selectedBurgers.reduce((sum, burger) => sum + burger.price, 0),
        status: OrderStatus.WAITING_PAYMENT,
        paymentInfo: {
          bankAccount: '',
          transferReference: '',
          paymentStatus: PaymentStatus.PENDING
        }
      });

      if (order.success) {
        window.location.href = '/order-confirmation';
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