export const SYSTEM_ETIQUETA_TAGS = {
  NUEVO: 'Nuevo',
  PAGO_FALLIDO: 'Pago Fallido',
  CANCELACIONES_FRECUENTES: 'Cancelaciones Frecuentes',
  PROBLEMAS_ENTREGA: 'Problemas de Entrega',
  REEMBOLSOS: 'Reembolsos',
  CLIENTE_ACTIVO: 'Cliente Activo',
  EN_RIESGO: 'En Riesgo',
  PRIMER_PEDIDO: 'Primer Pedido',
} as const;

export type SystemEtiquetaTag =
  (typeof SYSTEM_ETIQUETA_TAGS)[keyof typeof SYSTEM_ETIQUETA_TAGS];


