'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { getAdminByIdAction, AdminDetail } from '@/features/admins/actions/getAdminById.action';
import { updateAdminAction, UpdateAdminInput } from '@/features/admins/actions/updateAdmin.action';
import { resetPasswordAction } from '@/features/admins/actions/resetPassword.action';
import { AdminDetailView } from '@/features/admins/components/AdminDetailView.component';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import { logError } from '@/features/menu/utils/logError.util';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admins/styles/AdminDetailContainer.module.css';

const EMPTY_ADMIN_DETAIL: AdminDetail = {
  _id: EMPTY_STRING,
  email: EMPTY_STRING,
  isEnabled: true,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

export default function AdminDetailContainer() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const adminId = typeof params.id === 'string' ? params.id : EMPTY_STRING;
  
  const [admin, setAdmin] = useState<AdminDetail>(EMPTY_ADMIN_DETAIL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);

  const fetchAdminData = useCallback(async () => {
    if (!adminId || adminId === EMPTY_STRING) {
      setError(t('invalidAdminId'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(EMPTY_STRING);
      
      const response = await getAdminByIdAction(adminId);
      if (response.success && response.data) {
        setAdmin(response.data);
      } else {
        setError(response.error || t('errorLoadingAdmin'));
      }
    } catch (err) {
      const errorMessage = t('errorLoadingAdmin');
      logError(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [adminId, t]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleBack = useCallback(() => {
    router.push('/admin/admins');
  }, [router]);

  const handleAdminUpdate = useCallback(async (updates: UpdateAdminInput): Promise<string> => {
    if (!adminId || adminId === EMPTY_STRING) {
      return t('invalidAdminId');
    }

    try {
      const response = await updateAdminAction(adminId, updates);
      if (response.success) {
        await fetchAdminData();
        return EMPTY_STRING;
      } else {
        return response.error || t('errorUpdatingAdmin');
      }
    } catch (err) {
      logError('Error updating admin', err);
      return t('errorUpdatingAdmin');
    }
  }, [adminId, fetchAdminData, t]);

  const handleResetPassword = useCallback(async (newPassword: string): Promise<string> => {
    if (!adminId || adminId === EMPTY_STRING) {
      return t('invalidAdminId');
    }

    try {
      const response = await resetPasswordAction(adminId, { newPassword });
      if (response.success) {
        return EMPTY_STRING;
      } else {
        return response.error || t('errorResettingPassword');
      }
    } catch (err) {
      logError('Error resetting password', err);
      return t('errorResettingPassword');
    }
  }, [adminId, t]);

  if (loading) {
    return (
      <SafeArea className={styles.container} sides="all">
        <LoadingState title={t('loadingAdmin')} />
      </SafeArea>
    );
  }

  const hasValidAdmin = admin && admin._id !== EMPTY_STRING;
  if (error !== EMPTY_STRING || !hasValidAdmin) {
    return (
      <SafeArea className={styles.container} sides="all">
        <ErrorState error={error || t('adminNotFound')} onRetry={fetchAdminData} />
      </SafeArea>
    );
  }

  return (
    <SafeArea className={styles.container} sides="all">
      <AdminDetailView
        admin={admin}
        onBack={handleBack}
        onAdminUpdate={handleAdminUpdate}
        onResetPassword={handleResetPassword}
      />
    </SafeArea>
  );
}

