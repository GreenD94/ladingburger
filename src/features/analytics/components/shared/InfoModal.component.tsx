'use client';

import React, { useState } from 'react';
import styles from '@/features/analytics/styles/shared/InfoModal.module.css';

interface InfoModalProps {
  title: string;
  description: string;
  goodScenario: string;
  badScenario: string;
  formula: string;
  dataSources: string[];
}

export default function InfoModal({ 
  title, 
  description, 
  goodScenario, 
  badScenario, 
  formula, 
  dataSources 
}: InfoModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open) {
    return (
      <button 
        className={styles.infoButton}
        onClick={handleOpen}
        aria-label="Más información"
        title="Más información"
      >
        <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
      </button>
    );
  }

  return (
    <>
      <button 
        className={styles.infoButton}
        onClick={handleOpen}
        aria-label="Más información"
        title="Más información"
      >
        <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
      </button>

      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar">
              <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
            </button>
          </div>
          
          <div className={styles.modalContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Descripción</h3>
              <p className={styles.sectionText}>{description}</p>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Escenarios</h3>
              <div className={styles.goodScenario}>
                <h4 className={styles.scenarioTitle}>Buen escenario:</h4>
                <p className={styles.scenarioText}>{goodScenario}</p>
              </div>
              <div className={styles.badScenario}>
                <h4 className={styles.scenarioTitle}>Mal escenario:</h4>
                <p className={styles.scenarioText}>{badScenario}</p>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Fórmula Matemática</h3>
              <div className={styles.formulaBox}>
                <p className={styles.formulaText}>{formula}</p>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Fuentes de Datos</h3>
              <ul className={styles.dataSourcesList}>
                {dataSources.map((source, index) => (
                  <li key={index} className={styles.dataSourceItem}>
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button className={styles.closeActionButton} onClick={handleClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

