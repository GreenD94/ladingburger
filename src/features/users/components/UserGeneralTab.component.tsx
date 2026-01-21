'use client';

import React from 'react';
import { UserWithStats } from '@/features/users/actions/getUserById.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { formatDate, calculateAge } from '@/features/users/utils/dateFormat.util';
import styles from '@/features/users/styles/UserGeneralTab.module.css';

interface UserGeneralTabProps {
  user: UserWithStats;
}

export function UserGeneralTab({ user }: UserGeneralTabProps) {
  const registrationDate = formatDate(user.createdAt);
  const birthdateFormatted = user.birthdate ? formatDate(user.birthdate) : 'No disponible';
  const age = calculateAge(user.birthdate);

  return (
    <div className={styles.content}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Información de Contacto</h3>
        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <span className={`material-symbols-outlined ${styles.icon}`}>call</span>
            </div>
            <div className={styles.infoContent}>
              <p className={styles.infoValue}>{user.phoneNumber || EMPTY_STRING}</p>
              <p className={styles.infoLabel}>Móvil</p>
            </div>
          </div>

          {user.birthdate && (
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <span className={`material-symbols-outlined ${styles.icon}`}>cake</span>
              </div>
              <div className={styles.infoContent}>
                <p className={styles.infoValue}>{birthdateFormatted}</p>
                <p className={styles.infoLabel}>Fecha de Nacimiento ({age})</p>
              </div>
            </div>
          )}

          {user.gender && (
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <span className={`material-symbols-outlined ${styles.icon}`}>person</span>
              </div>
              <div className={styles.infoContent}>
                <p className={styles.infoValue}>{user.gender}</p>
                <p className={styles.infoLabel}>Género</p>
              </div>
            </div>
          )}

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <span className={`material-symbols-outlined ${styles.icon}`}>calendar_today</span>
            </div>
            <div className={styles.infoContent}>
              <p className={styles.infoValue}>{registrationDate}</p>
              <p className={styles.infoLabel}>Fecha de registro</p>
            </div>
          </div>
        </div>
      </section>

      {user.tags && user.tags.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Etiquetas</h3>
          <div className={styles.tagsContainer}>
            {user.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {user.notes && user.notes.trim() !== EMPTY_STRING && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Notas</h3>
          <div className={styles.notesCard}>
            <p className={styles.notesText}>{user.notes}</p>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Resumen de Métricas</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Lifetime Value</p>
            <p className={styles.metricValue}>${user.stats.lifetimeValue.toLocaleString()}</p>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Ticket Promedio</p>
            <p className={styles.metricValue}>
              ${user.stats.totalOrders > 0
                ? (user.stats.lifetimeValue / user.stats.totalOrders).toFixed(2)
                : '0.00'}
            </p>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Pedidos</p>
            <p className={styles.metricValue}>{user.stats.totalOrders}</p>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Retención</p>
            <p className={styles.metricValue}>
              {user.stats.totalOrders > 5 ? 'Alta' : user.stats.totalOrders > 2 ? 'Media' : 'Baja'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

