import React, { useEffect, useState } from 'react';
import { useShop, WHATSAPP_NUMBER, trackUrl } from '../context/ShopContext';
import { ORDER_STATUS_FLOW, OrderStatus, PlacedOrder } from '../types';
import { getOrderRemote } from '../lib/ordersService';
import { isFirebaseConfigured } from '../lib/firebase';
import { OrderReceipt, formatOrderDate, printReceipt, receiptText } from './OrderReceipt';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  MessageCircle,
  AlertCircle,
  Loader2,
  Receipt,
  Printer,
  XCircle
} from 'lucide-react';

const STEP_INFO: Record<OrderStatus, { title: string; desc: string }> = {
  Pending: { title: 'Order Received', desc: 'We have received your order and will confirm it shortly.' },
  Confirmed: { title: 'Order Confirmed', desc: 'Your order is confirmed and being prepared.' },
  Packed: { title: 'Packed', desc: 'Quality checked and securely packed.' },
  Shipped: { title: 'Handed to Courier', desc: 'Your parcel is on its way.' },
  'Out for Delivery': { title: 'Out for Delivery', desc: 'The rider will call you before delivery.' },
  Delivered: { title: 'Delivered', desc: 'Parcel delivered. Enjoy your purchase!' },
  Cancelled: { title: 'Cancelled', desc: 'This order was cancelled.' },
  Returned: { title: 'Returned', desc: 'This order was returned.' }
};

const normalizeId = (value: string) => {
  const v = value.trim().toUpperCase().replace(/\s+/g, '');
  if (!v) return '';
  return v.startsWith('TB-') ? v : v.startsWith('TB') ? `TB-${v.slice(2)}` : `TB-${v}`;
};

