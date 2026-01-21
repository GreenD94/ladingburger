'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import {
  getEtiquetasAction,
  Etiqueta,
} from '@/features/etiquetas/actions/getEtiquetas.action';
import { createEtiquetaAction } from '@/features/etiquetas/actions/createEtiqueta.action';
import { updateEtiquetaAction } from '@/features/etiquetas/actions/updateEtiqueta.action';
import { EtiquetaList } from '@/features/etiquetas/components/EtiquetaList.component';
import { CreateEtiquetaModal } from '@/features/etiquetas/components/CreateEtiquetaModal.component';
import { EditEtiquetaModal } from '@/features/etiquetas/components/EditEtiquetaModal.component';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import { logError } from '@/features/menu/utils/logError.util';
import styles from '@/features/etiquetas/styles/EtiquetasContainer.module.css';

export default function EtiquetasContainer() {
  const router = useRouter();
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingEtiqueta, setEditingEtiqueta] = useState<Etiqueta | null>(null);

  const fetchEtiquetas = useCallback(async () => {
    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const response = await getEtiquetasAction();
      if (response.success && response.data) {
        setEtiquetas(response.data);
      } else {
        setError(response.error || 'Error al cargar las etiquetas');
      }
    } catch (err) {
      const errorMessage = 'Ocurrió un error al cargar las etiquetas';
      logError(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEtiquetas();
  }, [fetchEtiquetas]);

  const handleCreate = useCallback(async (name: string, color: string) => {
    try {
      const response = await createEtiquetaAction({ name, color });
      if (response.success && response.data) {
        setEtiquetas((prev) => [...prev, response.data!].sort((a, b) => a.name.localeCompare(b.name)));
        setCreateModalOpen(false);
      } else {
        logError('Error creating etiqueta', new Error(response.error || 'Unknown error'));
        return response.error || 'Error al crear la etiqueta';
      }
    } catch (err) {
      logError('Error creating etiqueta', err);
      return 'Ocurrió un error al crear la etiqueta';
    }
    return EMPTY_STRING;
  }, []);

  const handleUpdate = useCallback(async (id: string, name: string, color: string) => {
    try {
      const response = await updateEtiquetaAction(id, { name, color });
      if (response.success && response.data) {
        setEtiquetas((prev) =>
          prev
            .map((e) => (e._id === id ? response.data! : e))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        setEditingEtiqueta(null);
      } else {
        logError('Error updating etiqueta', new Error(response.error || 'Unknown error'));
        return response.error || 'Error al actualizar la etiqueta';
      }
    } catch (err) {
      logError('Error updating etiqueta', err);
      return 'Ocurrió un error al actualizar la etiqueta';
    }
    return EMPTY_STRING;
  }, []);

  const handleToggleEnabled = useCallback(async (id: string, isEnabled: boolean) => {
    try {
      const response = await updateEtiquetaAction(id, { isEnabled: !isEnabled });
      if (response.success && response.data) {
        setEtiquetas((prev) =>
          prev.map((e) => (e._id === id ? response.data! : e))
        );
      } else {
        logError('Error toggling etiqueta', new Error(response.error || 'Unknown error'));
      }
    } catch (err) {
      logError('Error toggling etiqueta', err);
    }
  }, []);

  const handleEdit = useCallback((etiqueta: Etiqueta) => {
    setEditingEtiqueta(etiqueta);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingEtiqueta(null);
  }, []);

  if (loading) {
    return (
      <SafeArea className={styles.container} sides="all">
        <LoadingState title="Cargando etiquetas..." />
      </SafeArea>
    );
  }

  if (error !== EMPTY_STRING) {
    return (
      <SafeArea className={styles.container} sides="all">
        <ErrorState error={error} onRetry={fetchEtiquetas} />
      </SafeArea>
    );
  }

  return (
    <SafeArea className={styles.container} sides="all">
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button
            className={styles.backButton}
            onClick={() => router.back()}
            aria-label="Volver"
          >
            <span className={`material-symbols-outlined ${styles.backIcon}`}>arrow_back</span>
          </button>
          <h1 className={styles.title}>Etiquetas de Usuario</h1>
        </div>
        <button
          className={styles.createButton}
          onClick={() => setCreateModalOpen(true)}
          aria-label="Crear etiqueta"
        >
          <span className={`material-symbols-outlined ${styles.createIcon}`}>add</span>
          <span className={styles.createText}>Crear Etiqueta</span>
        </button>
      </header>

      <main className={styles.main}>
        {etiquetas.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No hay etiquetas creadas</p>
          </div>
        ) : (
          <EtiquetaList
            etiquetas={etiquetas}
            onEdit={handleEdit}
            onToggleEnabled={handleToggleEnabled}
          />
        )}
        <div className={styles.spacer}></div>
      </main>

      {createModalOpen && (
        <CreateEtiquetaModal
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreate}
        />
      )}

      {editingEtiqueta && (
        <EditEtiquetaModal
          etiqueta={editingEtiqueta}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}
    </SafeArea>
  );
}

