import { useState, useEffect, useCallback } from 'react';
import { Burger } from '@/features/database/types';
import { createBurger, updateBurger, deleteBurger, getAvailableBurgers } from '@/features/database/actions/menu';

export function useMenuManager() {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);

  useEffect(() => {
    loadBurgers();
  }, []);

  const loadBurgers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const burgerData = await getAvailableBurgers() as Burger[];
      setBurgers(burgerData);
    } catch (error) {
      console.error('Error loading burgers:', error);
      setError('Failed to load burgers');
      setBurgers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddNew = () => {
    setSelectedBurger(null);
    setIsEditing(true);
  };

  const handleEdit = (burger: Burger) => {
    setSelectedBurger(burger);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta hamburguesa?')) {
      await removeBurger(id);
    }
  };

  const handleSave = async (burger: Omit<Burger, '_id'> | Burger) => {
    if ('_id' in burger && burger._id) {
      const { _id, ...burgerData } = burger;
      await editBurger(_id.toString(), burgerData);
    } else {
      await addBurger(burger as Omit<Burger, '_id'>);
    }
    setIsEditing(false);
    setSelectedBurger(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedBurger(null);
  };

  const handleUpdateIngredients = async (burgerId: string, ingredients: string[]) => {
    try {
      console.log('Updating ingredients for burger:', burgerId);
      console.log('New ingredients list:', ingredients);
      
      // Verificar que el ID y los ingredientes sean válidos
      if (!burgerId || !burgerId.trim()) {
        console.error('Invalid burger ID:', burgerId);
        return { success: false, error: 'Invalid burger ID' };
      }
      
      if (!Array.isArray(ingredients)) {
        console.error('Invalid ingredients array:', ingredients);
        return { success: false, error: 'Invalid ingredients format' };
      }
      
      const result = await updateBurger(burgerId, { ingredients });
      console.log('Update result:', result);
      
      if (!result.success) {
        console.error('Update failed with error:', result.error);
        throw new Error(result.error);
      }
      
      console.log('Update successful, reloading burgers...');
      await loadBurgers();
      return { success: true };
    } catch (err) {
      console.error('Error updating ingredients:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update ingredients' };
    }
  };

  const addBurger = async (burger: Omit<Burger, '_id'>) => {
    try {
      const result = await createBurger(burger);
      if (!result.success) {
        throw new Error(result.error);
      }
      await loadBurgers();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Failed to add burger' };
    }
  };

  const editBurger = async (id: string, burger: Partial<Omit<Burger, '_id'>>) => {
    try {
      console.log('Updating burger with ID:', id);
      console.log('Update data:', burger);
      
      // Asegurarse de que el precio sea un número
      if (burger.price !== undefined && isNaN(Number(burger.price))) {
        console.error('Invalid price:', burger.price);
        throw new Error('Invalid price value');
      }
      
      const result = await updateBurger(id, burger);
      console.log('Update result:', result);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      await loadBurgers();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Failed to update burger' };
    }
  };

  const removeBurger = async (id: string) => {
    try {
      const result = await deleteBurger(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      await loadBurgers();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Failed to delete burger' };
    }
  };

  return {
    burgers,
    loading,
    error,
    isEditing,
    selectedBurger,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    handleUpdateIngredients,
    addBurger,
    editBurger,
    removeBurger
  };
} 