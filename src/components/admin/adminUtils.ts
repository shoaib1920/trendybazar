import { OrderStatus, PlacedOrder, Product } from '../../types';

export const formatRs = (amount: number) => `Rs. ${Math.round(amount).toLocaleString()}`;

export const LOW_STOCK_THRESHOLD = 5;

export const COURIERS = ['TCS', 'Leopards Courier', 'Trax', 'PostEx', 'M&P', 'Call Courier', 'Pakistan Post', 'Self delivery'];

export const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Packed: 'bg-indigo-100 text-indigo-800',
  Shipped: 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-cyan-100 text-cyan-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-700',
  Returned: 'bg-gray-200 text-gray-700'
};

export const isCountedSale = (o: PlacedOrder) => o.status !== 'Cancelled' && o.status !== 'Returned';

// 0300-1234567 / +92 300 1234567 / 3001234567 -> 923001234567
export const toWhatsAppNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92')) return digits;
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith('3')) return `92${digits}`;
  return digits;
};

export const customerWhatsAppLink = (order: PlacedOrder, text: string) =>
  `https://wa.me/${toWhatsAppNumber(order.customer.phone)}?text=${encodeURIComponent(text)}`;

// Ready-made message to the customer for the order's current status.
export const statusMessage = (order: PlacedOrder) => {
  const name = order.customer.fullName.split(' ')[0] || order.customer.fullName;
  const id = order.orderId;
  const total = formatRs(order.total);
  switch (order.status) {
    case 'Pending':
    case 'Confirmed':
      return `Assalam-o-Alaikum ${name}! ✅ Your Trendy Bazaar order ${id} (${total}) is confirmed. We will dispatch it soon. Shukriya!`;
    case 'Packed':
      return `Assalam-o-Alaikum ${name}! 📦 Your order ${id} is packed and will be handed to the courier shortly.`;
    case 'Shipped':
      return `Assalam-o-Alaikum ${name}! 🚚 Your order ${id} has been shipped${order.courier ? ` with ${order.courier}` : ''}${order.trackingNumber ? ` (tracking # ${order.trackingNumber})` : ''}. Please keep ${total} ready for Cash on Delivery.`;
    case 'Out for Delivery':
      return `Assalam-o-Alaikum ${name}! 🛵 Your order ${id} is out for delivery today. Please keep ${total} ready. The rider will call you.`;
    case 'Delivered':
      return `Assalam-o-Alaikum ${name}! 🎉 Your order ${id} has been delivered. Shukriya for shopping with Trendy Bazaar! We'd love your feedback.`;
    case 'Cancelled':
      return `Assalam-o-Alaikum ${name}. Your order ${id} has been cancelled. Please message us if you have any questions.`;
    case 'Returned':
      return `Assalam-o-Alaikum ${name}. Your order ${id} has been marked as returned. Please message us if you have any questions.`;
  }
};

export const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const escape = (v: string | number) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = '﻿' + rows.map((r) => r.map(escape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const isLowStock = (p: Product) => p.inStock && p.stockCount > 0 && p.stockCount <= LOW_STOCK_THRESHOLD;
export const isOutOfStock = (p: Product) => !p.inStock || p.stockCount <= 0;
