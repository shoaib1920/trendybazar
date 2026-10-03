import React, { useEffect, useRef, useState } from 'react';
import { Bot, CheckCircle2, Loader2, MessageCircle, Printer, Send, Sparkles, X } from 'lucide-react';
import { useShop, WHATSAPP_NUMBER, trackUrl } from '../context/ShopContext';
import { PHONE_HINT, toPhoneKey } from '../lib/phone';
import { OrderLimitError } from '../lib/ordersService';
import { generateOrderId } from '../lib/ordersService';
import { PlacedOrder } from '../types';
import { OrderReceipt, printReceipt, receiptText } from './OrderReceipt';
import type { ChatOrder, ChatReply } from '../../api/chat';

interface UiMessage {
  role: 'user' | 'model';
  text: string;
  order?: ChatOrder;
  // Set once the order has been saved and sent.
  placedOrder?: PlacedOrder;
}

const FREE_SHIPPING_THRESHOLD = 3500;
const SHIPPING_FEE = 150;

const GREETING =
  'Assalam-o-Alaikum! 👋 Main Trendy Bazaar ka AI assistant hoon. Aap Roman Urdu, اردو, English ya kisi bhi zubaan mein baat kar sakte hain. Kya order karna chahenge?';

const QUICK_PROMPTS = [
  'Mujhe order karna hai',
  'Earbuds dikhao',
  'Watches kaun si available hain?',
  'Delivery charges kya hain?'
];

