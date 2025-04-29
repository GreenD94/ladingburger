'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

interface BurgerFormProps {
  burger: Burger | null;
  onSave: (burgerData: Burger) => void;
  onCancel: () => void;
}

export const BurgerForm: React.FC<BurgerFormProps> = ({ burger, onSave, onCancel }) => {
  console.log("Rendering BurgerForm with burger:", burger);
  
  const defaultValues = {
    _id: burger?._id || undefined,
    name: burger?.name || '',
    description: burger?.description || '',
    price: burger?.price || 0,
    ingredients: burger?.ingredients || [],
    image: burger?.image || '',
    category: burger?.category || 'hamburguesa',
    isAvailable: burger?.isAvailable !== false
  };
  
  console.log("Default form values:", defaultValues);
  
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<Burger>({
    defaultValues
  });
  
  // State para controlar el campo de ingrediente personalizado
  const [customIngredient, setCustomIngredient] = useState('');
  
  // Obtener el valor actual de ingredients del formulario
  const currentIngredients = watch('ingredients');
  const nameValue = watch('name');
  const descriptionValue = watch('description');
  const priceValue = watch('price');
  const imageValue = watch('image');
  const categoryValue = watch('category');
  const isAvailableValue = watch('isAvailable');
  
  useEffect(() => {
    console.log("Form values changed:");
    console.log("Name:", nameValue);
    console.log("Description:", descriptionValue);
    console.log("Price:", priceValue);
    console.log("Ingredients:", currentIngredients);
    console.log("Image:", imageValue);
    console.log("Category:", categoryValue);
    console.log("IsAvailable:", isAvailableValue);
  }, [nameValue, descriptionValue, priceValue, currentIngredients, imageValue, categoryValue, isAvailableValue]);

  // Manejador para los checkbox de ingredientes
  const handleIngredientToggle = (ingredient: string) => {
    const updatedIngredients = [...currentIngredients];
    
    if (updatedIngredients.includes(ingredient)) {
      // Eliminar el ingrediente si ya está seleccionado
      setValue('ingredients', updatedIngredients.filter(ing => ing !== ingredient));
    } else {
      // Agregar el ingrediente si no está seleccionado
      setValue('ingredients', [...updatedIngredients, ingredient]);
    }
  };

  // Manejador para añadir un ingrediente personalizado
  const handleAddCustomIngredient = () => {
    if (customIngredient.trim() === '') return;
    
    if (!currentIngredients.includes(customIngredient.trim())) {
      setValue('ingredients', [...currentIngredients, customIngredient.trim()]);
      setCustomIngredient('');
    }
  };

  // Manejador para eliminar un ingrediente
  const handleRemoveIngredient = (ingredient: string) => {
    setValue('ingredients', currentIngredients.filter(ing => ing !== ingredient));
  };

  // Manejador para el cambio en el precio
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Convertir a número o usar un valor predeterminado si no es válido
    const numericValue = value === '' ? 0 : parseFloat(value);
    
    // Solo establecer si es un número válido
    if (!isNaN(numericValue)) {
      setValue('price', numericValue);
    }
  };

  const onSubmit = (data: Burger) => {
    // Asegurarse de que el precio sea un número válido antes de enviar
    const finalData = {
      ...data,
      price: typeof data.price === 'number' && !isNaN(data.price) ? data.price : 0
    };
    
    console.log("Form submitted with data:", finalData);
    onSave(finalData);
  };

  return (
    <div className="bg-white rounded-lg p-6 mx-auto max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {burger ? 'Editar Hamburguesa' : 'Agregar Nueva Hamburguesa'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={nameValue}
              onChange={(e) => setValue('name', e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={priceValue}
                onChange={(e) => setValue('price', parseFloat(e.target.value))}
                required
                className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={descriptionValue}
            onChange={(e) => setValue('description', e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            URL de la imagen
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={imageValue}
            onChange={(e) => setValue('image', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
              Ingredientes
            </label>
            <span className="text-xs text-gray-500">Selecciona o agrega ingredientes</span>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {/* Ingredientes seleccionados */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {currentIngredients.length > 0 ? (
                  currentIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="ml-1 text-orange-700 hover:text-orange-900"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No hay ingredientes seleccionados</span>
                )}
              </div>
            </div>
            
            {/* Ingredientes comunes */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-gray-700">Ingredientes comunes:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_INGREDIENTS.map((ingredient) => (
                  <label key={ingredient} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentIngredients.includes(ingredient)}
                      onChange={() => handleIngredientToggle(ingredient)}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{ingredient}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Campo para agregar ingredientes personalizados */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                placeholder="Ingrediente personalizado"
                className="block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddCustomIngredient}
                className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {burger ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}; 