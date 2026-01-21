'use client';

import React from 'react';
import { Etiqueta } from '@/features/database/types/etiqueta.type';
import { EtiquetaCard } from '@/features/etiquetas/components/EtiquetaCard.component';
import styles from '@/features/etiquetas/styles/EtiquetaList.module.css';

interface EtiquetaListProps {
  etiquetas: Etiqueta[];
  onEdit: (etiqueta: Etiqueta) => void;
  onToggleEnabled: (id: string, isEnabled: boolean) => void;
}

export function EtiquetaList({ etiquetas, onEdit, onToggleEnabled }: EtiquetaListProps) {
  return (
    <div className={styles.list}>
      {etiquetas.map((etiqueta) => (
        <EtiquetaCard
          key={etiqueta._id}
          etiqueta={etiqueta}
          onEdit={onEdit}
          onToggleEnabled={onToggleEnabled}
        />
      ))}
    </div>
  );
}

