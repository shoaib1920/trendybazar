import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
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
  const { brandWhatsAppNumber, openWhatsAppGeneral, showToast } = useShop();

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
      q: 'How long does delivery take across Pakistan?',
      a: 'We ship through Trax Logistics, Leopards Courier, and PostEx. Delivery to major cities like Lahore, Karachi, and Islamabad takes 2 to 3 working days. Other nationwide cities take 3 to 4 working days.'
    },
    {
      q: 'What are the delivery charges?',
      a: 'We charge a standard flat rate of Rs. 199 across Pakistan. Any order of Rs. 3,500 or more qualifies for 100% FREE delivery automatically at checkout!'
    },
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'With COD, you place your order without entering any credit card. We pack and dispatch your parcel, and you simply hand the cash amount to the courier delivery rider at your doorstep.'
    },
    {
      q: 'What is your 7-Day Exchange Policy?',
      a: 'If your apparel size doesn’t fit or you wish to exchange an unused item, send a WhatsApp message to +92 336 4300592 within 7 days of delivery. We will arrange a replacement parcel dispatched right to you.'
    },
    {
      q: 'Can I order directly on WhatsApp without using the website?',
      a: 'Yes! Over 60% of our orders come via WhatsApp. Simply click the "Order on WhatsApp" button on any product or click our floating chat icon. Send us a screenshot or product name with your address and we book your order instantly.'
    },
    {
      q: 'How do I redeem discount code TREND10?',
      a: 'Enter TREND10 in the promo code box in your Cart Drawer or Checkout screen. It gives an instant 10% discount on all orders above Rs. 2,500!'
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
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#1A1A1A]">
          We’re Here to Help
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Need styling advice, size confirmation, order tracking, or custom gift arrangements? Reach out anytime!
        </p>
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
            <p className="text-xs text-gray-600">
              Our team typically replies in <strong>less than 5 minutes</strong> between 10:00 AM – 10:00 PM PKT.
            </p>
          </div>
        </div>

        <button
          onClick={() => openWhatsAppGeneral('Assalam-o-Alaikum Trendy Bazaar! I have a question about an order / products.')}
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
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Available 7 days a week</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-[#F2B705] shrink-0">
              <Mail className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">Email Us</h4>
              <p className="text-xs text-gray-600 mt-0.5">orders@trendybazaar.pk</p>
              <span className="text-[11px] text-gray-400 block mt-1">For brand collabs & PR packages</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-[#F2B705] shrink-0">
              <MapPin className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">Fulfillment Hub</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Block D, Gulberg III, Lahore, Punjab, Pakistan
              </p>
              <span className="text-[11px] text-gray-400 block mt-1">Direct dispatch to 150+ Pakistani cities</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-[#F2B705] shrink-0">
              <Clock className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">Operating Hours</h4>
              <p className="text-xs text-gray-600 mt-0.5">Monday – Sunday: 10:00 AM – 10:00 PM</p>
              <span className="text-[11px] text-gray-400 block mt-1">Online website orders open 24/7</span>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-heading font-black text-xl text-[#1A1A1A] mb-1">
            Send Us a Message
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Fill in the details below and we’ll get back to you promptly.
          </p>

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
                    <option value="Size & Product Advice">Size & Product Advice</option>
                    <option value="7-Day Exchange Request">7-Day Exchange Request</option>
                    <option value="Influencer PR / Collaboration">Influencer PR / Collaboration</option>
                    <option value="Wholesale / Bulk Gifting">Wholesale / Bulk Gifting</option>
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
          <p className="text-xs text-gray-500 mt-1">
            Everything you need to know about shopping at Trendy Bazaar Pakistan
          </p>
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
