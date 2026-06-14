'use client';

import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Material } from '../../types/material.type';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { MATERIAL_CATEGORY_LABELS } from '../../constants/materialCategories.constants';
import styles from '../../styles/MaterialRow.module.css';

interface MaterialRowProps {
  material: Material;
  onEdit: (material: Material) => void;
}

export function MaterialRow({ material, onEdit }: MaterialRowProps) {
  const { t } = useLanguage();
  
  const materialId = typeof material._id === 'string' ? material._id : material._id?.toString() || '';
  const isLowStock = material.currentStock <= material.minStockLevel;
  const stockStatus = isLowStock ? 'low' : 'normal';

  return (
    <Paper className={styles.materialCard} elevation={1}>
      <Box className={styles.materialHeader}>
        <Box className={styles.materialInfo}>
          <Typography variant="h6" className={styles.materialName}>
            {material.name}
          </Typography>
          <Chip
            label={MATERIAL_CATEGORY_LABELS[material.category] || material.category}
            size="small"
            className={styles.categoryChip}
          />
        </Box>
        <IconButton
          onClick={() => onEdit(material)}
          size="small"
          className={styles.editButton}
          aria-label={t('updateMaterial')}
        >
          <EditIcon />
        </IconButton>
      </Box>

      <Box className={styles.materialDetails}>
        <Box className={styles.detailRow}>
          <Typography variant="body2" className={styles.detailLabel}>
            {t('currentStock')}:
          </Typography>
          <Typography
            variant="body2"
            className={`${styles.detailValue} ${styles[stockStatus]}`}
          >
            {material.currentStock} {material.unit}
          </Typography>
        </Box>

        <Box className={styles.detailRow}>
          <Typography variant="body2" className={styles.detailLabel}>
            {t('averageCost')}:
          </Typography>
          <Typography variant="body2" className={styles.detailValue}>
            ${material.averageCost.toFixed(2)} / {material.unit}
          </Typography>
        </Box>

        <Box className={styles.detailRow}>
          <Typography variant="body2" className={styles.detailLabel}>
            {t('minStockLevel')}:
          </Typography>
          <Typography variant="body2" className={styles.detailValue}>
            {material.minStockLevel} {material.unit}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

