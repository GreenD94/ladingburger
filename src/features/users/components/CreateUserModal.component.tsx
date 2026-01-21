'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/features/users/styles/CreateUserModal.module.css';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';
import { PhoneNumberInput } from '@/features/shared/components/PhoneNumberInput.component';

interface CreateUserModalProps {
  onClose: () => void;
  onCreate: (phoneNumber: string, name: string, birthdate: Date, gender: string, notes: string) => Promise<string>;
}

const PHONE_NUMBER_LENGTH = 11;
const PHONE_NUMBER_PREFIX = '04';
const GENDER_OPTIONS: PillSelectOption[] = [
  { id: 'masculino', value: 'Masculino', label: 'Masculino' },
  { id: 'femenino', value: 'Femenino', label: 'Femenino' },
];

export function CreateUserModal({ onClose, onCreate }: CreateUserModalProps) {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState<string>(EMPTY_STRING);
  const [name, setName] = useState<string>(EMPTY_STRING);
  const [birthdate, setBirthdate] = useState<Date>(EMPTY_DATE);
  const [gender, setGender] = useState<string>(EMPTY_STRING);
  const [notes, setNotes] = useState<string>(EMPTY_STRING);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [loading, setLoading] = useState(false);
  const phoneInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPhoneNumber(EMPTY_STRING);
    setName(EMPTY_STRING);
    setBirthdate(EMPTY_DATE);
    setGender(EMPTY_STRING);
    setNotes(EMPTY_STRING);
    setError(EMPTY_STRING);

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
      setBirthdate(EMPTY_DATE);
      setError(EMPTY_STRING);
    }
  };

  const isValidPhoneNumber = phoneNumber.length === PHONE_NUMBER_LENGTH && phoneNumber.startsWith(PHONE_NUMBER_PREFIX);
  const isValidName = name.trim() !== EMPTY_STRING;
  const isValidBirthdate = birthdate.getTime() !== EMPTY_DATE.getTime() && !isNaN(birthdate.getTime());
  const isValidGender = gender !== EMPTY_STRING;
  const isValidNotes = notes.trim() !== EMPTY_STRING;
  const canSubmit = isValidPhoneNumber && isValidName && isValidBirthdate && isValidGender && isValidNotes && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(EMPTY_STRING);

    if (!isValidPhoneNumber) {
      setError(t('phoneRequired'));
      return;
    }

    if (!isValidName) {
      setError(t('nameRequired'));
      return;
    }

    if (!isValidBirthdate) {
      setError(t('birthdateRequired'));
      return;
    }

    if (!isValidGender) {
      setError(t('genderRequired'));
      return;
    }

    if (!isValidNotes) {
      setError(t('notesRequired'));
      return;
    }

    setLoading(true);
    const errorMessage = await onCreate(phoneNumber, name.trim(), birthdate, gender, notes.trim());
    setLoading(false);

    if (errorMessage !== EMPTY_STRING) {
      setError(errorMessage);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setPhoneNumber(EMPTY_STRING);
    setName(EMPTY_STRING);
    setBirthdate(EMPTY_DATE);
    setGender(EMPTY_STRING);
    setNotes(EMPTY_STRING);
    setError(EMPTY_STRING);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t('createUser')}</h2>
          <button className={styles.closeButton} onClick={handleClose} aria-label={t('close')} disabled={loading}>
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
              {t('phoneNumber')} *
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
              {t('name')} *
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('fullNamePlaceholder')}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="birthdate">
              {t('birthdate')} *
            </label>
            <input
              id="birthdate"
              type="date"
              className={styles.input}
              value={birthdate.getTime() !== EMPTY_DATE.getTime() ? birthdate.toISOString().split('T')[0] : EMPTY_STRING}
              onChange={handleBirthdateChange}
              required
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="gender">
              {t('gender')} *
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
                placeholder={t('selectGenderPlaceholder')}
                className={styles.pillSelect}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="notes">
              {t('notes')} *
            </label>
            <textarea
              id="notes"
              className={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notesPlaceholder')}
              required
              disabled={loading}
              rows={3}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={loading}
            >
              {t('cancel')}
            </button>
            <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
              {loading ? t('creating') : t('createUser')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

