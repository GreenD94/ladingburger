'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { getUsersWithStatsAction, UserWithStats } from '@/features/users/actions/getUsersWithStats.action';
import { UserCard } from '@/features/users/components/UserCard.component';
import { UserSearchBar } from '@/features/users/components/UserSearchBar.component';
import { CreateUserModal } from '@/features/users/components/CreateUserModal.component';
import { UsersFilters, UsersFiltersState, EMPTY_USERS_FILTERS_STATE } from '@/features/users/components/UsersFilters.component';
import { createUser } from '@/features/database/actions/users/createUser.action';
import { getEtiquetasAction } from '@/features/etiquetas/actions/getEtiquetas.action';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import { logError } from '@/features/menu/utils/logError.util';
import styles from '@/features/users/styles/UsersContainer.module.css';

const USERS_PER_PAGE = 10;

export default function UsersContainer() {
  const { t } = useLanguage();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithStats[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [searchQuery, setSearchQuery] = useState<string>(EMPTY_STRING);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [etiquetasMap, setEtiquetasMap] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<UsersFiltersState>(EMPTY_USERS_FILTERS_STATE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchEtiquetas = useCallback(async () => {
    try {
      const response = await getEtiquetasAction();
      if (response.success && response.data) {
        const map: Record<string, string> = {};
        response.data.forEach((etiqueta) => {
          map[etiqueta.name] = etiqueta.color;
        });
        setEtiquetasMap(map);
      }
    } catch (err) {
      logError('Error fetching etiquetas', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const response = await getUsersWithStatsAction();
      if (response.success && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else {
        setError(response.error || t('errorLoadingUsers'));
      }
    } catch (err) {
      const errorMessage = t('errorLoadingUsers');
      logError(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchEtiquetas();
  }, [fetchUsers, fetchEtiquetas]);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.tags.length > 0 ||
      filters.gender !== EMPTY_STRING ||
      filters.registrationDateRange.start.getTime() !== EMPTY_DATE.getTime() ||
      filters.registrationDateRange.end.getTime() !== EMPTY_DATE.getTime() ||
      filters.lastOrderDateRange.start.getTime() !== EMPTY_DATE.getTime() ||
      filters.lastOrderDateRange.end.getTime() !== EMPTY_DATE.getTime() ||
      filters.ltvRange.min !== 0 ||
      filters.ltvRange.max !== 0 ||
      filters.totalOrdersRange.min !== 0 ||
      filters.totalOrdersRange.max !== 0
    );
  }, [filters]);

  useEffect(() => {
    let filtered = [...users];

    if (searchQuery !== EMPTY_STRING) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (user) =>
          (user.name || EMPTY_STRING).toLowerCase().includes(query) ||
          (user.phoneNumber || EMPTY_STRING).includes(query)
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((user) => {
        const userTags = user.tags || [];
        return filters.tags.some((tag) => userTags.includes(tag));
      });
    }

    if (filters.gender !== EMPTY_STRING) {
      filtered = filtered.filter((user) => user.gender === filters.gender);
    }

    if (filters.registrationDateRange.start.getTime() !== EMPTY_DATE.getTime()) {
      filtered = filtered.filter((user) => {
        const registrationDate = new Date(user.createdAt);
        return registrationDate >= filters.registrationDateRange.start;
      });
    }

    if (filters.registrationDateRange.end.getTime() !== EMPTY_DATE.getTime()) {
      filtered = filtered.filter((user) => {
        const registrationDate = new Date(user.createdAt);
        const endDate = new Date(filters.registrationDateRange.end);
        endDate.setHours(23, 59, 59, 999);
        return registrationDate <= endDate;
      });
    }

    if (filters.lastOrderDateRange.start.getTime() !== EMPTY_DATE.getTime()) {
      filtered = filtered.filter((user) => {
        const lastOrderDate = user.stats.lastOrderDate;
        return lastOrderDate.getTime() !== EMPTY_DATE.getTime() && lastOrderDate >= filters.lastOrderDateRange.start;
      });
    }

    if (filters.lastOrderDateRange.end.getTime() !== EMPTY_DATE.getTime()) {
      filtered = filtered.filter((user) => {
        const lastOrderDate = user.stats.lastOrderDate;
        if (lastOrderDate.getTime() === EMPTY_DATE.getTime()) {
          return false;
        }
        const endDate = new Date(filters.lastOrderDateRange.end);
        endDate.setHours(23, 59, 59, 999);
        return lastOrderDate <= endDate;
      });
    }

    if (filters.ltvRange.min !== 0) {
      filtered = filtered.filter((user) => user.stats.lifetimeValue >= filters.ltvRange.min);
    }

    if (filters.ltvRange.max !== 0) {
      filtered = filtered.filter((user) => user.stats.lifetimeValue <= filters.ltvRange.max);
    }

    if (filters.totalOrdersRange.min !== 0) {
      filtered = filtered.filter((user) => user.stats.totalOrders >= filters.totalOrdersRange.min);
    }

    if (filters.totalOrdersRange.max !== 0) {
      filtered = filtered.filter((user) => user.stats.totalOrders <= filters.totalOrdersRange.max);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
    const initialUsers = filtered.slice(0, USERS_PER_PAGE);
    setDisplayedUsers(initialUsers);
  }, [users, searchQuery, filters]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const hasMore = currentPage < totalPages;
    const shouldLoadMore = currentPage > 1 && hasMore;

    if (shouldLoadMore) {
      const startIndex = (currentPage - 1) * USERS_PER_PAGE;
      const endIndex = startIndex + USERS_PER_PAGE;
      const nextUsers = filteredUsers.slice(startIndex, endIndex);
      setDisplayedUsers((prev) => [...prev, ...nextUsers]);
      setLoadingMore(false);
    }
  }, [currentPage, filteredUsers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
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
  }, [filteredUsers.length, currentPage, loadingMore]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCreateUser = useCallback(async (
    phoneNumber: string,
    name: string,
    birthdate: Date,
    gender: string,
    notes: string
  ): Promise<string> => {
    try {
      const response = await createUser(phoneNumber, name, birthdate, gender, notes);
      if (response.success) {
        setIsCreateModalOpen(false);
        await fetchUsers();
        return EMPTY_STRING;
      } else {
        return response.error || t('errorCreatingUser');
      }
    } catch (err) {
      logError('Error creating user', err);
      return t('errorCreatingUser');
    }
  }, [fetchUsers]);

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleFiltersChange = useCallback((newFilters: UsersFiltersState) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_USERS_FILTERS_STATE);
  }, []);

  const handleOpenFilters = useCallback(() => {
    setFiltersOpen(true);
  }, []);

  const handleCloseFilters = useCallback(() => {
    setFiltersOpen(false);
  }, []);

  if (loading) {
    return (
      <SafeArea className={styles.container} sides="all">
        <LoadingState title={t('loadingUsers')} />
      </SafeArea>
    );
  }

  if (error !== EMPTY_STRING) {
    return (
      <SafeArea className={styles.container} sides="all">
        <ErrorState error={error} onRetry={fetchUsers} />
      </SafeArea>
    );
  }

  return (
    <SafeArea className={styles.container} sides="all">
      <header className={styles.header}>
        <h1 className={styles.title}>{t('clientManagement')}</h1>

        <UserSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFiltersClick={handleOpenFilters}
          hasActiveFilters={hasActiveFilters()}
        />

        <button
          className={styles.createButton}
          onClick={handleOpenCreateModal}
          aria-label={t('createUser')}
        >
          <span className={`material-symbols-outlined ${styles.createIcon}`}>person_add</span>
          <span className={styles.createText}>{t('createUser')}</span>
        </button>

        <button
          className={styles.etiquetasButton}
          onClick={() => router.push('/admin/users/etiquetas')}
          aria-label={t('manageTags')}
        >
          <span className={`material-symbols-outlined ${styles.etiquetasIcon}`}>label</span>
          <span className={styles.etiquetasText}>{t('manageTags')}</span>
        </button>
      </header>

      <main className={styles.main}>
        {filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {searchQuery !== EMPTY_STRING
                ? t('noUsersFound')
                : t('noUsersRegistered')}
            </p>
          </div>
        ) : (
          <div className={styles.usersList}>
            {displayedUsers.map((user) => (
              <UserCard key={user._id || user.phoneNumber} user={user} etiquetasMap={etiquetasMap} />
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
        <CreateUserModal
          onClose={handleCloseCreateModal}
          onCreate={handleCreateUser}
        />
      )}

      <UsersFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
        open={filtersOpen}
        onClose={handleCloseFilters}
      />
    </SafeArea>
  );
}

