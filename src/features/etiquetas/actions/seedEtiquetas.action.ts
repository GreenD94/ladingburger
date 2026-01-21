// NOTE: One-time etiquetas seeder.
// This file is kept for historical/reference purposes but is not used at runtime anymore.
// All code has been commented out to avoid accidental execution.
//
// 'use server';
//
// import { connectToDatabase } from '@/features/database/actions/connect.action';
// import { Etiqueta, generateEtiquetaRef, generateEtiquetaId } from '@/features/database/types/etiqueta.type';
// import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
//
// export interface SeedEtiquetasResponse {
//   success: boolean;
//   message?: string;
//   error?: string;
//   insertedCount?: number;
// }
//
// interface SystemEtiqueta {
//   name: string;
//   color: string;
//   ref: string;
// }
//
// const SYSTEM_ETIQUETAS: SystemEtiqueta[] = [ /* ... */ ];
// const MANUAL_ETIQUETAS: SystemEtiqueta[] = [ /* ... */ ];
//
// export async function seedEtiquetasAction(): Promise<SeedEtiquetasResponse> {
//   // implementation commented out
// }

