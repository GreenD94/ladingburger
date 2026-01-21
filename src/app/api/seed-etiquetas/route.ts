// NOTE: This API route was used as a one-time seeder for etiquetas.
// It is now commented out to prevent further use.
//
// import { seedEtiquetasAction } from '@/features/etiquetas/actions/seedEtiquetas.action';
// import { NextResponse } from 'next/server';
//
// export async function GET() {
//   try {
//     const result = await seedEtiquetasAction();
//     
//     if (result.success) {
//       return NextResponse.json(result, { status: 200 });
//     } else {
//       return NextResponse.json(result, { status: 400 });
//     }
//   } catch (error) {
//     console.error('Error in seed-etiquetas route:', error);
//     return NextResponse.json(
//       { success: false, error: 'Error interno del servidor' },
//       { status: 500 }
//     );
//   }
// }

