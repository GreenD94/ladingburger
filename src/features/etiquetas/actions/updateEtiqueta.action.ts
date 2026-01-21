'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { UpdateEtiquetaDTO, Etiqueta } from '@/features/database/types/etiqueta.type';
import { ObjectId } from 'mongodb';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export interface UpdateEtiquetaResponse {
  success: boolean;
  data?: Etiqueta;
  error?: string;
}

export async function updateEtiquetaAction(
  id: string,
  updates: UpdateEtiquetaDTO
): Promise<UpdateEtiquetaResponse> {
  try {
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(id)) {
      return {
        success: false,
        error: 'ID de etiqueta inválido',
      };
    }

    const etiquetasCollection = db.collection('etiquetas');

    const currentEtiqueta = await etiquetasCollection.findOne({ _id: new ObjectId(id) });
    if (!currentEtiqueta) {
      return {
        success: false,
        error: 'Etiqueta no encontrada',
      };
    }

    const current = currentEtiqueta as unknown as Etiqueta & { _id: ObjectId; isSystemManaged?: boolean };
    
    if (updates.isEnabled !== undefined && current.isSystemManaged === true) {
      return {
        success: false,
        error: 'No se puede deshabilitar una etiqueta gestionada por el sistema',
      };
    }

    if (updates.name !== undefined && current.isSystemManaged === true) {
      return {
        success: false,
        error: 'No se puede editar el nombre de una etiqueta gestionada por el sistema',
      };
    }

    if (updates.name !== undefined && updates.name.trim() === EMPTY_STRING) {
      return {
        success: false,
        error: 'El nombre de la etiqueta no puede estar vacío',
      };
    }

    if (updates.color !== undefined && updates.color.trim() === EMPTY_STRING) {
      return {
        success: false,
        error: 'El color de la etiqueta no puede estar vacío',
      };
    }

    if (updates.name !== undefined && !current.isSystemManaged) {
      const existingEtiqueta = await etiquetasCollection.findOne({
        name: { $regex: new RegExp(`^${updates.name.trim()}$`, 'i') },
        _id: { $ne: new ObjectId(id) },
      });

      if (existingEtiqueta) {
        return {
          success: false,
          error: 'Ya existe una etiqueta con ese nombre',
        };
      }
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates.name !== undefined) {
      updateData.name = updates.name.trim();
    }

    if (updates.color !== undefined) {
      updateData.color = updates.color.trim();
    }

    if (updates.isEnabled !== undefined) {
      updateData.isEnabled = updates.isEnabled;
    }

    const result = await etiquetasCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return {
        success: false,
        error: 'Error al actualizar la etiqueta',
      };
    }

    const updatedEtiqueta = result as unknown as Etiqueta & { _id: ObjectId; id?: string; ref?: string; isSystemManaged?: boolean; isSystemCreated?: boolean };
    const etiqueta: Etiqueta = {
      _id: updatedEtiqueta._id.toString(),
      id: updatedEtiqueta.id || '',
      ref: updatedEtiqueta.ref || '',
      name: updatedEtiqueta.name || EMPTY_STRING,
      color: updatedEtiqueta.color || '#135bec',
      isEnabled: updatedEtiqueta.isEnabled !== false,
      isSystemManaged: updatedEtiqueta.isSystemManaged === true,
      isSystemCreated: updatedEtiqueta.isSystemCreated === true,
      createdAt: new Date(updatedEtiqueta.createdAt),
      updatedAt: new Date(updatedEtiqueta.updatedAt),
    };

    return {
      success: true,
      data: etiqueta,
    };
  } catch (error) {
    console.error('Error updating etiqueta:', error);
    return {
      success: false,
      error: 'Error al actualizar la etiqueta',
    };
  }
}

