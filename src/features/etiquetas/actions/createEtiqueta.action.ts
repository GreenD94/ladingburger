'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { CreateEtiquetaDTO, Etiqueta, generateEtiquetaRef, generateEtiquetaId } from '@/features/database/types/etiqueta.type';
import { ObjectId } from 'mongodb';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export interface CreateEtiquetaResponse {
  success: boolean;
  data?: Etiqueta;
  error?: string;
}

export async function createEtiquetaAction(
  etiqueta: CreateEtiquetaDTO
): Promise<CreateEtiquetaResponse> {
  try {
    const { db } = await connectToDatabase();

    if (!etiqueta.name || etiqueta.name.trim() === EMPTY_STRING) {
      return {
        success: false,
        error: 'El nombre de la etiqueta es requerido',
      };
    }

    if (!etiqueta.color || etiqueta.color.trim() === EMPTY_STRING) {
      return {
        success: false,
        error: 'El color de la etiqueta es requerido',
      };
    }

    const etiquetasCollection = db.collection('etiquetas');

    const existingEtiqueta = await etiquetasCollection.findOne({
      name: { $regex: new RegExp(`^${etiqueta.name.trim()}$`, 'i') },
    });

    if (existingEtiqueta) {
      return {
        success: false,
        error: 'Ya existe una etiqueta con ese nombre',
      };
    }

    const now = new Date();
    const name = etiqueta.name.trim();
    const id = generateEtiquetaId();
    const ref = generateEtiquetaRef(name);
    
    const newEtiqueta = {
      id,
      ref,
      name,
      color: etiqueta.color.trim(),
      isEnabled: true,
      isSystemManaged: false,
      isSystemCreated: false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await etiquetasCollection.insertOne(newEtiqueta);

    const createdEtiqueta: Etiqueta = {
      _id: result.insertedId.toString(),
      id: newEtiqueta.id,
      ref: newEtiqueta.ref,
      name: newEtiqueta.name,
      color: newEtiqueta.color,
      isEnabled: newEtiqueta.isEnabled,
      isSystemManaged: newEtiqueta.isSystemManaged,
      isSystemCreated: newEtiqueta.isSystemCreated,
      createdAt: newEtiqueta.createdAt,
      updatedAt: newEtiqueta.updatedAt,
    };

    return {
      success: true,
      data: createdEtiqueta,
    };
  } catch (error) {
    console.error('Error creating etiqueta:', error);
    return {
      success: false,
      error: 'Error al crear la etiqueta',
    };
  }
}

