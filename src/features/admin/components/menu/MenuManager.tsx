'use client';

import React from 'react';
import { BurgerList } from './BurgerList';
import { BurgerForm } from './BurgerForm';
import { useMenuManager } from '@/features/admin/hooks/useMenuManager';

export const MenuManager: React.FC = () => {
  const {
    burgers,
    isEditing,
    selectedBurger,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    handleUpdateIngredients
  } = useMenuManager();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-dark">Gestión del Menú</h1>
        <button 
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 bg-orange-brand text-white text-sm font-medium rounded-md hover:bg-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-brand"
        >
          Agregar Nueva Hamburguesa
        </button>
      </div>

      {isEditing ? (
        <BurgerForm 
          burger={selectedBurger} 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <BurgerList 
            burgers={burgers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateIngredients={handleUpdateIngredients}
          />
        </div>
      )}
    </div>
  );
};
