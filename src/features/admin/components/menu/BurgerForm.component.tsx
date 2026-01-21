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
import { Burger } from '@/features/database/types/index.type';
import { BURGER_IMAGES, BurgerImage } from '@/features/database/types/burger.type';
import { EMPTY_BURGER } from '@/features/database/constants/emptyObjects.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface BurgerFormProps {
  open: boolean;
  burger?: Burger;
  onClose: () => void;
  onSubmit: (burgerData: Omit<Burger, '_id'>) => Promise<void>;
}

export const BurgerForm: React.FC<BurgerFormProps> = ({
  open,
  burger,
  onClose,
  onSubmit,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [estimatedPrepTime, setEstimatedPrepTime] = useState(0);
  const [image, setImage] = useState<string>(BURGER_IMAGES.CLASSIC);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentBurger = burger || EMPTY_BURGER;
    setName(currentBurger.name);
    setDescription(currentBurger.description);
    setPrice(currentBurger.price);
    setEstimatedPrepTime(currentBurger.estimatedPrepTime || 0);
    const isCustomImage = !Object.values(BURGER_IMAGES).includes(currentBurger.image);
    if (isCustomImage) {
      setImage('custom');
      setCustomImageUrl(currentBurger.image);
    } else {
      setImage(currentBurger.image);
      setCustomImageUrl('');
    }
    setIsAvailable(currentBurger.isAvailable);
    setIngredients(currentBurger.ingredients || []);
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
      const finalImage: BurgerImage = image === 'custom' ? (customImageUrl as BurgerImage) : (image as BurgerImage);
      await onSubmit({
        name,
        description,
        price,
        image: finalImage,
        isAvailable,
        ingredients,
        estimatedPrepTime: estimatedPrepTime > 0 ? estimatedPrepTime : undefined,
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

  const isEditing = burger !== undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? t('editBurger') : t('newBurger')}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label={t('name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label={t('description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={3}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t('price')}
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ flex: 1 }}
              />

              <TextField
                label={t('estimatedPrepTime')}
                type="text"
                value={estimatedPrepTime || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numeric input
                  if (value === '' || /^\d+$/.test(value)) {
                    // Limit to 2 digits (0-99)
                    if (value === '' || (value.length <= 2 && parseInt(value, 10) <= 99)) {
                      setEstimatedPrepTime(value === '' ? 0 : parseInt(value, 10));
                    }
                  }
                }}
                required
                inputProps={{ 
                  maxLength: 2,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ flex: 1 }}
                helperText={t('estimatedPrepTimeHelper')}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>{t('image')}</InputLabel>
              <Select
                value={image}
                onChange={(e) => setImage(e.target.value)}
                label={t('image')}
                required
              >
                {Object.entries(BURGER_IMAGES).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key.replace('_', ' ')}
                  </MenuItem>
                ))}
                <MenuItem value="custom">{t('customImageUrl')}</MenuItem>
              </Select>
            </FormControl>

            {image === 'custom' && (
              <TextField
                label={t('imageUrl')}
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                required
                fullWidth
                placeholder="/media/burgers/custom-burger.jpg"
              />
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('ingredients')}
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
                  placeholder={t('addIngredient')}
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
              label={t('available')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? t('saving') : isEditing ? t('update') : t('create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

