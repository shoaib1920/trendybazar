import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { discountLabel } from '../lib/discountsService';
import { 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Phone, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { brandWhatsAppNumber, openWhatsAppGeneral, showToast, featuredDiscount } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    subject: 'Order Status / Inquiry',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'How long does delivery take?',
      a: '2-3 days in major cities, 3-4 days elsewhere in Pakistan.'
    },
    {
      q: 'What are the delivery charges?',
      a: 'Flat Rs. 150 nationwide. Free on orders over Rs. 3,500.'
    },
    {
      q: 'How does Cash on Delivery work?',
      a: 'Pay the courier in cash when your parcel arrives — no card needed.'
    },
    {
      q: 'What if my item arrives faulty?',
      a: 'WhatsApp us within 7 days with a short video and we\'ll replace it.'
    },
    {
      q: 'Can I order on WhatsApp directly?',
      a: 'Yes — tap "Order on WhatsApp" on any product or use the chat icon.'
    },
    {
      q: 'How do I use a discount code?',
      a: `Open your Shopping Bag, type the code in "Discount code" and tap Apply.${
        featuredDiscount ? ` Current offer: ${featuredDiscount.code} for ${discountLabel(featuredDiscount)}.` : ''
      }`
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    showToast('Your message has been sent to our Lahore team!', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16" id="contact-faq-page">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#F7F3EC] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1A1A1A]">
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Support & Inquiries</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#1A1A1A]">
          We're Here to Help
        </h1>
      </div>

      {/* WhatsApp Hero Banner */}
      <div className="bg-[#25D366]/10 border-2 border-[#25D366]/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-lg">
            <MessageCircle className="w-9 h-9 fill-white text-[#25D366]" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Fastest Response Time
            </span>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-[#1A1A1A] mt-1">
              Chat with Us on WhatsApp
            </h3>
          </div>
        </div>

        <button
          onClick={() => openWhatsAppGeneral('Assalam-o-Alaikum Trendy Bazar! I have a question about an order / products.')}
          className="w-full md:w-auto py-3.5 px-8 bg-[#25D366] hover:bg-[#20ba5a] text-white font-heading font-bold text-sm rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
          <span>Start WhatsApp Chat Now</span>
        </button>
      </div>

      {/* Main Grid: Contact Info Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-[#F2B705] shrink-0">
              <Phone className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">Official WhatsApp</h4>
              <p className="text-xs text-gray-600 mt-0.5">{brandWhatsAppNumber}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-[#F2B705] shrink-0">
              <Mail className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">Email Us</h4>
              <p className="text-xs text-gray-600 mt-0.5">orders@trendybazar.pk</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-[#F2B705] shrink-0">
              <MapPin className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">Fulfillment Hub</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Gulberg III, Lahore, Pakistan
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-[#F2B705] shrink-0">
              <Clock className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">Operating Hours</h4>
              <p className="text-xs text-gray-600 mt-0.5">Daily, 10:00 AM – 10:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-heading font-black text-xl text-[#1A1A1A] mb-4">
            Send Us a Message
          </h3>

          {formSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-heading font-bold text-base">Thank you, {formData.name}!</h4>
              <p className="text-xs text-emerald-700">
                Your message regarding "{formData.subject}" has been received. Our team will contact your phone ({formData.phone}) via WhatsApp shortly.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="py-2 px-4 bg-emerald-700 text-white text-xs font-bold rounded-full mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#F2B705] focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">WhatsApp Phone # *</label>
                  <input
                    type="tel"
                    required
                    placeholder="03XX-XXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#F2B705] focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#F2B705] focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Inquiry Topic</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#F2B705] focus:bg-white text-xs cursor-pointer"
                  >
                    <option value="Order Status / Inquiry">Order Status / Delivery Inquiry</option>
                    <option value="Product Advice">Product Advice</option>
                    <option value="7-Day Exchange Request">7-Day Exchange Request</option>
                    <option value="Influencer PR / Collaboration">Influencer PR / Collaboration</option>
                    <option value="Wholesale / Bulk Order">Wholesale / Bulk Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Message / Details *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you need help with..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#F2B705] focus:bg-white text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-heading font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions (Accordion) */}
      <div className="pt-8 border-t border-gray-200 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2B705] mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A]">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-xs sm:text-sm text-[#1A1A1A]"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#F2B705] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {openFaqIndex === idx && (
                <div className="px-4 pb-5 sm:px-5 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
