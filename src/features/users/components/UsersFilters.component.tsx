'use client';

import React, { useState, useEffect } from 'react';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';
import { MOBILE_BREAKPOINT } from '@/features/admin/constants/responsive.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';
import { getEtiquetasAction } from '@/features/etiquetas/actions/getEtiquetas.action';
import styles from '@/features/admin/styles/Modal.module.css';

export interface UsersFiltersState {
  tags: string[];
  gender: string;
  registrationDateRange: {
    start: Date;
    end: Date;
  };
  lastOrderDateRange: {
    start: Date;
    end: Date;
  };
  ltvRange: {
    min: number;
    max: number;
  };
  totalOrdersRange: {
    min: number;
    max: number;
  };
}

export const EMPTY_USERS_FILTERS_STATE: UsersFiltersState = {
  tags: [],
  gender: EMPTY_STRING,
  registrationDateRange: {
    start: EMPTY_DATE,
    end: EMPTY_DATE,
  },
  lastOrderDateRange: {
    start: EMPTY_DATE,
    end: EMPTY_DATE,
  },
  ltvRange: {
    min: 0,
    max: 0,
  },
  totalOrdersRange: {
    min: 0,
    max: 0,
  },
};

interface UsersFiltersProps {
  filters: UsersFiltersState;
  onFiltersChange: (filters: UsersFiltersState) => void;
  onClear: () => void;
  open?: boolean;
  onClose?: () => void;
}

