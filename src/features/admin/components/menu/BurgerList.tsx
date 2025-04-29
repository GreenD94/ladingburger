'use client';

import React, { useState } from 'react';
import { Burger } from '@/features/database/types';

// Lista predefinida de ingredientes comunes para hamburguesas
const COMMON_INGREDIENTS = [
  'Carne', 
  'Queso Crema', 
  'Queso Cheddar', 
  'Tomate', 
  'Lechuga', 
  'Cebolla', 
  'Cebolla Caramelizada',
  'BBQ', 
  'Maíz', 
  'Bacon', 
  'Huevo',
  'Pepinillos',
  'Champiñones',
  'Aguacate',
  'Pan',
  'Salsa Especial'
];

interface BurgerListProps {
  burgers: Burger[];
  onEdit: (burger: Burger) => void;
  onDelete: (burgerId: string) => void;
  onUpdateIngredients?: (burgerId: string, ingredients: string[]) => Promise<{ success: boolean; error?: string }>;
}

export const BurgerList: React.FC<BurgerListProps> = ({ 
  burgers, 
  onEdit, 
  onDelete, 
  onUpdateIngredients 
}) => {
  const [editingIngredientsFor, setEditingIngredientsFor] = useState<string | null>(null);
  const [tempIngredients, setTempIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [saving, setSaving] = useState(false);

  // Obtener la hamburguesa que se está editando actualmente (si hay alguna)
  const currentBurger = editingIngredientsFor 
    ? burgers.find(b => b._id && b._id.toString() === editingIngredientsFor) 
    : null;

  // Abrir el diálogo de edición de ingredientes
  const handleOpenIngredientsEditor = (burger: Burger) => {
    if (burger._id) {
      console.log('Opening ingredients editor for burger:', burger);
      setEditingIngredientsFor(burger._id.toString());
      setTempIngredients([...burger.ingredients]);
    } else {
      console.error('Cannot edit ingredients: burger has no ID');
      showSnackbar('Error: No se puede editar los ingredientes', 'error');
    }
  };

  // Cerrar el diálogo sin guardar cambios
  const handleCloseIngredientsEditor = () => {
    setEditingIngredientsFor(null);
    setTempIngredients([]);
    setCustomIngredient('');
    setSaving(false);
  };

  // Mostrar notificación
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Guardar los cambios en los ingredientes
  const handleSaveIngredients = async () => {
    if (!editingIngredientsFor || !onUpdateIngredients) {
      console.error('Cannot save ingredients: missing burger ID or update function');
      return;
    }

    try {
      setSaving(true);
      console.log('Saving ingredients for burger:', editingIngredientsFor);
      console.log('Ingredients to save:', tempIngredients);
      
      const result = await onUpdateIngredients(editingIngredientsFor, tempIngredients);
      console.log('Save result:', result);
      
      if (result.success) {
        showSnackbar('Ingredientes actualizados con éxito', 'success');
        handleCloseIngredientsEditor();
      } else {
        console.error('Failed to update ingredients:', result.error);
        showSnackbar(`Error: ${result.error || 'No se pudieron actualizar los ingredientes'}`, 'error');
      }
    } catch (error) {
      console.error('Error saving ingredients:', error);
      showSnackbar('Error al guardar los ingredientes', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Manejar la selección/deselección de ingredientes
  const handleIngredientToggle = (ingredient: string) => {
    console.log('Toggling ingredient:', ingredient);
    if (tempIngredients.includes(ingredient)) {
      setTempIngredients(prev => prev.filter(ing => ing !== ingredient));
    } else {
      setTempIngredients(prev => [...prev, ingredient]);
    }
  };

  // Añadir un ingrediente personalizado
  const handleAddCustomIngredient = () => {
    if (customIngredient.trim() === '') return;
    
    console.log('Adding custom ingredient:', customIngredient);
    if (!tempIngredients.includes(customIngredient.trim())) {
      setTempIngredients(prev => [...prev, customIngredient.trim()]);
      setCustomIngredient('');
    }
  };

  // Eliminar un ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    console.log('Removing ingredient:', ingredient);
    setTempIngredients(prev => prev.filter(ing => ing !== ingredient));
  };

  return (
    <>
      <div className="divide-y divide-gray-200">
        {burgers.map((burger) => (
          <div key={burger._id?.toString()} className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-brand focus:ring-orange-brand" />
                  <h3 className="text-lg font-medium text-gray-dark">{burger.name}</h3>
                </div>
                
                <p className="text-sm text-gray-text">{burger.description}</p>
                
                <p className="text-orange-brand font-medium">${burger.price.toFixed(2)}</p>
                
                <div className="flex flex-wrap gap-2">
                  {burger.ingredients.map((ingredient, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-brand"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => onEdit(burger)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  onClick={() => onDelete(burger._id!.toString())}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición de ingredientes */}
      {editingIngredientsFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-dark">Editar Ingredientes</h3>
              <button 
                onClick={handleCloseIngredientsEditor}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tempIngredients.map(ingredient => (
                  <span 
                    key={ingredient} 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-brand"
                  >
                    {ingredient}
                    <button 
                      onClick={() => handleRemoveIngredient(ingredient)}
                      className="ml-1 text-orange-brand hover:text-orange-hover"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {COMMON_INGREDIENTS.map(ingredient => (
                  <label key={ingredient} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tempIngredients.includes(ingredient)}
                      onChange={() => handleIngredientToggle(ingredient)}
                      className="form-checkbox rounded border-gray-300 text-orange-brand focus:ring-orange-brand"
                    />
                    <span className="text-sm text-gray-text">{ingredient}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customIngredient}
                  onChange={(e) => setCustomIngredient(e.target.value)}
                  placeholder="Agregar ingrediente personalizado"
                  className="form-input flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-brand focus:ring-orange-brand text-sm"
                />
                <button 
                  onClick={handleAddCustomIngredient}
                  className="px-4 py-2 bg-orange-brand text-white rounded-md text-sm font-medium hover:bg-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-brand"
                >
                  Agregar
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleCloseIngredientsEditor}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-brand"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveIngredients}
                disabled={saving}
                className="px-4 py-2 bg-orange-brand text-white rounded-md text-sm font-medium hover:bg-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-brand"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbarOpen && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          snackbarSeverity === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        } border`}>
          <div className="flex items-center gap-2">
            <span className={snackbarSeverity === 'success' ? 'text-green-700' : 'text-red-700'}>
              {snackbarMessage}
            </span>
            <button 
              onClick={() => setSnackbarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 