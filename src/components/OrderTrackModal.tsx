import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PlacedOrder } from '../types';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export const OrderTrackModal: React.FC = () => {
  const { orders, setActiveView, brandWhatsAppNumber } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<PlacedOrder | null>(orders[0] || null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim().toUpperCase();
    if (!term) return;

    const found = orders.find(
      (o) =>
        o.orderId.toUpperCase() === term ||
        o.customer.phone.includes(term) ||
        o.trackingNumber.toUpperCase() === term
    );

    if (found) {
      setSearchedOrder(found);
      setErrorMsg('');
    } else {
      setErrorMsg(`No order found matching "${searchTerm}". Try checking your WhatsApp or use sample order TB-9241.`);
    }
  };

  const checkpoints = [
    { title: 'Order Placed & Confirmed', time: 'Day 1 - 10:30 AM', done: true, desc: 'Order details verified via WhatsApp / Website' },
    { title: 'Packed at Lahore Hub', time: 'Day 1 - 04:15 PM', done: true, desc: 'Quality checked and securely packaged' },
    { title: 'Handed to Courier Partner', time: 'Day 2 - 11:00 AM', done: true, desc: searchedOrder?.courier || 'Trax Logistics' },
    { title: 'Arrived at Destination Hub', time: 'Day 3 - 09:20 AM', done: searchedOrder?.status === 'Out for Delivery' || searchedOrder?.status === 'Delivered', desc: `In transit to ${searchedOrder?.customer.city || 'your city'}` },
    { title: 'Out for Delivery', time: 'Today - 11:45 AM', done: searchedOrder?.status === 'Out for Delivery' || searchedOrder?.status === 'Delivered', desc: 'Rider assigned with Cash on Delivery parcel' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12" id="order-track-page">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 bg-[#F7F3EC] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Truck className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>Live Pakistan Dispatch Tracking</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A] mb-2">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Enter your Order ID (e.g. <strong>TB-9241</strong>) or registered WhatsApp phone number to check status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Order ID (TB-XXXX) or Phone #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 focus:border-[#F2B705] rounded-full py-3 pl-10 pr-4 text-xs sm:text-sm outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-transform active:scale-95 shadow-md"
        >
          Track
        </button>
      </form>

      {errorMsg && (
        <div className="max-w-lg mx-auto mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Status Display */}
      {searchedOrder && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in duration-300">
          {/* Header Card */}
          <div className="bg-[#1A1A1A] text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading font-black text-lg text-[#F2B705]">
                  Order #{searchedOrder.orderId}
                </span>
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {searchedOrder.status}
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Booked on: {searchedOrder.date} • Courier: <strong>{searchedOrder.courier}</strong> ({searchedOrder.trackingNumber})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-gray-400 block">Total Payable:</span>
              <span className="font-heading font-black text-lg text-white">
                Rs. {searchedOrder.total.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-300 block">{searchedOrder.paymentMethod}</span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="p-5 sm:p-6 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Delivery Destination:</strong>
                <p className="text-gray-600">
                  {searchedOrder.customer.fullName} ({searchedOrder.customer.phone})<br />
                  {searchedOrder.customer.address}, {searchedOrder.customer.city}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Package className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Parcel Contents ({searchedOrder.items.length} items):</strong>
                <div className="text-gray-600 space-y-0.5 mt-0.5">
                  {searchedOrder.items.map((it, idx) => (
                    <div key={idx}>
                      • {it.product.name} (x{it.quantity})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-5 sm:p-6">
            <h3 className="font-heading font-bold text-sm text-[#1A1A1A] mb-5">
              Live Courier Progress
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200">
              {checkpoints.map((cp, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      cp.done ? 'bg-[#F2B705] text-[#1A1A1A]' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {cp.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold ${cp.done ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                        {cp.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-medium">{cp.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{cp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need help footer */}
          <div className="p-4 bg-[#F7F3EC] border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-gray-600">
              Have questions about your delivery timing or address change?
            </span>
            <a
              href={`https://wa.me/923364300592?text=Assalam-o-Alaikum!%20Checking%20status%20for%20Order%20${searchedOrder.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#25D366] hover:underline"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
              <span>Contact Delivery Support on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
