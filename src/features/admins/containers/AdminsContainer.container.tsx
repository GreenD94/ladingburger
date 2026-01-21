'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { getAdminsAction, AdminListItem } from '@/features/admins/actions/getAdmins.action';
import { AdminCard } from '@/features/admins/components/AdminCard.component';
import { AdminSearchBar } from '@/features/admins/components/AdminSearchBar.component';
import { CreateAdminModal } from '@/features/admins/components/CreateAdminModal.component';
import { createAdminAction } from '@/features/admins/actions/createAdmin.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import { logError } from '@/features/menu/utils/logError.util';
import styles from '@/features/admins/styles/AdminsContainer.module.css';

const ADMINS_PER_PAGE = 10;

export default function AdminsContainer() {
  const { t } = useLanguage();
  const [admins, setAdmins] = useState<AdminListItem[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<AdminListItem[]>([]);
  const [displayedAdmins, setDisplayedAdmins] = useState<AdminListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [searchQuery, setSearchQuery] = useState<string>(EMPTY_STRING);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const response = await getAdminsAction();
      if (response.success && response.data) {
        setAdmins(response.data);
        setFilteredAdmins(response.data);
        const initialAdmins = response.data.slice(0, ADMINS_PER_PAGE);
        setDisplayedAdmins(initialAdmins);
        setCurrentPage(1);
      } else {
        setError(response.error || t('errorLoadingAdmins'));
      }
    } catch (err) {
      const errorMessage = t('errorLoadingAdmins');
      logError(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    let filtered = [...admins];

    if (searchQuery !== EMPTY_STRING) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((admin) =>
        admin.email.toLowerCase().includes(query)
      );
    }

    setFilteredAdmins(filtered);
    setCurrentPage(1);
    const initialAdmins = filtered.slice(0, ADMINS_PER_PAGE);
    setDisplayedAdmins(initialAdmins);
  }, [admins, searchQuery]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredAdmins.length / ADMINS_PER_PAGE);
    const hasMore = currentPage < totalPages;
    const shouldLoadMore = currentPage > 1 && hasMore;

    if (shouldLoadMore) {
      const startIndex = (currentPage - 1) * ADMINS_PER_PAGE;
      const endIndex = startIndex + ADMINS_PER_PAGE;
      const nextAdmins = filteredAdmins.slice(startIndex, endIndex);
      setDisplayedAdmins((prev) => [...prev, ...nextAdmins]);
      setLoadingMore(false);
    }
  }, [currentPage, filteredAdmins]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          const totalPages = Math.ceil(filteredAdmins.length / ADMINS_PER_PAGE);
          const hasMore = currentPage < totalPages;
          if (hasMore) {
            setLoadingMore(true);
            setCurrentPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [filteredAdmins.length, currentPage, loadingMore]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCreateAdmin = useCallback(async (
    email: string,
    password: string
  ): Promise<string> => {
    try {
      const response = await createAdminAction({ email, password });
      if (response.success) {
        setIsCreateModalOpen(false);
        await fetchAdmins();
        return EMPTY_STRING;
      } else {
        return response.error || t('errorCreatingAdmin');
      }
    } catch (err) {
      logError('Error creating admin', err);
      return t('errorCreatingAdmin');
    }
  }, [fetchAdmins, t]);

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  if (loading) {
    return (
      <SafeArea className={styles.container} sides="all">
        <LoadingState title={t('loadingAdmins')} />
      </SafeArea>
    );
  }

  if (error !== EMPTY_STRING) {
    return (
      <SafeArea className={styles.container} sides="all">
        <ErrorState error={error} onRetry={fetchAdmins} />
      </SafeArea>
    );
  }

  return (
    <SafeArea className={styles.container} sides="all">
      <header className={styles.header}>
        <h1 className={styles.title}>{t('adminManagement')}</h1>

        <AdminSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <button
          className={styles.createButton}
          onClick={handleOpenCreateModal}
          aria-label={t('createAdmin')}
        >
          <span className={`material-symbols-outlined ${styles.createIcon}`}>person_add</span>
          <span className={styles.createText}>{t('createAdmin')}</span>
        </button>
      </header>

      <main className={styles.main}>
        {filteredAdmins.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {searchQuery !== EMPTY_STRING
                ? t('noAdminsFound')
                : t('noAdminsRegistered')}
            </p>
          </div>
        ) : (
          <div className={styles.adminsList}>
            {displayedAdmins.map((admin) => (
              <AdminCard key={admin._id} admin={admin} />
            ))}
            {loadingMore && (
              <div className={styles.loadingMore}>
                <span className={`material-symbols-outlined ${styles.loadingIcon}`}>hourglass_empty</span>
                <p className={styles.loadingText}>{t('loading')}...</p>
              </div>
            )}
            <div ref={observerTarget} className={styles.observerTarget} />
          </div>
        )}
        <div className={styles.spacer}></div>
      </main>

      {isCreateModalOpen && (
        <CreateAdminModal
          onClose={handleCloseCreateModal}
          onCreate={handleCreateAdmin}
        />
      )}
    </SafeArea>
  );
}

