'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  Switch,
  FormControlLabel,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Stack,
} from '@mui/material';
import { Burger, BURGER_IMAGES } from '@/features/database/types/burger';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface BurgerFormProps {
  open: boolean;
  burger?: Burger | null;
  onClose: () => void;
  onSubmit: (burgerData: Omit<Burger, '_id'>) => Promise<void>;
}

export const BurgerForm: React.FC<BurgerFormProps> = ({
  open,
  burger,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string>(BURGER_IMAGES.CLASSIC);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (burger) {
      setName(burger.name);
      setDescription(burger.description);
      setPrice(burger.price);
      setCategory(burger.category);
      // Check if image is a custom URL or from BURGER_IMAGES
      const isCustomImage = !Object.values(BURGER_IMAGES).includes(burger.image as any);
      if (isCustomImage) {
        setImage('custom');
        setCustomImageUrl(burger.image);
      } else {
        setImage(burger.image);
        setCustomImageUrl('');
      }
      setIsAvailable(burger.isAvailable);
      setIngredients(burger.ingredients || []);
    } else {
      // Reset form for new burger
      setName('');
      setDescription('');
      setPrice(0);
      setCategory('');
      setImage(BURGER_IMAGES.CLASSIC);
      setCustomImageUrl('');
      setIsAvailable(true);
      setIngredients([]);
    }
    setNewIngredient('');
  }, [burger, open]);

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredient));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalImage = image === 'custom' ? customImageUrl : image;
      await onSubmit({
        name,
        description,
        price,
        category,
        image: finalImage as typeof BURGER_IMAGES[keyof typeof BURGER_IMAGES],
        isAvailable,
        ingredients,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {burger ? 'Editar Hamburguesa' : 'Nueva Hamburguesa'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={3}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Precio"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ flex: 1 }}
              />

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Categoría"
                  required
                >
                  <MenuItem value="classic">Clásica</MenuItem>
                  <MenuItem value="cheese">Con Queso</MenuItem>
                  <MenuItem value="bacon">Con Tocino</MenuItem>
                  <MenuItem value="specialty">Especialidad</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Imagen</InputLabel>
              <Select
                value={image}
                onChange={(e) => setImage(e.target.value)}
                label="Imagen"
                required
              >
                {Object.entries(BURGER_IMAGES).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key.replace('_', ' ')}
                  </MenuItem>
                ))}
                <MenuItem value="custom">URL Personalizada</MenuItem>
              </Select>
            </FormControl>

            {image === 'custom' && (
              <TextField
                label="URL de Imagen"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                required
                fullWidth
                placeholder="/media/burgers/custom-burger.jpg"
              />
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ingredientes
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {ingredients.map((ingredient) => (
                  <Chip
                    key={ingredient}
                    label={ingredient}
                    onDelete={() => handleRemoveIngredient(ingredient)}
                    deleteIcon={<DeleteIcon />}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Agregar ingrediente"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <IconButton
                  onClick={handleAddIngredient}
                  color="primary"
                  disabled={!newIngredient.trim()}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
              }
              label="Disponible"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : burger ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

