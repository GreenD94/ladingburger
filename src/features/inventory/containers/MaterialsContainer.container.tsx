'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Material } from '../types/material.type';
import { MaterialRow } from '../components/materials/MaterialRow.component';
import { MaterialForm } from '../components/materials/MaterialForm.component';
import { getMaterials } from '../actions/materials/getMaterials.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import styles from '../styles/MaterialsContainer.module.css';

export function MaterialsContainer() {
  const { t } = useLanguage();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(EMPTY_STRING);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: EMPTY_STRING,
    severity: 'success' as 'success' | 'error',
  });
  const hasInitialized = useRef(false);

  const fetchMaterials = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setLoading(true);
    setError(EMPTY_STRING);

    try {
      const response = await getMaterials();
      if (response.success && response.data) {
        setMaterials(response.data);
      } else {
        setError(response.error || t('error'));
      }
    } catch (err) {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleCreate = () => {
    setEditingMaterial(undefined);
    setFormOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingMaterial(undefined);
  };

  const handleFormSuccess = () => {
    hasInitialized.current = false;
    fetchMaterials();
    setSnackbar({
      open: true,
      message: editingMaterial ? t('materialUpdatedSuccess') : t('materialCreatedSuccess'),
      severity: 'success',
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isLoading = loading;
  const hasError = error !== EMPTY_STRING;
  const hasMaterials = materials.length > 0;
  const shouldShowContent = !isLoading && !hasError;

  return (
    <SafeArea sides="all">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('materials')}</h1>
          <button
            className={styles.addButton}
            onClick={handleCreate}
            type="button"
          >
            <span className="material-symbols-outlined">add</span>
            {t('addMaterial')}
          </button>
        </div>

        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>{t('loading')}</p>
          </div>
        )}

        {hasError && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {shouldShowContent && (
          <div className={styles.materialsList}>
            {hasMaterials ? (
              materials.map((material) => (
                <MaterialRow
                  key={typeof material._id === 'string' ? material._id : material._id?.toString() || ''}
                  material={material}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <p className={styles.emptyState}>{t('noMaterialsFound')}</p>
            )}
          </div>
        )}

        <MaterialForm
          open={formOpen}
          material={editingMaterial}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />

        {snackbar.open && (
          <div className={`${styles.snackbar} ${styles[snackbar.severity]}`}>
            <p className={styles.snackbarMessage}>{snackbar.message}</p>
            <button
              className={styles.snackbarClose}
              onClick={handleSnackbarClose}
              type="button"
              aria-label={t('close')}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
      </div>
    </SafeArea>
  );
}
