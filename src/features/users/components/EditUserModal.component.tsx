'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/features/users/styles/EditUserModal.module.css';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';
import { PhoneNumberInput } from '@/features/shared/components/PhoneNumberInput.component';
import { UserWithStats } from '@/features/users/actions/getUserById.action';
import { getEtiquetasAction } from '@/features/etiquetas/actions/getEtiquetas.action';
import { Etiqueta } from '@/features/database/types/etiqueta.type';

interface EditUserModalProps {
  user: UserWithStats;
  onClose: () => void;
  onUpdate: (updates: {
    phoneNumber?: string;
    name?: string;
    birthdate?: Date;
    gender?: string;
    notes?: string;
    tags?: string[];
  }) => Promise<string>;
}

const PHONE_NUMBER_LENGTH = 11;
const PHONE_NUMBER_PREFIX = '04';
const GENDER_OPTIONS: PillSelectOption[] = [
  { id: 'masculino', value: 'Masculino', label: 'Masculino' },
  { id: 'femenino', value: 'Femenino', label: 'Femenino' },
];

export function EditUserModal({ user, onClose, onUpdate }: EditUserModalProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber || EMPTY_STRING);
  const [name, setName] = useState<string>(user.name || EMPTY_STRING);
  const [birthdate, setBirthdate] = useState<Date | undefined>(user.birthdate);
  const [gender, setGender] = useState<string>(user.gender || EMPTY_STRING);
  const [notes, setNotes] = useState<string>(user.notes || EMPTY_STRING);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [systemManagedTags, setSystemManagedTags] = useState<string[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [etiquetasOptions, setEtiquetasOptions] = useState<PillSelectOption[]>([]);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [loading, setLoading] = useState(false);
  const [etiquetasLoading, setEtiquetasLoading] = useState(true);
  const phoneInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEtiquetas = async () => {
      try {
        setEtiquetasLoading(true);
        const response = await getEtiquetasAction();
        if (response.success && response.data) {
          const allEtiquetas = response.data;
          const systemManaged = allEtiquetas
            .filter(etiqueta => etiqueta.isSystemManaged)
            .map(etiqueta => etiqueta.name);
          setSystemManagedTags(systemManaged);

          const userTags = user.tags || [];
          const userSystemTags = userTags.filter(tag => systemManaged.includes(tag));
          const userNonSystemTags = userTags.filter(tag => !systemManaged.includes(tag));

          const enabledNonSystemEtiquetas = allEtiquetas.filter(
            etiqueta => etiqueta.isEnabled && !etiqueta.isSystemManaged
          );
          setEtiquetas(enabledNonSystemEtiquetas);
          const options: PillSelectOption[] = enabledNonSystemEtiquetas.map(etiqueta => ({
            id: etiqueta._id?.toString() || etiqueta.id,
            value: etiqueta.name,
            label: etiqueta.name,
          }));
          setEtiquetasOptions(options);
          setSelectedTags(userNonSystemTags);
        }
      } catch (err) {
        console.error('Error fetching etiquetas:', err);
      } finally {
        setEtiquetasLoading(false);
      }
    };

    fetchEtiquetas();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneInputRef.current) {
        const firstInput = phoneInputRef.current.querySelector('input:not([disabled])') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    setError(EMPTY_STRING);
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setBirthdate(date);
        setError(EMPTY_STRING);
      }
    } else {
      setBirthdate(undefined);
      setError(EMPTY_STRING);
    }
  };

  const isValidPhoneNumber = phoneNumber.length === PHONE_NUMBER_LENGTH && phoneNumber.startsWith(PHONE_NUMBER_PREFIX);
  const canSubmit = isValidPhoneNumber && !loading && !etiquetasLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(EMPTY_STRING);

    if (!isValidPhoneNumber) {
      setError('El número de teléfono debe tener 11 dígitos y comenzar con 04');
      return;
    }

    setLoading(true);
    const userBirthdate = user.birthdate instanceof Date ? user.birthdate : undefined;
    const birthdateChanged = birthdate !== userBirthdate && (
      !birthdate || !userBirthdate || birthdate.getTime() !== userBirthdate.getTime()
    );

    const userTags = user.tags || [];
    const finalTags = [...systemManagedTags, ...selectedTags];
    const tagsChanged = JSON.stringify(finalTags.sort()) !== JSON.stringify(userTags.sort());

    const updates = {
      phoneNumber: phoneNumber !== user.phoneNumber ? phoneNumber : undefined,
      name: name.trim() !== (user.name || EMPTY_STRING) ? name.trim() : undefined,
      birthdate: birthdateChanged ? birthdate : undefined,
      gender: gender !== (user.gender || EMPTY_STRING) ? gender : undefined,
      notes: notes.trim() !== (user.notes || EMPTY_STRING) ? notes.trim() : undefined,
      tags: tagsChanged ? finalTags : undefined,
    };

    const hasChanges = Object.values(updates).some(value => value !== undefined);
    if (!hasChanges) {
      setError('No hay cambios para guardar');
      setLoading(false);
      return;
    }

    const errorMessage = await onUpdate(updates);
    setLoading(false);

    if (errorMessage !== EMPTY_STRING) {
      setError(errorMessage);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Editar Usuario</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar" disabled={loading}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>

        <form className={styles.modalContent} onSubmit={handleSubmit}>
          {error !== EMPTY_STRING && (
            <div className={styles.errorAlert}>
              <span className={`material-symbols-outlined ${styles.errorIcon}`}>error</span>
              <span className={styles.errorText}>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="phoneNumber">
              Número de Teléfono *
            </label>
            <div ref={phoneInputRef}>
              <PhoneNumberInput
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo del cliente"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="birthdate">
              Fecha de Nacimiento
            </label>
            <input
              id="birthdate"
              type="date"
              className={styles.input}
              value={birthdate ? birthdate.toISOString().split('T')[0] : EMPTY_STRING}
              onChange={handleBirthdateChange}
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="gender">
              Género
            </label>
            <div className={styles.pillSelectWrapper}>
              <PillSelect
                options={GENDER_OPTIONS}
                selectedValues={gender !== EMPTY_STRING ? [gender] : []}
                onSelectionChange={(values) => {
                  setGender(values.length > 0 ? values[0] : EMPTY_STRING);
                  setError(EMPTY_STRING);
                }}
                multiple={false}
                searchable={false}
                placeholder="Seleccione un género"
                className={styles.pillSelect}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="notes">
              Notas
            </label>
            <textarea
              id="notes"
              className={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales sobre el cliente"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="etiquetas">
              Etiquetas
            </label>
            {etiquetasLoading ? (
              <div className={styles.loadingState}>
                <span className={`material-symbols-outlined ${styles.loadingIcon}`}>hourglass_empty</span>
                <span className={styles.loadingText}>Cargando etiquetas...</span>
              </div>
            ) : (
              <div className={styles.pillSelectWrapper}>
                <PillSelect
                  options={etiquetasOptions}
                  selectedValues={selectedTags}
                  onSelectionChange={(values) => {
                    setSelectedTags(values);
                    setError(EMPTY_STRING);
                  }}
                  multiple={true}
                  searchable={true}
                  placeholder="Seleccione etiquetas"
                  className={styles.pillSelect}
                  maxVisible={10}
                />
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

