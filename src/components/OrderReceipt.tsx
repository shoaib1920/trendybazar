import React from 'react';
import { PlacedOrder } from '../types';

const formatRs = (amount: number) => `Rs. ${Math.round(amount).toLocaleString()}`;

export const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

// Opens the browser print dialog for the receipt marked with `.print-receipt`
// (see index.css). Customers can "Save as PDF" from the same dialog.
export const printReceipt = () => window.print();

// Plain-text version for sharing on WhatsApp.
export const receiptText = (order: PlacedOrder) =>
  `🧾 *Trendy Bazaar — Receipt*
Order: *${order.orderId}*
Date: ${formatOrderDate(order.createdAt)}

${order.items
  .map((i) => `• ${i.name}${i.color ? ` (${i.color})` : ''} × ${i.quantity} — ${formatRs(i.price * i.quantity)}`)
  .join('\n')}

Subtotal: ${formatRs(order.subtotal)}${order.discount > 0 ? `\nDiscount${order.discountCode ? ` (${order.discountCode})` : ''}: -${formatRs(order.discount)}` : ''}${order.giftWrapFee > 0 ? `\nGift wrap: ${formatRs(order.giftWrapFee)}` : ''}${order.pointsDiscount > 0 ? `\nPoints discount: -${formatRs(order.pointsDiscount)}` : ''}
Delivery: ${order.shipping === 0 ? 'FREE' : formatRs(order.shipping)}
*Total: ${formatRs(order.total)}*
Payment: ${order.paymentMethod}

👤 ${order.customer.fullName}
📞 ${order.customer.phone}
🏠 ${order.customer.address}, ${order.customer.city}`;

interface OrderReceiptProps {
  order: PlacedOrder;
  // Only one receipt on screen should be printable at a time.
  printable?: boolean;
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({ order, printable = true }) => {
  const rows: { label: string; value: string; tone?: string }[] = [
    { label: 'Subtotal', value: formatRs(order.subtotal) },
    ...(order.discount > 0
      ? [{ label: `Discount${order.discountCode ? ` (${order.discountCode})` : ''}`, value: `-${formatRs(order.discount)}`, tone: 'text-emerald-700' }]
      : []),
    ...(order.giftWrapFee > 0 ? [{ label: 'Gift box & card', value: formatRs(order.giftWrapFee) }] : []),
    ...(order.pointsDiscount > 0
      ? [{ label: 'Loyalty points', value: `-${formatRs(order.pointsDiscount)}`, tone: 'text-emerald-700' }]
      : []),
    { label: 'Delivery', value: order.shipping === 0 ? 'FREE' : formatRs(order.shipping) }
  ];

  return (
    <div
      className={`${printable ? 'print-receipt' : ''} bg-white text-[#141414] rounded-2xl border border-gold-hairline p-5 sm:p-6 text-left text-xs`}
      id={printable ? 'order-receipt' : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-dashed border-gray-300">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="h-10 w-auto" />
          <div>
            <p className="font-black uppercase tracking-[0.14em] text-sm leading-none">Trendy Bazaar</p>
            <p className="text-[10px] text-gray-500 mt-1">WhatsApp: +92 336 4300592</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">Receipt</p>
          <p className="font-mono font-bold text-sm">{order.orderId}</p>
          <p className="text-[10px] text-gray-500">{formatOrderDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Customer */}
      <div className="py-3 border-b border-dashed border-gray-300 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Bill to</p>
          <p className="font-bold">{order.customer.fullName}</p>
          <p className="text-gray-600">{order.customer.phone}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Deliver to</p>
          <p className="text-gray-700">
            {order.customer.address}, {order.customer.city}
          </p>
        </div>
      </div>

      {/* Items */}
      <table className="w-full my-3">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-gray-500">
            <th className="text-left font-semibold pb-1.5">Item</th>
            <th className="text-center font-semibold pb-1.5 w-10">Qty</th>
            <th className="text-right font-semibold pb-1.5 w-20">Price</th>
            <th className="text-right font-semibold pb-1.5 w-20">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx} className="border-t border-gray-100 align-top">
              <td className="py-1.5 pr-2">
                {item.name}
                {item.color && <span className="text-gray-500"> ({item.color})</span>}
              </td>
              <td className="py-1.5 text-center">{item.quantity}</td>
              <td className="py-1.5 text-right whitespace-nowrap">{formatRs(item.price)}</td>
              <td className="py-1.5 text-right whitespace-nowrap font-semibold">{formatRs(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t border-dashed border-gray-300 pt-3 space-y-1">
        {rows.map((row) => (
          <div key={row.label} className={`flex justify-between ${row.tone || 'text-gray-600'}`}>
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
        <div className="flex justify-between font-black text-sm pt-2 mt-1 border-t border-gray-200">
          <span>Total</span>
          <span>{formatRs(order.total)}</span>
        </div>
        <div className="flex justify-between text-gray-500 pt-1">
          <span>Payment</span>
          <span>{order.paymentMethod}</span>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-500 mt-4 pt-3 border-t border-dashed border-gray-300">
        Shukriya for shopping with Trendy Bazaar! • 7-day easy exchange • Track your order with the ID above
      </p>
    </div>
  );
};
