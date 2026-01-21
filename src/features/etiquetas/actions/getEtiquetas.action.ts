'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { Etiqueta, generateEtiquetaRef, generateEtiquetaId } from '@/features/database/types/etiqueta.type';
import { WithId, Document } from 'mongodb';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export interface GetEtiquetasResponse {
  success: boolean;
  data?: Etiqueta[];
  error?: string;
}

interface EtiquetaDocument extends WithId<Document> {
  id?: string;
  ref?: string;
  name: string;
  color: string;
  isEnabled: boolean;
  isSystemManaged?: boolean;
  isSystemCreated?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getEtiquetasAction(): Promise<GetEtiquetasResponse> {
  try {
    const { db } = await connectToDatabase();

    const etiquetasCollection = db.collection('etiquetas');
    const etiquetasDocs = await etiquetasCollection
      .find({})
      .sort({ name: 1 })
      .toArray();

    const etiquetas: Etiqueta[] = etiquetasDocs.map((doc) => {
      const etiquetaDoc = doc as unknown as EtiquetaDocument;
      const name = etiquetaDoc.name || EMPTY_STRING;
      return {
        _id: etiquetaDoc._id.toString(),
        id: etiquetaDoc.id || generateEtiquetaId(),
        ref: etiquetaDoc.ref || generateEtiquetaRef(name),
        name,
        color: etiquetaDoc.color || '#135bec',
        isEnabled: etiquetaDoc.isEnabled !== false,
        isSystemManaged: etiquetaDoc.isSystemManaged === true,
        isSystemCreated: etiquetaDoc.isSystemCreated === true,
        createdAt: new Date(etiquetaDoc.createdAt),
        updatedAt: new Date(etiquetaDoc.updatedAt),
      };
    });

    return {
      success: true,
      data: etiquetas,
    };
  } catch (error) {
    console.error('Error fetching etiquetas:', error);
    return {
      success: false,
      error: 'Error al cargar las etiquetas',
    };
  }
}

