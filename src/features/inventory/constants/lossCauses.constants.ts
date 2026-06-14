import { MaterialLossCause } from '../types/loss.type';

export const LOSS_CAUSE_LABELS: Record<MaterialLossCause, string> = {
  [MaterialLossCause.EXPIRATION]: 'Expiración',
  [MaterialLossCause.SPOILAGE]: 'Descomposición',
  [MaterialLossCause.DAMAGE]: 'Daño',
  [MaterialLossCause.OVERCOOKING]: 'Sobre-cocción',
  [MaterialLossCause.PREPARATION_ERROR]: 'Error de Preparación',
  [MaterialLossCause.THEFT]: 'Robo',
  [MaterialLossCause.INVENTORY_ERROR]: 'Error de Inventario',
  [MaterialLossCause.OTHER]: 'Otro',
};