export const AiChatAssistant: React.FC = () => {
  const { products, activeView, submitOrder } = useShop();
  const [isPlacing, setIsPlacing] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<PlacedOrder | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([{ role: 'model', text: GREETING }]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking, isOpen]);

  const findProduct = (name: string) => {
    const wanted = name.trim().toLowerCase();
    return (
      products.find((p) => p.name.toLowerCase() === wanted) ||
      products.find((p) => p.name.toLowerCase().includes(wanted) || wanted.includes(p.name.toLowerCase()))
    );
  };

  // Totals come from the live catalog, not from the AI, so prices are always right.
  const priceOrder = (order: ChatOrder) => {
    const lines = order.items.map((item) => {
      const product = findProduct(item.product);
      const quantity = Math.max(1, Math.round(item.quantity) || 1);
      return { name: product?.name || item.product, quantity, unitPrice: product?.price ?? 0 };
    });
    const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return { lines, subtotal, shipping, total: subtotal + shipping };
  };

  const buildOrder = (order: ChatOrder): PlacedOrder => {
    const { subtotal, shipping, total } = priceOrder(order);
    const now = new Date().toISOString();
    return {
      orderId: generateOrderId(),
      createdAt: now,
      source: 'ai-chat',
      customer: {
        fullName: order.customerName.trim(),
        phone: order.phone.trim(),
        city: order.city.trim(),
        address: order.address.trim(),
        orderNotes: order.notes?.trim() || undefined
      },
      items: order.items.map((item) => {
        const product = findProduct(item.product);
        return {
          productId: product?.id || '',
          name: product?.name || item.product,
          image: product?.images[0] || '',
          price: product?.price ?? 0,
          quantity: Math.max(1, Math.round(item.quantity) || 1)
        };
      }),
      subtotal,
      discount: 0,
      shipping,
      giftWrapFee: 0,
      pointsDiscount: 0,
      total,
      paymentMethod: 'Cash on Delivery (COD)',
      status: 'Pending',
      statusHistory: [{ status: 'Pending', at: now }]
    };
  };

  // Saves the order to the store database, then opens WhatsApp with the receipt.
  const placeAndSendOrder = async (messageIndex: number, chatOrder: ChatOrder) => {
    const existing = messages[messageIndex]?.placedOrder;
    if (!existing && !toPhoneKey(chatOrder.phone)) {
      setError(`${PHONE_HINT}. Please send your correct number in the chat.`);
      return;
    }
    // Open the tab right away — browsers block pop-ups opened after an await.
    const waWindow = window.open('', '_blank');
    let placed = existing;
    if (!placed) {
      setIsPlacing(true);
      setError('');
      try {
        placed = (await submitOrder(buildOrder(chatOrder))).order;
        setMessages((prev) => prev.map((m, i) => (i === messageIndex ? { ...m, placedOrder: placed } : m)));
      } catch (err) {
        waWindow?.close();
        setError(err instanceof OrderLimitError ? err.message : 'Could not place the order. Please try again.');
        return;
      } finally {
        setIsPlacing(false);
      }
    }
    const msg = `Assalam-o-Alaikum! ✅ I confirm this order placed via the website AI assistant.

${receiptText(placed)}

Track: ${trackUrl(placed.orderId)}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    if (waWindow) {
      waWindow.opener = null;
      waWindow.location.href = url;
    } else {
      window.location.href = url;
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const nextMessages: UiMessage[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsThinking(true);

    // The greeting is local UI only; the model's history starts at the first customer message.
    const firstUser = nextMessages.findIndex((m) => m.role === 'user');
    const history = nextMessages.slice(firstUser).map(({ role, text }) => ({ role, text }));
    const catalog = products.map((p) => ({
      name: p.name,
      price: p.price,
      category: p.category === 'electronics' ? 'earbuds' : 'watches',
      inStock: p.inStock,
      tagline: p.tagline
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, catalog })
      });
      const data = (await response.json().catch(() => ({}))) as Partial<ChatReply> & { error?: string };
      if (!response.ok || !data.reply) throw new Error(data.error || 'The assistant is unavailable right now.');

      const order = data.orderReady && data.order && data.order.items.length > 0 ? data.order : undefined;
      setMessages((prev) => [...prev, { role: 'model', text: data.reply!, order }]);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  // On phones, sit above the bottom nav (and above the product page's sticky buy bar).
  const mobileBottom = activeView === 'product' ? 'bottom-[148px]' : 'bottom-[88px]';

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${mobileBottom} md:bottom-24 right-4 md:right-6 z-40 flex items-center gap-2 pl-3 pr-4 h-12 rounded-full bg-[#141414] text-white shadow-2xl border border-[#F2B705]/40 hover:scale-105 active:scale-95 transition-transform`}
          aria-label="Open AI shopping assistant"
          id="ai-chat-button"
          data-tour="ai-chat"
        >
          <Sparkles className="w-5 h-5 text-[#F2B705]" />
          <span className="text-xs font-bold">Order with AI</span>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed z-[60] inset-x-0 bottom-0 h-[88dvh] md:inset-x-auto md:right-6 md:bottom-6 md:h-[600px] md:max-h-[calc(100vh-3rem)] md:w-[400px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          role="dialog"
          aria-label="AI shopping assistant"
        >
          {/* Header */}
          <div className="bg-[#141414] px-4 py-3 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F2B705] flex items-center justify-center text-black">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Trendy Bazaar Assistant</h4>
                <p className="text-[11px] text-[#F2B705]">Roman Urdu • اردو • English • & more</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-full" aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#F7F3EC]/50 text-[13px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  dir="auto"
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#141414] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-xs rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>

                {m.order && (() => {
                  const priced = priceOrder(m.order);
                  return (
                    <div className="mt-2 w-[85%] bg-white border border-[#F2B705]/50 rounded-2xl p-3.5 shadow-sm space-y-2 text-xs">
                      <p className="font-bold text-[#141414]">Order summary</p>
                      {priced.lines.map((l, idx) => (
                        <div key={idx} className="flex justify-between gap-2">
                          <span className="text-gray-700">{l.name} × {l.quantity}</span>
                          <span className="font-semibold shrink-0">Rs. {(l.unitPrice * l.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-gray-500">
                        <span>Delivery</span>
                        <span>{priced.shipping === 0 ? 'FREE' : `Rs. ${priced.shipping}`}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-gray-100 pt-2">
                        <span>Total (COD)</span>
                        <span>Rs. {priced.total.toLocaleString()}</span>
                      </div>
                      <p className="text-gray-500 leading-snug">
                        {m.order.customerName} • {m.order.phone}
                        <br />
                        {m.order.address}, {m.order.city}
                      </p>
                      {m.placedOrder && (
                        <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            Order saved • ID <span className="font-mono">{m.placedOrder.orderId}</span>
                          </span>
                        </p>
                      )}
                      <button
                        onClick={() => void placeAndSendOrder(i, m.order!)}
                        disabled={isPlacing}
                        className="w-full mt-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isPlacing ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                        <span>{m.placedOrder ? 'Send again on WhatsApp' : 'Send order on WhatsApp'}</span>
                      </button>
                      {m.placedOrder && (
                        <button
                          onClick={() => setReceiptOrder(m.placedOrder!)}
                          className="w-full py-2 rounded-xl border border-gold-hairline font-bold text-[#141414] hover:bg-[#F9F6F0]"
                        >
                          View receipt
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Typing…</span>
              </div>
            )}

            {error && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

            {messages.length === 1 && !isThinking && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => void sendMessage(prompt)}
                    className="px-3 py-1.5 rounded-full border border-[#8A6D1F]/30 bg-white text-[11px] font-semibold text-[#8A6D1F] hover:bg-[#F9F6F0]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 flex items-center gap-2 shrink-0 bg-white">
            <input
              type="text"
              dir="auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apna message likhein… / Type a message…"
              maxLength={1000}
              className="flex-1 min-w-0 bg-[#F7F3EC]/60 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#8A6D1F]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="w-10 h-10 shrink-0 rounded-full bg-[#141414] text-white flex items-center justify-center disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {receiptOrder && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4" onClick={() => setReceiptOrder(null)}>
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-3" onClick={(e) => e.stopPropagation()}>
            <OrderReceipt order={receiptOrder} />
            <div className="flex gap-2">
              <button
                onClick={printReceipt}
                className="flex-1 py-2.5 rounded-full bg-white text-[#141414] text-xs font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#8A6D1F]" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setReceiptOrder(null)}
                className="flex-1 py-2.5 rounded-full bg-[#141414] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
