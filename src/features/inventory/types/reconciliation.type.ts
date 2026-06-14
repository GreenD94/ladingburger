import { MaterialLossCause } from './loss.type';

export interface MaterialReconciliation {
  materialId: string;
  materialName: string;
  estimatedConsumed: number;
  actualConsumed: number;
  difference: number;
  lossQuantity?: number;
  lossCause?: MaterialLossCause;
  lossNotes?: string;
  leftoverQuantity?: number;
  leftoverNotes?: string;
  notes?: string;
}

export interface BillReconciliation {
  billId: string;
  materialReconciliation: MaterialReconciliation[];
  confirmedBy: string;
  confirmedAt: Date;
  notes?: string;
}

