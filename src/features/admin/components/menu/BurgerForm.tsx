'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Box, 
  TextField, 
  Button, 
  Stack, 
  Typography, 
  FormControlLabel, 
  Checkbox,
  FormGroup,
  FormLabel,
  Grid,
  Chip,
  Paper
} from '@mui/material';
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
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        {burger ? 'Editar Hamburguesa' : 'Nueva Hamburguesa'}
      </Typography>

      <Stack spacing={3}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field }) => (
            <div>
              <label htmlFor="name">Nombre*</label>
              <input
                id="name"
                type="text"
                {...field}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: errors.name ? '1px solid red' : '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              {errors.name && (
                <p style={{ color: 'red', margin: '4px 0' }}>{errors.name.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                {...field}
                rows={3}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        />

        <Controller
          name="price"
          control={control}
          rules={{ 
            required: "El precio es obligatorio", 
            min: { value: 0, message: "El precio debe ser mayor a 0" }
          }}
          render={({ field }) => (
            <div>
              <label htmlFor="price">Precio*</label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={field.value}
                onChange={handlePriceChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: errors.price ? '1px solid red' : '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              {errors.price && (
                <p style={{ color: 'red', margin: '4px 0' }}>{errors.price.message}</p>
              )}
            </div>
          )}
        />

        {/* Sección de ingredientes seleccionados */}
        <div>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Ingredientes seleccionados:</p>
          <div 
            style={{ 
              padding: '16px', 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              minHeight: '50px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            {currentIngredients.length > 0 ? (
              currentIngredients.map(ingredient => (
                <div
                  key={ingredient}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderRadius: '16px',
                    border: '1px solid #FF6B00',
                    color: '#FF6B00',
                    background: 'white'
                  }}
                >
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ingredient)}
                    style={{
                      marginLeft: '4px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#FF6B00',
                      padding: '2px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: '#666' }}>
                No hay ingredientes seleccionados
              </p>
            )}
          </div>
        </div>

        {/* Selección de ingredientes comunes */}
        <div>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Selecciona los ingredientes:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {COMMON_INGREDIENTS.map(ingredient => (
              <div key={ingredient} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={`ingredient-${ingredient}`}
                  checked={currentIngredients.includes(ingredient)}
                  onChange={() => handleIngredientToggle(ingredient)}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor={`ingredient-${ingredient}`}>{ingredient}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Campo para añadir ingredientes personalizados */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Ingrediente personalizado"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            style={{ 
              flexGrow: 1,
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button 
            type="button"
            onClick={handleAddCustomIngredient}
            style={{ 
              background: '#FF6B00', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0 16px',
              cursor: 'pointer',
              minWidth: '120px'
            }}
          >
            Añadir
          </button>
        </div>

        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="image">URL de la imagen</label>
              <input
                id="image"
                type="text"
                {...field}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="category">Categoría</label>
              <input
                id="category"
                type="text"
                {...field}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        />

        <Controller
          name="isAvailable"
          control={control}
          render={({ field }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="isAvailable"
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="isAvailable">Disponible</label>
            </div>
          )}
        />

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            style={{ 
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              background: '#FF6B00', 
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Guardar
          </button>
        </div>
      </Stack>
    </form>
  );
}; 