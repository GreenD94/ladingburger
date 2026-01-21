'use client';

import React, { useState } from 'react';
import { UserWithStats } from '@/features/users/actions/getUserById.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { UserDetailHeader } from '@/features/users/components/UserDetailHeader.component';
import { UserDetailTabs } from '@/features/users/components/UserDetailTabs.component';
import { UserGeneralTab } from '@/features/users/components/UserGeneralTab.component';
import { UserStatsTab } from '@/features/users/components/UserStatsTab.component';
import { UserHistoryTab } from '@/features/users/components/UserHistoryTab.component';
import { EditUserModal } from '@/features/users/components/EditUserModal.component';
import styles from '@/features/users/styles/UserDetailView.module.css';

interface UserDetailViewProps {
  user: UserWithStats;
  onBack: () => void;
  onUserUpdate: (updates: {
    phoneNumber?: string;
    name?: string;
    birthdate?: Date;
    gender?: string;
    notes?: string;
    tags?: string[];
  }) => Promise<string>;
}

type TabType = 'general' | 'stats' | 'history';

export function UserDetailView({ user, onBack, onUserUpdate }: UserDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleWhatsAppClick = () => {
    if (user.phoneNumber && user.phoneNumber !== EMPTY_STRING) {
      const cleanPhone = user.phoneNumber.replace(/\D/g, '');
      const whatsappLink = `https://wa.me/${cleanPhone}`;
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <UserDetailHeader user={user} onBack={onBack} />
      
      <UserDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.content}>
        {activeTab === 'general' && (
          <UserGeneralTab user={user} />
        )}
        {activeTab === 'stats' && (
          <UserStatsTab user={user} />
        )}
        {activeTab === 'history' && (
          <UserHistoryTab phoneNumber={user.phoneNumber} />
        )}
      </main>

      <footer className={styles.footer}>
        <button
          className={styles.editButton}
          onClick={() => setIsEditModalOpen(true)}
          aria-label="Editar usuario"
        >
          <span className={`material-symbols-outlined ${styles.editIcon}`}>edit</span>
          <span className={styles.editText}>Editar</span>
        </button>
        <button
          className={styles.whatsappButton}
          onClick={handleWhatsAppClick}
          aria-label="Abrir WhatsApp"
        >
          <span className={`material-symbols-outlined ${styles.whatsappIcon}`}>chat</span>
          <span className={styles.whatsappText}>WhatsApp</span>
        </button>
      </footer>

      {isEditModalOpen && (
        <EditUserModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={async (updates) => {
            const errorMessage = await onUserUpdate(updates);
            if (errorMessage === EMPTY_STRING) {
              setIsEditModalOpen(false);
            }
            return errorMessage;
          }}
        />
      )}
    </div>
  );
}