const GENDER_OPTIONS: PillSelectOption[] = [
  { id: 'masculino', value: 'Masculino', label: 'Masculino' },
  { id: 'femenino', value: 'Femenino', label: 'Femenino' },
];

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,
  open,
  onClose,
}) => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [etiquetasOptions, setEtiquetasOptions] = useState<PillSelectOption[]>([]);
  const [etiquetasLoading, setEtiquetasLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchEtiquetas = async () => {
      try {
        setEtiquetasLoading(true);
        const response = await getEtiquetasAction();
        if (response.success && response.data) {
          const enabledEtiquetas = response.data.filter(etiqueta => etiqueta.isEnabled);
          const options: PillSelectOption[] = enabledEtiquetas.map(etiqueta => ({
            id: etiqueta._id?.toString() || etiqueta.id,
            value: etiqueta.name,
            label: etiqueta.name,
          }));
          setEtiquetasOptions(options);
        }
      } catch (err) {
        console.error('Error fetching etiquetas:', err);
      } finally {
        setEtiquetasLoading(false);
      }
    };

    if (open) {
      fetchEtiquetas();
    }
  }, [open]);

  const hasRegistrationStartDate = filters.registrationDateRange.start.getTime() !== EMPTY_DATE.getTime();
  const hasRegistrationEndDate = filters.registrationDateRange.end.getTime() !== EMPTY_DATE.getTime();
  const hasLastOrderStartDate = filters.lastOrderDateRange.start.getTime() !== EMPTY_DATE.getTime();
  const hasLastOrderEndDate = filters.lastOrderDateRange.end.getTime() !== EMPTY_DATE.getTime();
  const hasMinLTV = filters.ltvRange.min !== 0;
  const hasMaxLTV = filters.ltvRange.max !== 0;
  const hasMinOrders = filters.totalOrdersRange.min !== 0;
  const hasMaxOrders = filters.totalOrdersRange.max !== 0;

  const handleTagSelectionChange = (selectedValues: string[]) => {
    onFiltersChange({ ...filters, tags: selectedValues });
  };

  const handleGenderSelectionChange = (selectedValues: string[]) => {
    onFiltersChange({ ...filters, gender: selectedValues.length > 0 ? selectedValues[0] : EMPTY_STRING });
  };

  const handleClear = () => {
    onClear();
    handleClose();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className={isMobile ? styles.overlayFullScreen : styles.overlay} onClick={handleOverlayClick}>
      <div className={isMobile ? styles.modalFullScreen : styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t('advancedFilters')}</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <div>
              <label className={styles.label}>{t('tags')}</label>
              {etiquetasLoading ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                  {t('loading')}...
                </div>
              ) : (
                <div style={{ marginTop: '8px' }}>
                  <PillSelect
                    options={etiquetasOptions}
                    selectedValues={filters.tags}
                    onSelectionChange={handleTagSelectionChange}
                    multiple={true}
                    searchable={true}
                    placeholder={t('selectTagsPlaceholder')}
                    maxVisible={5}
                  />
                </div>
              )}
            </div>

            <div>
              <label className={styles.label}>{t('gender')}</label>
              <div style={{ marginTop: '8px' }}>
                <PillSelect
                  options={GENDER_OPTIONS}
                  selectedValues={filters.gender !== EMPTY_STRING ? [filters.gender] : []}
                  onSelectionChange={handleGenderSelectionChange}
                  multiple={false}
                  searchable={false}
                  placeholder={t('selectGenderPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>{t('registrationDateRange')}</label>
              <div className={isMobile ? '' : styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('startDate')}</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={hasRegistrationStartDate ? filters.registrationDateRange.start.toISOString().split('T')[0] : EMPTY_STRING}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : EMPTY_DATE;
                      onFiltersChange({
                        ...filters,
                        registrationDateRange: { ...filters.registrationDateRange, start: date },
                      });
                    }}
                    style={{ minHeight: isMobile ? 56 : 40 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('endDate')}</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={hasRegistrationEndDate ? filters.registrationDateRange.end.toISOString().split('T')[0] : EMPTY_STRING}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : EMPTY_DATE;
                      onFiltersChange({
                        ...filters,
                        registrationDateRange: { ...filters.registrationDateRange, end: date },
                      });
                    }}
                    style={{ minHeight: isMobile ? 56 : 40 }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={styles.label}>{t('lastOrderDateRange')}</label>
              <div className={isMobile ? '' : styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('startDate')}</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={hasLastOrderStartDate ? filters.lastOrderDateRange.start.toISOString().split('T')[0] : EMPTY_STRING}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : EMPTY_DATE;
                      onFiltersChange({
                        ...filters,
                        lastOrderDateRange: { ...filters.lastOrderDateRange, start: date },
                      });
                    }}
                    style={{ minHeight: isMobile ? 56 : 40 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('endDate')}</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={hasLastOrderEndDate ? filters.lastOrderDateRange.end.toISOString().split('T')[0] : EMPTY_STRING}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : EMPTY_DATE;
                      onFiltersChange({
                        ...filters,
                        lastOrderDateRange: { ...filters.lastOrderDateRange, end: date },
                      });
                    }}
                    style={{ minHeight: isMobile ? 56 : 40 }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={styles.label}>{t('ltvRange')}</label>
              <div className={isMobile ? '' : styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('minAmount')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>$</span>
                    <input
                      type="number"
                      className={styles.input}
                      value={hasMinLTV ? filters.ltvRange.min : EMPTY_STRING}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                        onFiltersChange({
                          ...filters,
                          ltvRange: { ...filters.ltvRange, min: value },
                        });
                      }}
                      style={{ paddingLeft: '32px', minHeight: isMobile ? 56 : 40 }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('maxAmount')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>$</span>
                    <input
                      type="number"
                      className={styles.input}
                      value={hasMaxLTV ? filters.ltvRange.max : EMPTY_STRING}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                        onFiltersChange({
                          ...filters,
                          ltvRange: { ...filters.ltvRange, max: value },
                        });
                      }}
                      style={{ paddingLeft: '32px', minHeight: isMobile ? 56 : 40 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className={styles.label}>{t('totalOrdersRange')}</label>
              <div className={isMobile ? '' : styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('minOrders')}</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={hasMinOrders ? filters.totalOrdersRange.min : EMPTY_STRING}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value, 10) : 0;
                      onFiltersChange({
                        ...filters,
                        totalOrdersRange: { ...filters.totalOrdersRange, min: value },
                      });
                    }}
                    style={{ minHeight: isMobile ? 56 : 40 }}
                    min="0"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('maxOrders')}</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={hasMaxOrders ? filters.totalOrdersRange.max : EMPTY_STRING}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value, 10) : 0;
                      onFiltersChange({
                        ...filters,
                        totalOrdersRange: { ...filters.totalOrdersRange, max: value },
                      });
                    }}
                    style={{ minHeight: isMobile ? 56 : 40 }}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.modalActions} ${styles.modalActionsColumn}`}>
          <button
            className={`${styles.button} ${styles.buttonDanger} ${styles.buttonFullWidth}`}
            onClick={handleClear}
            style={{ minHeight: isMobile ? 44 : 36 }}
          >
            {t('clearAll')}
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFullWidth}`}
            onClick={handleClose}
            style={{ minHeight: isMobile ? 44 : 36 }}
          >
            {t('apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

