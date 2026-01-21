import { Order, OrderStatusLabels, OrderStatusType } from '@/features/database/types/index.type';
import { EMPTY_DATE_RANGE } from '@/features/database/constants/emptyValues.constants';

export interface ExportOptions {
  orders: Order[];
  dateRange?: { start: Date; end: Date };
  getBurgerName: (burgerId: string) => string;
}

export function exportOrdersToCSV(options: ExportOptions): void {
  const { orders, dateRange, getBurgerName } = options;

  let filteredOrders = orders;
  const effectiveDateRange = dateRange || EMPTY_DATE_RANGE;
  if (effectiveDateRange.start.getTime() !== 0 || effectiveDateRange.end.getTime() !== 0) {
    filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (effectiveDateRange.start.getTime() !== 0 && orderDate < effectiveDateRange.start) return false;
      if (effectiveDateRange.end.getTime() !== 0) {
        const endDate = new Date(effectiveDateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
      return true;
    });
  }

  const headers = [
    'ID Pedido',
    'Fecha',
    'Cliente',
    'Teléfono',
    'Estado',
    'Productos',
    'Cantidad',
    'Total',
    'Estado Pago',
  ];

  const rows = filteredOrders.flatMap((order) => {
    return order.items.map((item, index) => [
      index === 0 ? order._id?.toString().slice(-6) || '' : '',
      index === 0 ? new Date(order.createdAt).toLocaleString('es-VE') : '',
      index === 0 ? (order.customerName || 'N/A') : '',
      index === 0 ? order.customerPhone : '',
      index === 0 ? OrderStatusLabels[order.status] : '',
      getBurgerName(item.burgerId),
      item.quantity.toString(),
      index === 0 ? `$${order.totalPrice.toLocaleString()}` : '',
      index === 0 ? (order.status === OrderStatus.COOKING || order.status === OrderStatus.IN_TRANSIT || order.status === OrderStatus.WAITING_PICKUP || order.status === OrderStatus.COMPLETED ? 'Pagado' : order.status === OrderStatus.PAYMENT_FAILED ? 'Pago Fallido' : 'Pendiente') : '',
    ]);
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportOrdersSummaryToCSV(options: ExportOptions): void {
  const { orders, dateRange } = options;

  let filteredOrders = orders;
  const effectiveDateRange = dateRange || EMPTY_DATE_RANGE;
  if (effectiveDateRange.start.getTime() !== 0 || effectiveDateRange.end.getTime() !== 0) {
    filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (effectiveDateRange.start.getTime() !== 0 && orderDate < effectiveDateRange.start) return false;
      if (effectiveDateRange.end.getTime() !== 0) {
        const endDate = new Date(effectiveDateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
      return true;
    });
  }

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusCounts: Record<OrderStatusType, number> = {} as Record<OrderStatusType, number>;
  filteredOrders.forEach((order) => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  const summary = [
    ['Resumen de Pedidos'],
    [''],
    ['Período', effectiveDateRange.start.getTime() !== 0 && effectiveDateRange.end.getTime() !== 0
      ? `${new Date(effectiveDateRange.start).toLocaleDateString()} - ${new Date(effectiveDateRange.end).toLocaleDateString()}`
      : 'Todos'],
    ['Total Pedidos', totalOrders.toString()],
    ['Ingresos Totales', `$${totalRevenue.toLocaleString()}`],
    ['Promedio por Pedido', `$${averageOrderValue.toFixed(2)}`],
    [''],
    ['Pedidos por Estado'],
    ...Object.entries(statusCounts).map(([status, count]) => [
      OrderStatusLabels[parseInt(status) as OrderStatusType],
      count.toString(),
    ]),
  ];

  const csvContent = summary.map((row) => row.join(',')).join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `resumen_pedidos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportOrdersToPDF(options: ExportOptions): Promise<void> {
  alert('Exportación a PDF requiere la librería jsPDF. Por favor, use la exportación CSV por ahora.');
}
