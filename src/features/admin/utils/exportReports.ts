/**
 * Export utilities for orders reports
 * Supports CSV and PDF export
 */

import { Order } from '@/features/database/types';
import { OrderStatusLabels } from '@/features/database/types';

export interface ExportOptions {
  orders: Order[];
  dateRange?: { start: Date | null; end: Date | null };
  getBurgerName: (burgerId: string) => string;
}

/**
 * Export orders to CSV format
 */
export function exportOrdersToCSV(options: ExportOptions): void {
  const { orders, dateRange, getBurgerName } = options;

  // Filter by date range if provided
  let filteredOrders = orders;
  if (dateRange?.start || dateRange?.end) {
    filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (dateRange.start && orderDate < dateRange.start) return false;
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
      return true;
    });
  }

  // CSV Headers
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

  // CSV Rows
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
      index === 0 ? (order.paymentInfo.paymentStatus === 1 ? 'Pagado' : 'Pendiente') : '',
    ]);
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  // Create blob and download
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

/**
 * Export orders summary to CSV
 */
export function exportOrdersSummaryToCSV(options: ExportOptions): void {
  const { orders, dateRange } = options;

  // Filter by date range if provided
  let filteredOrders = orders;
  if (dateRange?.start || dateRange?.end) {
    filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (dateRange.start && orderDate < dateRange.start) return false;
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
      return true;
    });
  }

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Count by status
  const statusCounts: Record<number, number> = {};
  filteredOrders.forEach((order) => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  const summary = [
    ['Resumen de Pedidos'],
    [''],
    ['Período', dateRange?.start && dateRange?.end 
      ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`
      : 'Todos'],
    ['Total Pedidos', totalOrders.toString()],
    ['Ingresos Totales', `$${totalRevenue.toLocaleString()}`],
    ['Promedio por Pedido', `$${averageOrderValue.toFixed(2)}`],
    [''],
    ['Pedidos por Estado'],
    ...Object.entries(statusCounts).map(([status, count]) => [
      OrderStatusLabels[parseInt(status)],
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

/**
 * Export to PDF (requires jsPDF library)
 * This is a placeholder - actual implementation would require jsPDF
 */
export async function exportOrdersToPDF(options: ExportOptions): Promise<void> {
  // This would require jsPDF library
  // For now, we'll just show an alert
  alert('Exportación a PDF requiere la librería jsPDF. Por favor, use la exportación CSV por ahora.');
  
  // Future implementation:
  // import jsPDF from 'jspdf';
  // const doc = new jsPDF();
  // ... add content
  // doc.save('pedidos.pdf');
}

