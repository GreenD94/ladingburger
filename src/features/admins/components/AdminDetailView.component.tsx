'use client';

import React, { useState } from 'react';
import { AdminDetail } from '@/features/admins/actions/getAdminById.action';
import { UpdateAdminInput } from '@/features/admins/actions/updateAdmin.action';
import { AdminDetailHeader } from '@/features/admins/components/AdminDetailHeader.component';
import { AdminGeneralTab } from '@/features/admins/components/AdminGeneralTab.component';
import { EditAdminModal } from '@/features/admins/components/EditAdminModal.component';
import { ResetPasswordModal } from '@/features/admins/components/ResetPasswordModal.component';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admins/styles/AdminDetailView.module.css';

interface AdminDetailViewProps {
  admin: AdminDetail;
  onBack: () => void;
  onAdminUpdate: (updates: UpdateAdminInput) => Promise<string>;
  onResetPassword: (newPassword: string) => Promise<string>;
}

export function AdminDetailView({ admin, onBack, onAdminUpdate, onResetPassword }: AdminDetailViewProps) {
  const { t } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <AdminDetailHeader admin={admin} onBack={onBack} />

      <main className={styles.content}>
        <AdminGeneralTab admin={admin} />
      </main>

      <footer className={styles.footer}>
        <button
          className={styles.resetPasswordButton}
          onClick={() => setIsResetPasswordModalOpen(true)}
          aria-label={t('resetPassword')}
        >
          <span className={`material-symbols-outlined ${styles.resetPasswordIcon}`}>lock_reset</span>
          <span className={styles.resetPasswordText}>{t('resetPassword')}</span>
        </button>
        <button
          className={styles.editButton}
          onClick={() => setIsEditModalOpen(true)}
          aria-label={t('edit')}
        >
          <span className={`material-symbols-outlined ${styles.editIcon}`}>edit</span>
          <span className={styles.editText}>{t('edit')}</span>
        </button>
      </footer>

      {isEditModalOpen && (
        <EditAdminModal
          admin={admin}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={onAdminUpdate}
        />
      )}

      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          admin={admin}
          onClose={() => setIsResetPasswordModalOpen(false)}
          onReset={onResetPassword}
        />
      )}
    </div>
  );
}

