'use client';

import { useState, useMemo } from 'react';
import { updateOrderPayment } from '@/features/orders/actions/updateOrderPayment.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';
import { VENEZUELAN_BANKS } from '@/features/admin/constants/banks.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/Modal.module.css';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export default function PaymentModal({
  open,
  onClose,
  orderId,
  onSuccess,
}: PaymentModalProps) {
  const { t } = useLanguage();
  const [bankAccount, setBankAccount] = useState(EMPTY_STRING);
  const [transferReference, setTransferReference] = useState(EMPTY_STRING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(EMPTY_STRING);

  const bankOptions: PillSelectOption[] = useMemo(() => {
    return VENEZUELAN_BANKS.map(bank => ({
      id: bank.id,
      label: bank.name,
      value: bank.id,
    }));
  }, []);

  const handleBankSearch = (query: string): PillSelectOption[] => {
    const lowerQuery = query.toLowerCase();
    return VENEZUELAN_BANKS
      .filter(bank =>
        bank.name.toLowerCase().includes(lowerQuery) ||
        bank.id.includes(query)
      )
      .map(bank => ({
        id: bank.id,
        label: bank.name,
        value: bank.id,
      }));
  };

  const handleBankSelectionChange = (selectedValues: string[]) => {
    if (selectedValues.length > 0) {
      setBankAccount(selectedValues[0]);
    } else {
      setBankAccount(EMPTY_STRING);
    }
  };

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(EMPTY_STRING);
      await updateOrderPayment(orderId, bankAccount, transferReference);
      onSuccess();
      onClose();
      setBankAccount(EMPTY_STRING);
      setTransferReference(EMPTY_STRING);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('updatePaymentError'));
    } finally {
      setLoading(false);
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
          <h2 className={styles.modalTitle}>{t('registerPayment')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('transferReference')}
            </label>
            <input
              type="text"
              className={styles.input}
              value={transferReference}
              onChange={(e) => setTransferReference(e.target.value)}
              placeholder={t('transferReferencePlaceholder')}
              required
            />
            <label className={styles.label}>
              {t('bank')}
            </label>
            <PillSelect
              options={bankOptions}
              selectedValues={bankAccount ? [bankAccount] : []}
              onSelectionChange={handleBankSelectionChange}
              multiple={false}
              searchable={true}
              maxVisible={5}
              onSearch={handleBankSearch}
              placeholder={t('selectBankPlaceholder')}
              searchPlaceholder={t('searchBankPlaceholder')}
            />
            {error && (
              <p className={styles.errorText}>{error}</p>
            )}
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onClose}
            disabled={loading}
          >
            {t('cancel')}
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? t('saving') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
