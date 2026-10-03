import React, { useEffect, useMemo, useState } from 'react';
import { ORDER_STATUS_FLOW, OrderStatus, PlacedOrder, Product } from '../../types';
import { OrderReceipt, formatOrderDate, printReceipt } from '../OrderReceipt';
import {
  COURIERS,
  STATUS_STYLES,
  UNCONFIRMED_ALERT_HOURS,
  customerWhatsAppLink,
  downloadCsv,
  formatRs,
  isStaleUnconfirmed,
  statusMessage
} from './adminUtils';
import { POINTS_EARN_RATE, adjustPointsRemote, getPointsRemote } from '../../lib/customerService';
import { toPhoneKey } from '../../lib/phone';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Copy,
  Download,
  Globe,
  Loader2,
  MessageCircle,
  Printer,
  Search,
  ShoppingBag,
  XCircle,
  AlertTriangle,
  Award
} from 'lucide-react';

interface AdminOrdersProps {
  orders: PlacedOrder[];
  products: Product[];
  updateOrder: (orderId: string, patch: Partial<PlacedOrder>) => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string | null) => void;
}

type StatusFilter = 'All' | OrderStatus;
type DateFilter = 'all' | 'today' | '7d' | '30d';

const ALL_STATUSES: OrderStatus[] = [...ORDER_STATUS_FLOW, 'Cancelled', 'Returned'];

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  products,
  updateOrder,
  saveProduct,
  showToast,
  selectedOrderId,
  onSelectOrder
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const since =
      dateFilter === 'today'
        ? new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        : dateFilter === '7d'
          ? Date.now() - 7 * 864e5
          : dateFilter === '30d'
            ? Date.now() - 30 * 864e5
            : 0;
    return orders.filter((o) => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (since && new Date(o.createdAt).getTime() < since) return false;
      if (!term) return true;
      return [o.orderId, o.customer.fullName, o.customer.phone, o.customer.city, ...o.items.map((i) => i.name)]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [orders, statusFilter, dateFilter, search]);

  const countFor = (s: StatusFilter) => (s === 'All' ? orders.length : orders.filter((o) => o.status === s).length);
  const selected = orders.find((o) => o.orderId === selectedOrderId) || null;

  const exportCsv = () => {
    downloadCsv(`orders-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Order ID', 'Date', 'Status', 'Source', 'Name', 'Phone', 'City', 'Address', 'Items', 'Subtotal', 'Discount', 'Delivery', 'Total', 'Payment', 'Courier', 'Tracking #', 'Notes'],
      ...filtered.map((o) => [
        o.orderId,
        formatOrderDate(o.createdAt),
        o.status,
        o.source,
        o.customer.fullName,
        o.customer.phone,
        o.customer.city,
        o.customer.address,
        o.items.map((i) => `${i.name} x${i.quantity}`).join('; '),
        o.subtotal,
        o.discount,
        o.shipping,
        o.total,
        o.paymentMethod,
        o.courier || '',
        o.trackingNumber || '',
        [o.customer.orderNotes, o.adminNotes].filter(Boolean).join(' | ')
      ])
    ]);
    showToast(`Exported ${filtered.length} orders`, 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
      {/* List */}
      <div className={`lg:col-span-2 space-y-3 ${selected ? 'hidden lg:block' : ''}`}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, name, phone, city, product…"
              className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-8 pr-3 text-xs outline-none focus:border-[#8A6D1F]"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="bg-white border border-gray-200 rounded-xl px-2 text-xs outline-none"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button
            onClick={exportCsv}
            title="Export to Excel (CSV)"
            className="px-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-[#8A6D1F]"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {(['All', ...ALL_STATUSES] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                statusFilter === s ? 'bg-[#1A1A1A] text-white' : 'bg-[#F7F3EC] text-gray-600 hover:text-black'
              }`}
            >
              {s} ({countFor(s)})
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="text-center text-xs text-gray-500 py-12 bg-white rounded-2xl border border-gray-200">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              No orders match these filters.
            </div>
          )}
          {filtered.map((o) => (
            <button
              key={o.orderId}
              onClick={() => onSelectOrder(o.orderId)}
              className={`w-full text-left bg-white p-3.5 rounded-2xl border transition-colors ${
                o.orderId === selectedOrderId ? 'border-[#8A6D1F] ring-2 ring-[#8A6D1F]/15' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs text-[#1A1A1A] flex items-center gap-1.5">
                  {o.source === 'ai-chat' ? (
                    <Bot className="w-3.5 h-3.5 text-[#8A6D1F]" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  {o.orderId}
                </span>
                <span className="flex items-center gap-1">
                  {isStaleUnconfirmed(o) && (
                    <span title={`Not confirmed for over ${UNCONFIRMED_ALERT_HOURS} hours`}>
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1.5 text-xs">
                <span className="text-gray-700 truncate">
                  <strong>{o.customer.fullName}</strong> • {o.customer.city}
                </span>
                <span className="font-bold shrink-0">{formatRs(o.total)}</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {formatOrderDate(o.createdAt)} • {o.items.reduce((a, i) => a + i.quantity, 0)} item(s)
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className={`lg:col-span-3 ${selected ? '' : 'hidden lg:block'}`}>
        {selected ? (
          <OrderDetails
            key={selected.orderId}
            order={selected}
            products={products}
            updateOrder={updateOrder}
            saveProduct={saveProduct}
            showToast={showToast}
            onBack={() => onSelectOrder(null)}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-xs text-gray-500">
            Select an order to see details, update its status and print the receipt.
          </div>
        )}
      </div>
    </div>
  );
};

interface OrderDetailsProps {
  order: PlacedOrder;
  products: Product[];
  updateOrder: AdminOrdersProps['updateOrder'];
  saveProduct: AdminOrdersProps['saveProduct'];
  showToast: AdminOrdersProps['showToast'];
  onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, products, updateOrder, saveProduct, showToast, onBack }) => {
  const [courier, setCourier] = useState(order.courier || '');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCourier(order.courier || '');
    setTrackingNumber(order.trackingNumber || '');
    setAdminNotes(order.adminNotes || '');
  }, [order.courier, order.trackingNumber, order.adminNotes]);

  const flowIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const nextStatus = flowIndex >= 0 && flowIndex < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[flowIndex + 1] : null;

  // Stock is taken out when an order is confirmed and put back if it is cancelled/returned.
  const adjustStock = async (direction: -1 | 1) => {
    const quantities = new Map<string, number>();
    order.items.forEach((item) => quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity));
    for (const [productId, quantity] of quantities) {
      const product = products.find((p) => p.id === productId);
      if (!product) continue;
      const stockCount = Math.max(0, product.stockCount + direction * quantity);
      await saveProduct({ ...product, stockCount, inStock: stockCount > 0 ? product.inStock || direction > 0 : false });
    }
  };

  const changeStatus = async (status: OrderStatus) => {
    if (status === order.status) return;
    const isActive = status !== 'Pending' && status !== 'Cancelled' && status !== 'Returned';
    const isClosed = status === 'Cancelled' || status === 'Returned';
    if (isClosed && !confirm(`Mark order ${order.orderId} as ${status}?`)) return;
    setBusy(true);
    try {
      const phoneKey = order.phoneKey || toPhoneKey(order.customer.phone);

      // Check redeemed points before changing anything, so a "no" leaves the order untouched.
      let pointsToDeduct = 0;
      if (phoneKey && isActive && order.pointsDiscount > 0 && !order.pointsDeducted) {
        const balance = await getPointsRemote(phoneKey);
        if (balance < order.pointsDiscount &&
          !confirm(`This customer only has ${balance} points but used ${order.pointsDiscount}. Confirm anyway?`)) {
          return;
        }
        pointsToDeduct = Math.min(balance, order.pointsDiscount);
      }

      const patch: Partial<PlacedOrder> = {
        status,
        statusHistory: [...(order.statusHistory || []), { status, at: new Date().toISOString() }]
      };

      // Stock: out on confirmation, back on cancel/return.
      if (isActive && !order.stockDeducted) {
        await adjustStock(-1);
        patch.stockDeducted = true;
      } else if (isClosed && order.stockDeducted) {
        await adjustStock(1);
        patch.stockDeducted = false;
      }

      // Loyalty points (kept per phone number).
      if (phoneKey) {
        if (isActive && order.pointsDiscount > 0 && !order.pointsDeducted) {
          await adjustPointsRemote(phoneKey, -pointsToDeduct);
          patch.pointsDeducted = pointsToDeduct;
        }
        if (status === 'Delivered' && !order.pointsAwarded) {
          const earned = Math.round(order.subtotal * POINTS_EARN_RATE);
          await adjustPointsRemote(phoneKey, earned);
          patch.pointsAwarded = earned;
        }
        if (isClosed) {
          if (order.pointsDeducted) {
            await adjustPointsRemote(phoneKey, order.pointsDeducted);
            patch.pointsDeducted = 0;
          }
          if (order.pointsAwarded) {
            await adjustPointsRemote(phoneKey, -order.pointsAwarded);
            patch.pointsAwarded = 0;
          }
        }
      }

      await updateOrder(order.orderId, patch);
      showToast(`Order ${order.orderId} → ${status}`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Could not update the order', 'warning');
    } finally {
      setBusy(false);
    }
  };

  const saveShipping = async () => {
    setBusy(true);
    try {
      await updateOrder(order.orderId, { courier: courier || undefined, trackingNumber: trackingNumber.trim() || undefined, adminNotes: adminNotes.trim() || undefined });
      showToast('Order details saved', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Could not save', 'warning');
    } finally {
      setBusy(false);
    }
  };

  const copyAddress = () => {
    const text = `${order.customer.fullName}\n${order.customer.phone}\n${order.customer.address}${order.customer.nearestLandmark ? `, ${order.customer.nearestLandmark}` : ''}\n${order.customer.city}\nCOD: ${formatRs(order.total)}`;
    void navigator.clipboard.writeText(text);
    showToast('Address copied for courier booking', 'success');
  };

  const shippingChanged =
    courier !== (order.courier || '') || trackingNumber !== (order.trackingNumber || '') || adminNotes !== (order.adminNotes || '');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4 text-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <button onClick={onBack} className="lg:hidden flex items-center gap-1 text-gray-500 mb-2 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" /> All orders
            </button>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-base text-[#1A1A1A]">{order.orderId}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
            </div>
            <p className="text-gray-500 mt-0.5">
              {formatOrderDate(order.createdAt)} • via {order.source === 'ai-chat' ? 'AI chat' : 'website'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-black text-lg">{formatRs(order.total)}</p>
            <p className="text-gray-500">{order.paymentMethod}</p>
          </div>
        </div>

        {/* Status actions */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#F7F3EC]">
          {nextStatus && (
            <button
              onClick={() => void changeStatus(nextStatus)}
              disabled={busy}
              className="py-2 px-3.5 rounded-xl bg-[#1A1A1A] text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5 text-[#F2B705]" />}
              <span>Mark as {nextStatus}</span>
            </button>
          )}
          <select
            value={order.status}
            disabled={busy}
            onChange={(e) => void changeStatus(e.target.value as OrderStatus)}
            className="py-2 px-2.5 rounded-xl border border-gray-200 bg-white font-semibold outline-none"
            title="Set any status"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {order.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Returned' && (
            <button
              onClick={() => void changeStatus('Cancelled')}
              disabled={busy}
              className="py-2 px-3 rounded-xl text-red-600 hover:bg-red-50 font-bold flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
          <a
            href={customerWhatsAppLink(order, statusMessage(order))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (order.status === 'Pending') {
                void updateOrder(order.orderId, { confirmationRequestedAt: new Date().toISOString() });
              }
            }}
            className="ml-auto py-2 px-3 rounded-xl bg-[#25D366] text-white font-bold flex items-center gap-1.5"
            title={order.status === 'Pending' ? 'Ask the customer to confirm this COD order' : 'Send the customer a message about the current status'}
          >
            <MessageCircle className="w-3.5 h-3.5" /> {order.status === 'Pending' ? 'Ask to confirm' : 'Notify customer'}
          </a>
        </div>
        {order.status === 'Pending' && (
          <div
            className={`-mt-1 p-3 rounded-xl text-[11px] flex items-start gap-2 ${
              isStaleUnconfirmed(order) ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-blue-50 border border-blue-100 text-blue-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {isStaleUnconfirmed(order)
                ? `Not confirmed for over ${UNCONFIRMED_ALERT_HOURS} hours. Ask again, or cancel if the customer doesn't reply.`
                : 'Cash on Delivery: dispatch only after the customer confirms on WhatsApp.'}
              {order.confirmationRequestedAt && ` Last asked ${formatOrderDate(order.confirmationRequestedAt)}.`}
            </span>
          </div>
        )}
        <p className="text-[10px] text-gray-400 -mt-2">
          Confirming takes the items out of stock and uses any redeemed points; delivery adds the customer&apos;s reward points. Cancel/return reverses both.
        </p>
        {(order.pointsDiscount > 0 || !!order.pointsAwarded) && (
          <p className="flex items-center gap-1.5 text-[11px] text-[#8A6D1F]">
            <Award className="w-3.5 h-3.5" />
            {order.pointsDiscount > 0 && `${order.pointsDiscount} points redeemed${order.pointsDeducted ? ` (${order.pointsDeducted} deducted)` : ' (deducted on confirmation)'}. `}
            {!!order.pointsAwarded && `${order.pointsAwarded} points awarded on delivery.`}
          </p>
        )}

        {/* Customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Customer</p>
            <p className="font-bold">{order.customer.fullName}</p>
            <p>{order.customer.phone}</p>
            {order.customer.email && <p className="text-gray-500">{order.customer.email}</p>}
          </div>
          <div className="p-3 rounded-xl border border-gray-100 relative">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Delivery address</p>
            <p>
              {order.customer.address}, <strong>{order.customer.city}</strong>
            </p>
            {order.customer.nearestLandmark && <p className="text-gray-500">Landmark: {order.customer.nearestLandmark}</p>}
            <button onClick={copyAddress} className="absolute top-2.5 right-2.5 text-gray-400 hover:text-[#8A6D1F]" title="Copy address">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {(order.customer.orderNotes || order.giftNote) && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-900 space-y-0.5">
            {order.customer.orderNotes && <p><strong>Customer note:</strong> {order.customer.orderNotes}</p>}
            {order.giftNote && <p><strong>🎁 Gift card:</strong> {order.giftNote}</p>}
          </div>
        )}

        {/* Items */}
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {item.image ? (
                <img src={item.image} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-100" />
              ) : (
                <div className="w-11 h-11 rounded-lg bg-gray-100" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.name}</p>
                <p className="text-gray-500">
                  {formatRs(item.price)} × {item.quantity}
                  {item.color && ` • ${item.color}`}
                </p>
              </div>
              <span className="font-bold">{formatRs(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Shipping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <label className="space-y-1">
            <span className="font-semibold text-gray-700">Courier</span>
            <select
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
            >
              <option value="">— Not booked yet —</option>
              {COURIERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="font-semibold text-gray-700">Tracking number</span>
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. 7012345678"
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
            />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="font-semibold text-gray-700">Internal notes (only admins see this)</span>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Customer asked to deliver after 5pm"
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
            />
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <button
              onClick={() => void saveShipping()}
              disabled={busy || !shippingChanged}
              className="py-2 px-4 rounded-xl bg-[#1A1A1A] text-white font-bold disabled:opacity-40"
            >
              Save details
            </button>
          </div>
        </div>

        {/* History */}
        {order.statusHistory?.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">History</p>
            <div className="space-y-1">
              {[...order.statusHistory].reverse().map((e, idx) => (
                <div key={idx} className="flex justify-between text-gray-600">
                  <span>{e.status}</span>
                  <span className="text-gray-400">{formatOrderDate(e.at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Receipt */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold text-gray-700">Receipt / Invoice</p>
          <button
            onClick={printReceipt}
            className="py-1.5 px-3 rounded-xl border border-gray-200 bg-white text-xs font-bold flex items-center gap-1.5 hover:border-[#8A6D1F]"
          >
            <Printer className="w-3.5 h-3.5 text-[#8A6D1F]" /> Print
          </button>
        </div>
        <OrderReceipt order={order} />
      </div>
    </div>
  );
};
