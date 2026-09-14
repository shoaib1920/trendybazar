import { SocialPost, ProductReview } from '../types';

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp-1',
    platform: 'instagram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1733470381591-c5dfb9df3c3d?w=600&auto=format&fit=crop&q=80',
    caption: 'Unboxing the Ribbed Co-ord Set + Gold Croissant Ring ✨ Delivered to Islamabad in 48 hours!',
    likes: '4.8k',
    comments: '219',
    views: '58.2k',
    taggedProductSlug: 'ribbed-knit-co-ord-loungewear-set'
  },
  {
    id: 'sp-2',
    platform: 'tiktok',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    caption: 'The ONLY heavyweight oversized tee you need this season in Pakistan 🔥 240 GSM test!',
    likes: '12.4k',
    comments: '482',
    views: '142k',
    taggedProductSlug: 'oversized-streetwear-boxy-tee-jet-black'
  },
  {
    id: 'sp-3',
    platform: 'instagram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
    caption: 'What fits inside the Crescent Shoulder Bag 🥐✨ Perfect for everyday uni or cafe hopping',
    likes: '6.1k',
    comments: '184',
    views: '79k',
    taggedProductSlug: 'vegan-leather-crescent-moon-shoulder-bag'
  },
  {
    id: 'sp-4',
    platform: 'tiktok',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    caption: 'Testing our Lahore Motia & Oud candle crackle wick! Room smells like a 5-star hotel 🕯️',
    likes: '8.9k',
    comments: '310',
    views: '94.5k',
    taggedProductSlug: 'aesthetic-scented-soy-candle-jasmine-oud'
  },
  {
    id: 'sp-5',
    platform: 'instagram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1655707063513-a08dad26440e?w=600&auto=format&fit=crop&q=80',
    caption: 'Water test on our anti-tarnish 18K gold rings. 3 months of daily wear without tarnishing 💫',
    likes: '9.3k',
    comments: '402',
    views: '115k',
    taggedProductSlug: 'anti-tarnish-18k-gold-croissant-ring'
  },
  {
    id: 'sp-6',
    platform: 'tiktok',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    caption: 'Packaging a surprise birthday gift box heading to Clifton, Karachi! Handwritten notes always included 💌',
    likes: '14.2k',
    comments: '530',
    views: '180k',
    taggedProductSlug: 'ultimate-self-care-glow-gift-box'
  }
];

export const STORE_REVIEWS: ProductReview[] = [
  {
    id: 'sr-1',
    userName: 'Fatima Noor',
    userCity: 'Karachi (Gulshan)',
    rating: 5,
    date: 'Yesterday',
    comment: 'Honestly, I was skeptical about ordering clothes from an Instagram ad, but Trendy Bazaar is 100% legit. The kurti fabric is pure slub silk and the COD delivery was super fast (3 days). Subscribed to their WhatsApp group!',
    verified: true
  },
  {
    id: 'sr-2',
    userName: 'Bilal Ahmed',
    userCity: 'Lahore (DHA Ph 5)',
    rating: 5,
    date: '3 days ago',
    comment: 'I ordered the oversized streetwear tee and the sunset lamp. Used coupon TREND10 and saved Rs. 380! The tee is thick 240 GSM, no color bleeding after first wash. Will definitely reorder.',
    verified: true
  },
  {
    id: 'sr-3',
    userName: 'Hira Siddiqui',
    userCity: 'Islamabad (F-10)',
    rating: 5,
    date: '5 days ago',
    comment: 'Ordered via WhatsApp because I had questions about the ring sizes. The team was so polite, replied in 2 minutes, and sent audio notes with measurement guide. Best customer service in Pakistan!',
    verified: true
  },
  {
    id: 'sr-4',
    userName: 'Usman Rauf',
    userCity: 'Faisalabad',
    rating: 5,
    date: '1 week ago',
    comment: 'Sent the Self Care gift box to my sister on her graduation in Rawalpindi. The handwritten Urdu/English calligraphy note inside was such a beautiful touch. She was thrilled!',
    verified: true
  },
  {
    id: 'sr-5',
    userName: 'Areeba Kashif',
    userCity: 'Peshawar',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Jewelry is genuinely anti-tarnish! I have been wearing the croissant ring in dishwashing and shower for 2 weeks, still shiny gold. 100% recommended to all my hostel friends.',
    verified: true
  }
];
