import React, { useMemo, useState } from 'react';
import { PlacedOrder } from '../../types';
import { formatOrderDate } from '../OrderReceipt';
import { downloadCsv, formatRs, isCountedSale, toWhatsAppNumber } from './adminUtils';
import { Download, MessageCircle, Search, Users } from 'lucide-react';

interface AdminCustomersProps {
  orders: PlacedOrder[];
  onOpenOrder: (orderId: string) => void;
}

interface CustomerRow {
  key: string;
  name: string;
  phone: string;
  city: string;
  orders: PlacedOrder[];
  spent: number;
  lastOrderAt: string;
}

// Customers are grouped by phone number (the one field every order has).
export const AdminCustomers: React.FC<AdminCustomersProps> = ({ orders, onOpenOrder }) => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const customers = useMemo(() => {
    const map = new Map<string, CustomerRow>();
    // Orders arrive newest first, so the first one seen holds the latest name/city.
    orders.forEach((o) => {
      const key = toWhatsAppNumber(o.customer.phone) || o.customer.fullName.toLowerCase();
      const row =
        map.get(key) ||
        { key, name: o.customer.fullName, phone: o.customer.phone, city: o.customer.city, orders: [], spent: 0, lastOrderAt: o.createdAt };
      row.orders.push(o);
      if (isCountedSale(o)) row.spent += o.total;
      if (o.createdAt > row.lastOrderAt) row.lastOrderAt = o.createdAt;
      map.set(key, row);
    });
    return [...map.values()].sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const term = search.trim().toLowerCase();
  const visible = customers.filter((c) => !term || `${c.name} ${c.phone} ${c.city}`.toLowerCase().includes(term));
  const repeat = customers.filter((c) => c.orders.length > 1).length;

  const exportCsv = () =>
    downloadCsv(`customers-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Name', 'Phone', 'City', 'Orders', 'Total spent', 'Last order'],
      ...customers.map((c) => [c.name, c.phone, c.city, c.orders.length, c.spent, formatOrderDate(c.lastOrderAt)])
    ]);

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-[#F7F3EC] rounded-xl px-3 py-2">
          <strong>{customers.length}</strong> customers • <strong>{repeat}</strong> repeat buyers
        </div>
        <div className="relative ml-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, city…"
            className="bg-white border border-gray-200 rounded-xl py-2 pl-8 pr-3 outline-none focus:border-[#8A6D1F]"
          />
        </div>
        <button onClick={exportCsv} className="py-2 px-3 bg-white border border-gray-200 rounded-xl font-bold flex items-center gap-1.5 hover:border-[#8A6D1F]">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {visible.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            Customers appear here automatically after their first order.
          </div>
        )}
        {visible.map((c) => (
          <div key={c.key} className="p-3">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setExpanded(expanded === c.key ? null : c.key)} className="flex-1 min-w-[160px] text-left">
                <p className="font-bold text-[#1A1A1A]">
                  {c.name}
                  {c.orders.length > 1 && (
                    <span className="ml-1.5 text-[10px] bg-[#F2B705]/20 text-[#8A6D1F] px-1.5 py-0.5 rounded-full">Repeat</span>
                  )}
                </p>
                <p className="text-gray-500">
                  {c.phone} • {c.city}
                </p>
              </button>
              <div className="text-right">
                <p className="font-bold">{formatRs(c.spent)}</p>
                <p className="text-gray-400">
                  {c.orders.length} order{c.orders.length > 1 ? 's' : ''} • last {formatOrderDate(c.lastOrderAt)}
                </p>
              </div>
              <a
                href={`https://wa.me/${toWhatsAppNumber(c.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#25D366]/10 text-[#1fa855] hover:bg-[#25D366]/20"
                title="WhatsApp customer"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            {expanded === c.key && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.orders.map((o) => (
                  <button
                    key={o.orderId}
                    onClick={() => onOpenOrder(o.orderId)}
                    className="px-2.5 py-1 rounded-full bg-[#F7F3EC] font-mono font-bold text-[#8A6D1F] hover:bg-[#efe7d8]"
                  >
                    {o.orderId} • {o.status}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
