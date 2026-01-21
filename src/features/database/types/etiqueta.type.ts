import { ObjectId } from 'mongodb';

export interface Etiqueta {
  _id?: ObjectId | string;
  id: string;
  ref: string;
  name: string;
  color: string;
  isEnabled: boolean;
  isSystemManaged: boolean;
  isSystemCreated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEtiquetaDTO {
  name: string;
  color: string;
}

export interface UpdateEtiquetaDTO {
  name?: string;
  color?: string;
  isEnabled?: boolean;
}

export function generateEtiquetaRef(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateEtiquetaId(): string {
  return `etq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

