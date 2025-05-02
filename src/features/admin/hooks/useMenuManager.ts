import { useState, useEffect, useCallback } from 'react';
import { Burger, BURGER_IMAGES, BurgerImage } from '@/features/database/types/burger';
import { createBurger, updateBurger, deleteBurger, getAvailableBurgers } from '@/features/database/actions/menu';

export type EditingBurger = Omit<Burger, '_id'> & { _id?: string };

interface Notification {
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const normalizeImage = (img: string): BurgerImage =>
  (Object.values(BURGER_IMAGES) as string[]).includes(img)
    ? (img as BurgerImage)
    : BURGER_IMAGES.CLASSIC;

export function useMenuManager() {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Función para mostrar notificaciones
  const showNotification = (message: string, severity: Notification['severity'] = 'success') => {
    setNotification({ message, severity });
    // Limpiar la notificación después de 4 segundos
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    loadBurgers();
  }, []);

  const loadBurgers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedBurgers = await getAvailableBurgers();
      setBurgers(
        (loadedBurgers || []).map(b => ({
          ...b,
          image: normalizeImage(b.image),
        }))
      );
    } catch (err) {
      console.error('Error loading burgers:', err);
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
    const result = await removeBurger(id);
    if (result.success) {
      showNotification('Hamburguesa eliminada exitosamente');
    } else {
      showNotification(result.error || 'Error al eliminar la hamburguesa', 'error');
    }
  };

  const handleSave = async (burger: Omit<Burger, '_id'> | Burger) => {
    try {
      if ('_id' in burger && burger._id) {
        const { _id, ...burgerData } = burger;
        const result = await editBurger(_id.toString(), burgerData);
        if (result.success) {
          showNotification('Hamburguesa actualizada exitosamente');
        } else {
          showNotification(result.error || 'Error al actualizar la hamburguesa', 'error');
          return;
        }
      } else {
        const result = await addBurger(burger as Omit<Burger, '_id'>);
        if (result.success) {
          showNotification('Nueva hamburguesa creada exitosamente');
        } else {
          showNotification(result.error || 'Error al crear la hamburguesa', 'error');
          return;
        }
      }
      setIsEditing(false);
      setSelectedBurger(null);
      await loadBurgers();
    } catch (err) {
      showNotification('Error al guardar la hamburguesa', 'error');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedBurger(null);
  };

  const handleUpdateIngredients = async (burgerId: string, ingredients: string[], ingredientCosts?: Record<string, number>) => {
    try {
      console.log('Updating ingredients for burger:', burgerId);
      console.log('New ingredients list:', ingredients);
      console.log('Custom ingredient costs:', ingredientCosts);
      
      // Verificar que el ID y los ingredientes sean válidos
      if (!burgerId || !burgerId.trim()) {
        console.error('Invalid burger ID:', burgerId);
        return { success: false, error: 'Invalid burger ID' };
      }
      
      if (!Array.isArray(ingredients)) {
        console.error('Invalid ingredients array:', ingredients);
        return { success: false, error: 'Invalid ingredients format' };
      }
      
      // Preparar los datos para actualizar
      const updateData: {
        ingredients: string[];
        ingredientCosts?: Record<string, number>;
      } = {
        ingredients
      };
      
      // Añadir los costos personalizados si existen
      if (ingredientCosts && Object.keys(ingredientCosts).length > 0) {
        updateData.ingredientCosts = ingredientCosts;
      }
      
      const result = await updateBurger(burgerId, updateData);
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

  // Nueva función para actualizar el precio de forma independiente
  const handleUpdatePrice = async (burgerId: string, price: number) => {
    try {
      console.log('Updating price for burger:', burgerId);
      console.log('New price:', price);
      
      // Verificar que el ID sea válido
      if (!burgerId || !burgerId.trim()) {
        console.error('Invalid burger ID:', burgerId);
        return { success: false, error: 'Invalid burger ID' };
      }
      
      // Verificar que el precio sea válido
      if (isNaN(Number(price))) {
        console.error('Invalid price value:', price);
        return { success: false, error: 'Invalid price value' };
      }
      
      const result = await updateBurger(burgerId, { price: Number(price) });
      console.log('Update price result:', result);
      
      if (!result.success) {
        console.error('Price update failed with error:', result.error);
        throw new Error(result.error);
      }
      
      console.log('Price update successful, reloading burgers...');
      await loadBurgers();
      return { success: true };
    } catch (err) {
      console.error('Error updating price:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update price' };
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
      console.error('Error creating burger:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create burger' 
      };
    }
  };

  const editBurger = async (id: string, burger: Partial<Omit<Burger, '_id'>>) => {
    try {
      const result = await updateBurger(id, burger);
      if (!result.success) {
        throw new Error(result.error);
      }
      await loadBurgers();
      return { success: true };
    } catch (err) {
      console.error('Error updating burger:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update burger' 
      };
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
    notification,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    handleUpdateIngredients,
    handleUpdatePrice,
    addBurger,
    editBurger,
    removeBurger
  };
} 