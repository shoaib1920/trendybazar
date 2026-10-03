import React, { useMemo } from 'react';
import { PlacedOrder, Product } from '../../types';
import { formatOrderDate } from '../OrderReceipt';
import { STATUS_STYLES, formatRs, isCountedSale, isLowStock, isOutOfStock, isStaleUnconfirmed } from './adminUtils';
import { AlertTriangle, Banknote, Clock, PackageX, ShoppingBag, TrendingUp } from 'lucide-react';

interface AdminDashboardProps {
  orders: PlacedOrder[];
  products: Product[];
  onOpenOrder: (orderId: string) => void;
  onOpenOrdersTab: () => void;
  onOpenInventory: () => void;
}

// Local calendar day (not UTC — Pakistan is UTC+5).
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products, onOpenOrder, onOpenOrdersTab, onOpenInventory }) => {
  const stats = useMemo(() => {
    const sales = orders.filter(isCountedSale);
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const time = (o: PlacedOrder) => new Date(o.createdAt).getTime();

    const todayOrders = orders.filter((o) => time(o) >= startOfToday);
    const monthSales = sales.filter((o) => time(o) >= startOfMonth);
    const pending = orders.filter((o) => o.status === 'Pending');
    const toShip = orders.filter((o) => o.status === 'Confirmed' || o.status === 'Packed');
    const codToCollect = orders
      .filter((o) => o.status === 'Shipped' || o.status === 'Out for Delivery')
      .reduce((sum, o) => sum + o.total, 0);

    // Last 7 days, oldest first.
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfToday - (6 - i) * 864e5);
      const key = dayKey(d);
      const dayOrders = sales.filter((o) => dayKey(new Date(o.createdAt)) === key);
      return {
        label: d.toLocaleDateString('en-PK', { weekday: 'short' }),
        count: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0)
      };
    });

    const productTotals = new Map<string, { name: string; quantity: number; revenue: number }>();
    sales.forEach((o) =>
      o.items.forEach((i) => {
        const entry = productTotals.get(i.name) || { name: i.name, quantity: 0, revenue: 0 };
        entry.quantity += i.quantity;
        entry.revenue += i.price * i.quantity;
        productTotals.set(i.name, entry);
      })
    );
    const topProducts = [...productTotals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    return {
      todayCount: todayOrders.length,
      todayRevenue: todayOrders.filter(isCountedSale).reduce((s, o) => s + o.total, 0),
      monthRevenue: monthSales.reduce((s, o) => s + o.total, 0),
      monthCount: monthSales.length,
      avgOrder: sales.length ? sales.reduce((s, o) => s + o.total, 0) / sales.length : 0,
      pending,
      stale: pending.filter(isStaleUnconfirmed).length,
      toShip,
      codToCollect,
      days,
      topProducts
    };
  }, [orders]);

  const lowStock = products.filter(isLowStock);
  const outOfStock = products.filter(isOutOfStock);
  const maxDay = Math.max(1, ...stats.days.map((d) => d.count));

  const cards = [
    { label: "Today's orders", value: String(stats.todayCount), sub: formatRs(stats.todayRevenue), icon: ShoppingBag },
    { label: 'This month', value: formatRs(stats.monthRevenue), sub: `${stats.monthCount} orders`, icon: TrendingUp },
    {
      label: 'Need confirming',
      value: String(stats.pending.length),
      sub: stats.stale > 0 ? `⚠ ${stats.stale} waiting 24h+ • ${stats.toShip.length} to ship` : `${stats.toShip.length} ready to ship`,
      icon: Clock,
      alert: stats.pending.length > 0
    },
    { label: 'COD to collect', value: formatRs(stats.codToCollect), sub: `Avg order ${formatRs(stats.avgOrder)}`, icon: Banknote }
  ];

  return (
    <div className="space-y-5 text-xs">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`bg-white rounded-2xl border p-4 ${c.alert ? 'border-amber-300 bg-amber-50/40' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between text-gray-500 font-semibold">
              <span>{c.label}</span>
              <c.icon className="w-4 h-4 text-[#8A6D1F]" />
            </div>
            <p className="font-heading font-black text-xl text-[#1A1A1A] mt-1.5">{c.value}</p>
            <p className="text-gray-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 7-day chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-4">
          <p className="font-bold text-sm text-[#1A1A1A] mb-3">Orders — last 7 days</p>
          <div className="flex items-end gap-2 h-36">
            {stats.days.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end" title={`${d.count} orders • ${formatRs(d.revenue)}`}>
                <span className="text-[10px] font-bold text-gray-600">{d.count || ''}</span>
                <div
                  className="w-full max-w-10 rounded-t-lg bg-[#F2B705]"
                  style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? 6 : 2, opacity: d.count ? 1 : 0.25 }}
                />
                <span className="text-[10px] text-gray-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock alerts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-sm text-[#1A1A1A]">Stock alerts</p>
            <button onClick={onOpenInventory} className="text-[11px] font-bold text-[#8A6D1F] hover:underline">
              Manage →
            </button>
          </div>
          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <p className="text-gray-500">All products are well stocked. ✅</p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {outOfStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <span className="truncate flex items-center gap-1.5">
                    <PackageX className="w-3.5 h-3.5 text-red-600 shrink-0" /> {p.name}
                  </span>
                  <span className="text-red-600 font-bold shrink-0">Out</span>
                </div>
              ))}
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <span className="truncate flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {p.name}
                  </span>
                  <span className="text-amber-700 font-bold shrink-0">{p.stockCount} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent / pending orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-sm text-[#1A1A1A]">Recent orders</p>
            <button onClick={onOpenOrdersTab} className="text-[11px] font-bold text-[#8A6D1F] hover:underline">
              All orders →
            </button>
          </div>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet. New website and AI-chat orders will appear here instantly.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 6).map((o) => (
                <button
                  key={o.orderId}
                  onClick={() => onOpenOrder(o.orderId)}
                  className="w-full flex items-center justify-between gap-3 py-2 text-left hover:bg-[#F7F3EC]/60 rounded-lg px-1"
                >
                  <div className="min-w-0">
                    <p className="font-mono font-bold">{o.orderId}</p>
                    <p className="text-gray-500 truncate">
                      {o.customer.fullName} • {o.customer.city} • {formatOrderDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold">{formatRs(o.total)}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="font-bold text-sm text-[#1A1A1A] mb-3">Best sellers</p>
          {stats.topProducts.length === 0 ? (
            <p className="text-gray-500">Sales data will show here once orders come in.</p>
          ) : (
            <div className="space-y-2">
              {stats.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#F7F3EC] text-[#8A6D1F] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="text-gray-500 shrink-0">{p.quantity} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