export const OrderTrackModal: React.FC = () => {
  const { orders: deviceOrders, trackOrderId } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  // Fetch the latest copy from the server (status is updated by the store there).
  const loadOrder = async (orderId: string) => {
    setIsLoading(true);
    setErrorMsg('');
    setShowReceipt(false);
    try {
      const remote = isFirebaseConfigured ? await getOrderRemote(orderId) : null;
      const found = remote || deviceOrders.find((o) => o.orderId === orderId) || null;
      setOrder(found);
      if (found) {
        // Keep the address shareable: /track/<order id>
        window.history.replaceState({}, '', `/track/${found.orderId}`);
      } else {
        setErrorMsg(`No order found with ID "${orderId}". Please check the ID on your receipt.`);
      }
    } catch {
      const local = deviceOrders.find((o) => o.orderId === orderId) || null;
      setOrder(local);
      if (!local) setErrorMsg('Could not check the order right now. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open the order from a /track/<id> link, else the customer's most recent order.
  useEffect(() => {
    const initial = trackOrderId || deviceOrders[0]?.orderId;
    if (initial) {
      setSearchTerm(trackOrderId || '');
      void loadOrder(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackOrderId]);

  const confirmOnWhatsApp = (o: PlacedOrder) => {
    const msg = `Assalam-o-Alaikum Trendy Bazar! 👋 ✅ I confirm my order *${o.orderId}* (Rs. ${o.total.toLocaleString()}, ${o.paymentMethod}).

${receiptText(o)}

Track: ${trackUrl(o.orderId)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchTerm.trim();
    if (!raw) return;

    // A phone number can only match orders placed from this device.
    const digits = raw.replace(/\D/g, '');
    if (digits.length >= 7 && !/[a-z]/i.test(raw)) {
      const match = deviceOrders.find((o) => o.customer.phone.replace(/\D/g, '').endsWith(digits.slice(-10)));
      if (match) {
        void loadOrder(match.orderId);
      } else {
        setOrder(null);
        setErrorMsg('Please enter your Order ID (e.g. TB-7K3M9QX) — it is on your receipt and WhatsApp message.');
      }
      return;
    }
    void loadOrder(normalizeId(raw));
  };

  const isClosed = order?.status === 'Cancelled' || order?.status === 'Returned';
  const currentStep = order ? ORDER_STATUS_FLOW.indexOf(order.status) : -1;
  const timeFor = (status: OrderStatus) =>
    [...(order?.statusHistory || [])].reverse().find((e) => e.status === status)?.at;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12" id="order-track-page">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 bg-[#F7F3EC] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Truck className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>Order Tracking</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A] mb-2">Track Your Order</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Enter the Order ID from your receipt or WhatsApp message (e.g. <strong>TB-7K3M9QX</strong>).
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-4 flex gap-2" id="track-order-form">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Order ID (TB-XXXXXXX)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 focus:border-[#F2B705] rounded-full py-3 pl-10 pr-4 text-xs sm:text-sm outline-none shadow-sm uppercase placeholder:normal-case"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-transform active:scale-95 shadow-md disabled:opacity-60 flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Track</span>
        </button>
      </form>

      {/* Orders from this device */}
      {deviceOrders.length > 0 && (
        <div className="max-w-lg mx-auto mb-6 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-gray-500">Your orders:</span>
          {deviceOrders.slice(0, 6).map((o) => (
            <button
              key={o.orderId}
              onClick={() => void loadOrder(o.orderId)}
              className={`px-2.5 py-1 rounded-full font-mono font-bold border transition-colors ${
                order?.orderId === o.orderId
                  ? 'bg-[#141414] text-white border-[#141414]'
                  : 'bg-white border-gold-hairline text-[#8A6D1F] hover:bg-[#F9F6F0]'
              }`}
            >
              {o.orderId}
            </button>
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="max-w-lg mx-auto mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!order && !errorMsg && !isLoading && deviceOrders.length === 0 && (
        <div className="max-w-lg mx-auto text-center text-xs text-gray-500 py-6">
          <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          Orders you place on this website will appear here automatically.
        </div>
      )}

      {order && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in duration-300">
          {/* Header */}
          <div className="bg-[#1A1A1A] text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-heading font-black text-lg text-[#F2B705]">Order {order.orderId}</span>
                <span
                  className={`text-white text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isClosed ? 'bg-red-600' : order.status === 'Delivered' ? 'bg-emerald-600' : 'bg-[#8A6D1F]'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Placed on {formatOrderDate(order.createdAt)}
                {order.courier && (
                  <>
                    {' '}• Courier: <strong>{order.courier}</strong>
                    {order.trackingNumber && ` (${order.trackingNumber})`}
                  </>
                )}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-gray-400 block">Total Payable</span>
              <span className="font-heading font-black text-lg">Rs. {order.total.toLocaleString()}</span>
              <span className="text-[10px] text-gray-300 block">{order.paymentMethod}</span>
            </div>
          </div>

          {order.status === 'Pending' && (
            <div className="m-5 sm:m-6 mb-0 sm:mb-0 p-4 rounded-2xl border-2 border-[#25D366]/50 bg-[#25D366]/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-[#141414]">Waiting for your confirmation</p>
                <p className="text-gray-600">
                  We dispatch Cash on Delivery orders after you confirm on WhatsApp.
                  <span className="block text-[#8A6D1F] font-semibold">Order confirm karne ke liye WhatsApp par message bhejein.</span>
                </p>
              </div>
              <button
                onClick={() => confirmOnWhatsApp(order)}
                className="py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> Confirm on WhatsApp
              </button>
            </div>
          )}

          {/* Delivery details */}
          <div className="p-5 sm:p-6 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Delivery Address</strong>
                <p className="text-gray-600">
                  {order.customer.fullName} ({order.customer.phone})
                  <br />
                  {order.customer.address}, {order.customer.city}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Package className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Items ({order.items.reduce((a, i) => a + i.quantity, 0)})</strong>
                <div className="text-gray-600 space-y-0.5 mt-0.5">
                  {order.items.map((it, idx) => (
                    <div key={idx}>
                      • {it.name} (x{it.quantity})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-5 sm:p-6">
            <h3 className="font-heading font-bold text-sm text-[#1A1A1A] mb-5">Order Progress</h3>

            {isClosed ? (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
                <XCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold">{STEP_INFO[order.status].title}</p>
                  <p>{STEP_INFO[order.status].desc} For questions please contact us on WhatsApp.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-gray-200">
                {ORDER_STATUS_FLOW.map((status, idx) => {
                  const done = idx <= currentStep;
                  const at = timeFor(status);
                  return (
                    <div key={status} className="relative flex items-start gap-4">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          done ? 'bg-[#F2B705] text-[#1A1A1A]' : 'bg-gray-200 text-gray-400'
                        } ${idx === currentStep ? 'ring-4 ring-[#F2B705]/30' : ''}`}
                      >
                        {done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4 className={`text-xs font-bold ${done ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                            {STEP_INFO[status].title}
                          </h4>
                          {done && at && <span className="text-[10px] text-gray-400 font-medium">{formatOrderDate(at)}</span>}
                        </div>
                        <p className={`text-[11px] mt-0.5 ${done ? 'text-gray-500' : 'text-gray-400'}`}>
                          {status === 'Shipped' && order.courier
                            ? `With ${order.courier}${order.trackingNumber ? ` — tracking # ${order.trackingNumber}` : ''}`
                            : STEP_INFO[status].desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Receipt */}
          <div className="px-5 sm:px-6 pb-5 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowReceipt((v) => !v)}
                className="py-2 px-3.5 rounded-full border border-gold-hairline text-xs font-bold text-[#141414] hover:bg-[#F9F6F0] flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5 text-[#8A6D1F]" />
                <span>{showReceipt ? 'Hide receipt' : 'View receipt'}</span>
              </button>
              {showReceipt && (
                <button
                  onClick={printReceipt}
                  className="py-2 px-3.5 rounded-full border border-gold-hairline text-xs font-bold text-[#141414] hover:bg-[#F9F6F0] flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#8A6D1F]" />
                  <span>Print / Save PDF</span>
                </button>
              )}
            </div>
            {showReceipt && <OrderReceipt order={order} />}
          </div>

          {/* Help */}
          <div className="p-4 bg-[#F7F3EC] border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-gray-600">Questions about delivery or want to change your address?</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Assalam-o-Alaikum! Checking status for Order ${order.orderId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#25D366] hover:underline"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
              <span>Contact us on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
