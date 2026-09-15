import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const FloatingWhatsApp: React.FC = () => {
  const { brandWhatsAppNumber } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const QUICK_PROMPTS = [
    'Assalam-o-Alaikum! I need help choosing the right size.',
    'Is Cash on Delivery available for my city?',
    'I want to place an order directly via WhatsApp!',
    'How do I use the TREND10 discount code?'
  ];

  const handleSendPrompt = (msg: string) => {
    window.open(`https://wa.me/923364300592?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMsg.trim()) {
      handleSendPrompt(customMsg);
      setCustomMsg('');
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end" id="floating-whatsapp-container">
      {/* Interactive Chat Popup */}
      {isOpen && (
        <div 
          className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          id="whatsapp-chat-popup"
        >
          {/* Header */}
          <div className="bg-[#1A1A1A] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#F2B705] flex items-center justify-center text-black font-black text-xs">
                  TB
                </div>
                <span className="w-3 h-3 bg-[#25D366] border-2 border-[#1A1A1A] rounded-full absolute bottom-0 right-0"></span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                  <span>Trandy Libas Support</span>
                </h4>
                <p className="text-[11px] text-[#F2B705] font-medium">Online • Typical reply &lt; 5 mins</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#F7F3EC]/50 space-y-3 text-xs">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-gray-100 max-w-[90%] text-gray-800 leading-relaxed">
              <p className="font-semibold text-[#1A1A1A] mb-1 flex items-center gap-1">
                <span>Assalam-o-Alaikum!</span> 👋
              </p>
              <p className="text-gray-600 text-[11.5px]">
                Welcome to Trandy Libas! We love taking orders on WhatsApp. How can we help you today?
              </p>
              <span className="text-[9px] text-gray-400 block text-right mt-1">Official WhatsApp: {brandWhatsAppNumber}</span>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Quick Questions:</p>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(prompt)}
                  className="w-full text-left bg-white hover:bg-amber-50 text-gray-700 hover:text-[#1A1A1A] p-2 rounded-xl text-[11px] border border-gray-200/80 transition-colors flex items-center justify-between"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <span className="text-xs text-[#25D366] shrink-0 font-bold ml-1">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Input */}
          <form onSubmit={handleCustomSubmit} className="p-2.5 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Type message to chat..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 bg-gray-100 rounded-full px-3.5 py-2 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#25D366]"
            />
            <button
              type="submit"
              className="w-9 h-9 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Trigger Button with Ping Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="floating-whatsapp-trigger"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all hover:scale-105 active:scale-95 z-40"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="hidden sm:inline font-bold text-xs">
          Order on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
        </span>
      </button>
    </div>
  );
};
