'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { getUserByIdAction, UserWithStats } from '@/features/users/actions/getUserById.action';
import { updateUser, UpdateUserInput } from '@/features/database/actions/users/updateUser.action';
import { UserDetailView } from '@/features/users/components/UserDetailView.component';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { EMPTY_USER } from '@/features/database/constants/emptyObjects.constants';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import { logError } from '@/features/menu/utils/logError.util';
import styles from '@/features/users/styles/UserDetailContainer.module.css';

export default function UserDetailContainer() {
  const router = useRouter();
  const params = useParams();
  const userId = typeof params.id === 'string' ? params.id : EMPTY_STRING;
  
  const [user, setUser] = useState<UserWithStats | typeof EMPTY_USER>(EMPTY_USER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);

  const fetchUserData = useCallback(async () => {
    if (!userId || userId === EMPTY_STRING) {
      setError('ID de usuario no válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(EMPTY_STRING);
      
      const response = await getUserByIdAction(userId);
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.error || 'Error al cargar el usuario');
      }
    } catch (err) {
      const errorMessage = 'Ocurrió un error al cargar el usuario';
      logError(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleBack = useCallback(() => {
    router.push('/admin/users');
  }, [router]);

  const handleUserUpdate = useCallback(async (updates: UpdateUserInput): Promise<string> => {
    if (!userId || userId === EMPTY_STRING) {
      return 'ID de usuario no válido';
    }

    try {
      const response = await updateUser(userId, updates);
      if (response.success) {
        await fetchUserData();
        return EMPTY_STRING;
      } else {
        return response.error || 'Error al actualizar el usuario';
      }
    } catch (err) {
      logError('Error updating user', err);
      return 'Ocurrió un error al actualizar el usuario';
    }
  }, [userId, fetchUserData]);

  if (loading) {
    return (
      <SafeArea className={styles.container} sides="all">
        <LoadingState title="Cargando usuario..." />
      </SafeArea>
    );
  }

  const hasValidUser = user && user._id !== EMPTY_STRING;
  if (error !== EMPTY_STRING || !hasValidUser) {
    return (
      <SafeArea className={styles.container} sides="all">
        <ErrorState error={error || 'Usuario no encontrado'} onRetry={fetchUserData} />
      </SafeArea>
    );
  }

  return (
    <SafeArea className={styles.container} sides="all">
      <UserDetailView user={user} onBack={handleBack} onUserUpdate={handleUserUpdate} />
    </SafeArea>
  );
}

