'use client';

import React from 'react';
import { UserWithStats } from '@/features/users/actions/getUserById.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { getAvatarUrl } from '@/features/users/utils/avatar.util';
import styles from '@/features/users/styles/UserDetailHeader.module.css';

interface UserDetailHeaderProps {
  user: UserWithStats;
  onBack: () => void;
}

export function UserDetailHeader({ user, onBack }: UserDetailHeaderProps) {
  const avatarSeed = user._id || user.phoneNumber || EMPTY_STRING;
  const avatarUrl = getAvatarUrl(user.gender, avatarSeed);
  const displayName = user.name || user.phoneNumber || 'Sin nombre';
  const hasHighLTV = user.stats.lifetimeValue > 1000;
  const segment = hasHighLTV ? 'VIP Premium' : 'Cliente Regular';

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={onBack} aria-label="Volver">
          <span className={`material-symbols-outlined ${styles.backIcon}`}>arrow_back</span>
        </button>
        <h2 className={styles.title}>Perfil Cliente</h2>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.avatarContainer}>
          <img
            src={avatarUrl}
            alt={`Avatar de ${displayName}`}
            className={styles.avatar}
          />
          {hasHighLTV && (
            <div className={styles.badge}>
              GOLD
            </div>
          )}
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{displayName}</h1>
          <p className={styles.segment}>{segment}</p>
        </div>
      </div>
    </header>
  );
}

