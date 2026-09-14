import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // 1. LADIES - STITCHED PRET & PUNJABI SUITS
  // ==========================================
  {
    id: 'tb-ladies-stitched-01',
    name: 'Festive Stitched 3-Piece Organza & Lawn Suit - Ruby Crimson',
    slug: 'festive-stitched-3-piece-organza-lawn-suit-ruby-crimson',
    tagline: 'Embroidered neckline with scalloped organza dupatta & straight cigarette pants',
    category: 'clothing',
    gender: 'ladies',
    stitchType: 'stitched',
    suitPieces: '3-piece',
    fabric: 'Premium 80/80 Lawn with Sheer Organza Dupatta',
    price: 4950,
    originalPrice: 6500,
    discountPercentage: 24,
    images: [
      'https://images.unsplash.com/photo-1733470324488-d0e10d014d80?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1707576618343-26a1b377ca7a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1721324807072-784ab8ddf166?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Our showstopping festive pret collection. Features heavy thread embroidery on the neckline, lace detailing on chalks and daman, paired with dyed cambric straight pants and an ethereal gold-foiled organza dupatta. Tailored with neat overlocking for wedding dinners and Eid gatherings.',
    details: [
      'Includes: 3-Piece Stitched (Shirt + Dupatta + Pants)',
      'Shirt: 80/80 Fine Lawn with Resham & Tilla embroidery',
      'Dupatta: 2.5m Organza with scalloped borders',
      'Trousers: Tailored straight-cut dyed cambric cotton',
      'Shirt Length: 40 inches (Calf length)',
      'Stitching: Master boutique cut with inner slip lining'
    ],
    fabricCare: [
      'Dry clean recommended or gentle hand wash in cold water',
      'Steam iron on reverse side away from tilla embroidery',
      'Do not wring or dry in direct sunlight'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ruby Crimson', hex: '#8B1E2E' },
      { name: 'Teal Peacock', hex: '#005F60' },
      { name: 'Mustard Gold', hex: '#D49B26' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewCount: 58,
    reviews: [
      {
        id: 'rev-l1',
        userName: 'Maham Tariq',
        userCity: 'Lahore (Gulberg)',
        rating: 5,
        date: '2 days ago',
        comment: 'Fitting is perfection! Usually boutique stitched suits need alterations, but this Medium fit me like custom-made. Trax courier reached in 2 days.',
        verified: true
      },
      {
        id: 'rev-l2',
        userName: 'Sania Zehra',
        userCity: 'Karachi (Clifton)',
        rating: 5,
        date: '5 days ago',
        comment: 'The organza dupatta is super soft, doesn’t slip off the head. Super happy with the COD service.',
        verified: true
      }
    ]
  },
  {
    id: 'tb-ladies-stitched-02',
    name: 'Traditional Punjabi Phulkari Embroidered Kurti & Salwar - Mustard Gold',
    slug: 'traditional-punjabi-phulkari-kurti-salwar-mustard-gold',
    tagline: 'Hand-inspired geometric Phulkari floral embroidery on cotton silk with patiala pleats',
    category: 'clothing',
    gender: 'ladies',
    stitchType: 'stitched',
    suitPieces: '2-piece',
    fabric: 'Cotton Silk Blend with Heavy Resham Needlework',
    price: 3850,
    originalPrice: 4800,
    discountPercentage: 20,
    images: [
      'https://images.unsplash.com/photo-1707576618343-26a1b377ca7a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1733470324488-d0e10d014d80?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Celebrating authentic Punjabi heritage. Features vibrant multi-color Phulkari thread embroidery across the chest and sleeves, paired with a comfortable pleated Punjabi salwar. Soft on the skin and effortless for dholki nights, university culture days, or family brunches.',
    details: [
      'Includes: 2-Piece Stitched (Kurti + Punjabi Salwar)',
      'Fabric: Breathable cotton silk blend with silk thread work',
      'Salwar: Full pleats Punjabi style with elasticated waist & drawstring',
      'Neckline: Round with delicate tassel placket',
      'Shirt Length: 38 inches'
    ],
    fabricCare: [
      'Hand wash separately with mild detergent',
      'Iron on medium heat'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Mustard Gold', hex: '#E5A93C' },
      { name: 'Rani Pink', hex: '#D63384' },
      { name: 'Ferozi Blue', hex: '#0DCAF0' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: false,
    inStock: true,
    stockCount: 9,
    rating: 4.8,
    reviewCount: 36
  },
  {
    id: 'tb-ladies-stitched-03',
    name: 'Chikankari Embroidered 2-Piece Lawn Pret - Butter Ivory',
    slug: 'chikankari-embroidered-2-piece-lawn-pret-butter-ivory',
    tagline: 'All-over shadow work chikan embroidery with straight matching culottes',
    category: 'clothing',
    gender: 'ladies',
    stitchType: 'stitched',
    suitPieces: '2-piece',
    fabric: '100% Breathable Lawn with Cotton Thread Insets',
    price: 3450,
    originalPrice: 4500,
    discountPercentage: 23,
    images: [
      'https://images.unsplash.com/photo-1721324807072-784ab8ddf166?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1733731402869-57e0cce24aea?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'A timeless Pakistani summer essential. Pure breathable lawn shirt embellished with detailed Lucknowi Chikankari floral motifs across the front and bell sleeves. Comes with dyed matching lawn culottes with lace inserts.',
    details: [
      'Includes: 2-Piece Stitched (Chikan Shirt + Culottes)',
      'Fabric: 100% Combed Summer Lawn',
      'Trousers: Wide-leg culottes with embroidered border',
      'Shirt Length: 39 inches'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Butter Ivory', hex: '#FDFBF7' },
      { name: 'Mint Sage', hex: '#C2D8C6' },
      { name: 'Powder Lilac', hex: '#D8CBE5' }
    ],
    isTrending: true,
    isBestSeller: false,
    isNewDrop: true,
    inStock: true,
    stockCount: 11,
    rating: 4.9,
    reviewCount: 29
  },

  // ==========================================
  // 2. LADIES - UNSTITCHED FABRIC & 3-PIECE SUITS
  // ==========================================
  {
    id: 'tb-ladies-unstitched-01',
    name: 'Luxury 3-Piece Unstitched Swiss Lawn with Pure Silk Dupatta - Emerald Flora',
    slug: 'luxury-3-piece-unstitched-swiss-lawn-silk-dupatta-emerald-flora',
    tagline: 'Heavy embroidered schiffli neckline, digital silk dupatta & dyed trousers (Stitching Available!)',
    category: 'clothing',
    gender: 'ladies',
    stitchType: 'unstitched',
    suitPieces: '3-piece',
    fabric: 'Swiss Voile Lawn with Medium Silk Dupatta',
    customStitchingAvailable: true,
    stitchingPrice: 1450,
    price: 3850,
    originalPrice: 5200,
    discountPercentage: 26,
    images: [
      'https://images.unsplash.com/photo-1705920824583-0e783235394d?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1733470324488-d0e10d014d80?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1704119142483-1269733bcedb?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Boutique-grade unstitched 3-piece suit for those who love custom tailored Pakistani cuts. Includes 3.25 meters of premium Swiss Lawn shirt fabric with embroidered front & organza embroidered patch, 2.5m pure digital silk dupatta, and 2.5m dyed cotton trousers. Choose "Stitch For Me" to have our Lahore master darzi tailor it to your exact size!',
    details: [
      'Shirt: 3.25m Embroidered Swiss Voile Lawn (Front + Back + Sleeves)',
      'Neckline: Heavy Resham & Sequin Organza Embroidered Patch',
      'Dupatta: 2.5m Digital Printed Pure Medium Silk',
      'Trousers: 2.5m Dyed Cambric Cotton',
      'Custom Stitching Option: Available (+Rs. 1,450 for bespoke tailoring)'
    ],
    fabricCare: [
      'Soak in lukewarm water before stitching',
      'Iron on medium heat'
    ],
    sizes: ['Free Size (Unstitched 3-Piece)'],
    colors: [
      { name: 'Emerald Flora', hex: '#1C3E2D' },
      { name: 'Sapphire Navy', hex: '#1E3A8A' },
      { name: 'Rosewood Blush', hex: '#9C4153' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 18,
    rating: 5.0,
    reviewCount: 47,
    reviews: [
      {
        id: 'rev-u1',
        userName: 'Zainab Bilal',
        userCity: 'Islamabad (F-10)',
        rating: 5,
        date: '1 week ago',
        comment: 'The silk dupatta quality is gorgeous! Sourced fabric feels exactly like designer lawn from Elan or Sapphire. Got it with the custom stitching option and it fits splendidly.',
        verified: true
      }
    ]
  },
  {
    id: 'tb-ladies-unstitched-02',
    name: 'Festive Unstitched Chiffon Embroidered Suit with Zari Border - Royal Plum',
    slug: 'festive-unstitched-chiffon-embroidered-suit-zari-border-royal-plum',
    tagline: 'Formal Pakistani wedding wear with tilla zari embroidery, inner lining & raw silk trousers',
    category: 'clothing',
    gender: 'ladies',
    stitchType: 'unstitched',
    suitPieces: '3-piece',
    fabric: 'Pure Crinkle Chiffon with Zari & Kora Dabka Work',
    customStitchingAvailable: true,
    stitchingPrice: 1850,
    price: 5450,
    originalPrice: 7500,
    discountPercentage: 27,
    images: [
      'https://images.unsplash.com/photo-1707576618343-26a1b377ca7a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1705920824583-0e783235394d?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Turn heads at wedding dawats. Intricately embellished unstitched pure crinkle chiffon 3-piece suit featuring zari, sequence, and resham needlework. Includes dyed slip lining, embroidered sleeves, and raw silk trousers fabric.',
    details: [
      'Shirt: 3.5m Heavy Embroidered Crinkle Chiffon Front & Back',
      'Dupatta: 2.5m Embroidered Chiffon with 4-side Zari lace',
      'Trouser: 2.5m Dyed Raw Silk Fabric',
      'Slip: 2.5m Dyed Grip Silk Inner Lining included'
    ],
    sizes: ['Free Size (Unstitched 3-Piece)'],
    colors: [
      { name: 'Royal Plum', hex: '#4A154B' },
      { name: 'Champagne Gold', hex: '#D6C096' },
      { name: 'Midnight Navy', hex: '#0F172A' }
    ],
    isTrending: false,
    isBestSeller: true,
    isNewDrop: false,
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 22
  },

  // ==========================================
  // 3. MEN'S - STITCHED KURTA & SHALWAR KAMEEZ
  // ==========================================
  {
    id: 'tb-mens-stitched-01',
    name: "Men's Classic Punjabi Cotton Kurta Pajama - Jet Black",
    slug: 'mens-classic-punjabi-cotton-kurta-pajama-jet-black',
    tagline: '100% Breathable cotton with delicate thread placket embroidery & side pockets',
    category: 'clothing',
    gender: 'mens',
    stitchType: 'stitched',
    suitPieces: '2-piece',
    fabric: '100% Combed Slub Cotton (Summer Weight)',
    price: 2950,
    originalPrice: 3800,
    discountPercentage: 22,
    images: [
      'https://images.unsplash.com/photo-1744551358303-46edae8b374b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1723051963745-d10d43248655?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1701365676249-9d7ab5022dec?w=900&auto=format&fit=crop&q=80'
    ],
    description: "The quintessential Pakistani men's wardrobe staple. Tailored from premium 100% combed cotton with a crisp band collar, minimalist tonal thread embroidery along the button placket, two deep side utility pockets, and straight white cotton pajama trousers.",
    details: [
      'Includes: 2-Piece Stitched (Kurta + White Straight Pajama)',
      'Fabric: 100% Fine Combed Cotton with slub texture',
      'Collar: Stiffened Mandarin band collar with wooden accent buttons',
      'Cuffs: Traditional open straight sleeves',
      'Pockets: 2 functional side pockets',
      'Pajama: Straight cut cotton pajama with drawstring & elastic'
    ],
    fabricCare: [
      'Machine wash gentle cycle with similar darks',
      'Medium iron while slightly damp for best crease'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Jet Black', hex: '#111111' },
      { name: 'Pristine White', hex: '#FDFDFD' },
      { name: 'Charcoal Slate', hex: '#334155' },
      { name: 'Olive Green', hex: '#37412A' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 16,
    rating: 4.9,
    reviewCount: 45,
    reviews: [
      {
        id: 'rev-m1',
        userName: 'Usman Ali',
        userCity: 'Faisalabad',
        rating: 5,
        date: '4 days ago',
        comment: 'Cotton feel is premium, doesn’t crease easily. Collar sits crisp and stiff like proper tailor stitching. Perfect for Jummah and Eid.',
        verified: true
      }
    ]
  },
  {
    id: 'tb-mens-stitched-02',
    name: "Men's Premium Stitched Wash & Wear Shalwar Kameez - Charcoal Grey",
    slug: 'mens-premium-stitched-wash-and-wear-shalwar-kameez-charcoal-grey',
    tagline: 'Wrinkle-resistant poly-viscose blend with stitched shirt collar & full cuffs',
    category: 'clothing',
    gender: 'mens',
    stitchType: 'stitched',
    suitPieces: '2-piece',
    fabric: 'Heavyweight Wrinkle-Resistant Wash & Wear (Four Season)',
    price: 3450,
    originalPrice: 4400,
    discountPercentage: 21,
    images: [
      'https://images.unsplash.com/photo-1727835523545-70ee992b5763?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1701365676249-9d7ab5022dec?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Crafted for the modern Pakistani gentleman. Heavyweight, fluid wash & wear fabric that resists wrinkles all day long. Features a sharp shirt collar, cuffed sleeves with metallic snap buttons, matching traditional shalwar, and double-stitched durability.',
    details: [
      'Includes: 2-Piece Stitched (Kameez + Shalwar)',
      'Fabric: Premium Fall Poly-Viscose Wash & Wear',
      'Sleeves: French-inspired single button cuffs',
      'Collar: Pointed shirt collar with front chest pocket',
      'Shalwar: Traditional comfortable Pakistani cut with drawstring'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal Grey', hex: '#4B5563' },
      { name: 'Royal Navy', hex: '#1E293B' },
      { name: 'Warm Cream', hex: '#E2D9C8' }
    ],
    isTrending: false,
    isBestSeller: true,
    isNewDrop: false,
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewCount: 31
  },

  // ==========================================
  // 4. MEN'S - UNSTITCHED FABRIC (BOSKI & LATHA)
  // ==========================================
  {
    id: 'tb-mens-unstitched-01',
    name: "Men's Unstitched Royal Boski Silk Fabric (4.5 Meters) - Natural Ivory",
    slug: 'mens-unstitched-royal-boski-silk-fabric-natural-ivory',
    tagline: 'Authentic 6-Pound Boski silk blend with fluid drape, soft luster & original brand box',
    category: 'clothing',
    gender: 'mens',
    stitchType: 'unstitched',
    suitPieces: 'fabric-meters',
    fabric: 'Authentic Spun Silk Boski Blend (6-Pound Grade)',
    customStitchingAvailable: true,
    stitchingPrice: 1250,
    price: 3950,
    originalPrice: 5500,
    discountPercentage: 28,
    images: [
      'https://images.unsplash.com/photo-1606259457945-67dc66271ee6?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1705920824583-0e783235394d?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'The golden standard of Pakistani ethnic luxury. 4.5 meters of original-feel Royal Boski silk blend with an unmatched buttery soft texture and natural liquid fall. Ships in an embossed Trendy Bazaar presentation box with branded buttons and woven collar tag — ideal for personal wear or premium gifting.',
    details: [
      'Cut: 4.5 Meters Standard Suit Length (54 inches width / BARR)',
      'Weight: 6-Pound heavy luxury fall grade',
      'Accessories: Includes 8 metal horn buttons & brand woven tags',
      'Packaging: Hardboard Gold Embossed Gift Box included',
      'Custom Tailoring: Available on request (+Rs. 1,250)'
    ],
    sizes: ['4.5 Meters (Full Suit Fabric)'],
    colors: [
      { name: 'Natural Ivory', hex: '#F9F6EE' },
      { name: 'Pearl Cream', hex: '#EFE8D8' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 15,
    rating: 5.0,
    reviewCount: 39,
    reviews: [
      {
        id: 'rev-b1',
        userName: 'Chaudhry Bilal',
        userCity: 'Gujranwala',
        rating: 5,
        date: '3 days ago',
        comment: 'Pure Punjab vibe! The fall of this Boski is exceptionally rich. My tailor praised the thread density. Ordered another 2 boxes for gifting.',
        verified: true
      }
    ]
  },
  {
    id: 'tb-mens-unstitched-02',
    name: "Men's Egyptian Giza Unstitched Cotton Latha (4.5 Meters) - Pure Snow White",
    slug: 'mens-egyptian-giza-unstitched-cotton-latha-pure-snow-white',
    tagline: '100% Long-staple Egyptian cotton with crisp starched finish & silky smooth touch',
    category: 'clothing',
    gender: 'mens',
    stitchType: 'unstitched',
    suitPieces: 'fabric-meters',
    fabric: '100% Egyptian Giza Long-Staple Cotton',
    customStitchingAvailable: true,
    stitchingPrice: 1250,
    price: 2850,
    originalPrice: 3800,
    discountPercentage: 25,
    images: [
      'https://images.unsplash.com/photo-1594734415578-00fc9540929b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606259457945-67dc66271ee6?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Traditional Pakistani Cotton Latha at its finest. Spun from 100% long-staple combed cotton yarn with a crisp, breathable texture that feels cool in peak summer. Holds its stiff, authoritative press through all-day events and prayers.',
    details: [
      'Cut: 4.5 Meters (Generous cut for tall heights up to 6ft 3in)',
      'Finish: Crisp medium-stiff traditional Pakistani Latha feel',
      'Includes: High-grade heat-resistant buttons & sew-in brand tags'
    ],
    sizes: ['4.5 Meters (Full Suit Fabric)'],
    colors: [
      { name: 'Pure Snow White', hex: '#FFFFFF' },
      { name: 'Off-White Milk', hex: '#FAF9F6' }
    ],
    isTrending: false,
    isBestSeller: true,
    isNewDrop: false,
    inStock: true,
    stockCount: 20,
    rating: 4.8,
    reviewCount: 27
  },

  // ==========================================
  // 5. KIDS PAKISTANI PUNJABI STITCHED SUITS
  // ==========================================
  {
    id: 'tb-kids-girls-01',
    name: "Girls Stitched Punjabi Peplum Kurti & Flared Gharara Set - Rani Pink & Gold",
    slug: 'girls-stitched-punjabi-peplum-kurti-flared-gharara-set-rani-pink-gold',
    tagline: 'Festive gota kinari lace borders, net dupatta & soft cotton inner lining (Ages 3 to 12 Years)',
    category: 'clothing',
    gender: 'kids',
    stitchType: 'stitched',
    suitPieces: '3-piece',
    fabric: 'Cotton Silk Peplum with Flared Net Gharara & Cotton Lining',
    price: 2850,
    originalPrice: 3600,
    discountPercentage: 20,
    images: [
      'https://images.unsplash.com/photo-1639563853019-779fb4e41844?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597294151491-1d22b38698d6?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Make your little princess shine at weddings and festive events. A gorgeous stitched 3-piece traditional Punjabi outfit featuring a fitted peplum top with gota patti work, a voluminous two-tier flared gharara, and a matching lightweight net dupatta. Non-itchy cotton inner lining ensures your child stays comfortable all day.',
    details: [
      'Includes: 3-Piece Stitched (Peplum Top + Gharara + Net Dupatta)',
      'Embellishment: Golden Gota Kinari detailing on neckline & ghera',
      'Lining: 100% Soft breathable lawn cotton inner lining (no itching!)',
      'Waist: Elasticated stretch waistband for easy movement'
    ],
    sizes: ['3-4 Yrs', '5-6 Yrs', '7-8 Yrs', '9-10 Yrs', '11-12 Yrs'],
    colors: [
      { name: 'Rani Pink & Gold', hex: '#E83E8C' },
      { name: 'Festive Mustard', hex: '#E5A93C' },
      { name: 'Emerald Green', hex: '#198754' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewCount: 33,
    reviews: [
      {
        id: 'rev-k1',
        userName: 'Farah Naveed',
        userCity: 'Rawalpindi',
        rating: 5,
        date: '5 days ago',
        comment: 'My 6-year-old wore this to her khala’s dholki and everyone asked where we got it from! Lining is very soft, she didn’t complain once about itchiness.',
        verified: true
      }
    ]
  },
  {
    id: 'tb-kids-boys-01',
    name: "Boys Stitched Punjabi Kurta Shalwar with Embroidered Waistcoat Set - Royal Blue",
    slug: 'boys-stitched-punjabi-kurta-shalwar-embroidered-waistcoat-set-royal-blue',
    tagline: '3-Piece formal Pakistani set: pure cotton kurta shalwar + raw silk waistcoat (Ages 2 to 12 Years)',
    category: 'clothing',
    gender: 'kids',
    stitchType: 'stitched',
    suitPieces: '3-piece',
    fabric: 'Soft Cotton Kurta Shalwar with Jamawar/Silk Waistcoat',
    price: 3150,
    originalPrice: 4200,
    discountPercentage: 25,
    images: [
      'https://images.unsplash.com/photo-1774437676511-ea3b86c8e988?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1768518354624-98338b3ea30f?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Dress your young prince in dignified Pakistani style! Stitched 3-piece set comprising an ivory soft cotton kurta shalwar paired with a rich royal blue embroidered raw silk waistcoat featuring metal antique buttons and chest pocket.',
    details: [
      'Includes: 3-Piece Stitched (Kurta + Shalwar + Waistcoat)',
      'Kurta & Shalwar: 100% Breathable Combed Cotton in Off-White',
      'Waistcoat: Textured Silk with Gold Tilla Motif & Metal Crest Buttons',
      'Fit: Relaxed child-friendly tailored fit with room to play'
    ],
    sizes: ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs'],
    colors: [
      { name: 'Royal Blue Waistcoat', hex: '#1E3A8A' },
      { name: 'Maroon Velvet Waistcoat', hex: '#800000' },
      { name: 'Black Jacquard Waistcoat', hex: '#111827' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewCount: 28
  },
  {
    id: 'tb-kids-girls-02',
    name: "Girls Stitched Floral Lawn Anarkali Frock with Churidar - Pastel Peach",
    slug: 'girls-stitched-floral-lawn-anarkali-frock-churidar-pastel-peach',
    tagline: 'Lightweight summer party frock with lace yoke & matching stretch churidar',
    category: 'clothing',
    gender: 'kids',
    stitchType: 'stitched',
    suitPieces: '2-piece',
    fabric: '100% Fine Digital Printed Lawn',
    price: 2450,
    originalPrice: 3200,
    discountPercentage: 23,
    images: [
      'https://images.unsplash.com/photo-1597294150753-b6e790b68d1c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1639563853019-779fb4e41844?w=900&auto=format&fit=crop&q=80'
    ],
    description: 'Delightful summer pret for young girls. Tailored from soft breathable printed lawn with an Anarkali flare, crochet lace bordering, and comfortable stretch jersey churidar pants.',
    details: [
      'Includes: 2-Piece Stitched (Anarkali Frock + Churidar)',
      'Fabric: 100% Pure Lawn Cotton',
      'Comfort: Pre-washed, zero color bleeding guaranteed'
    ],
    sizes: ['3-4 Yrs', '5-6 Yrs', '7-8 Yrs', '9-10 Yrs'],
    colors: [
      { name: 'Pastel Peach', hex: '#FFDAB9' },
      { name: 'Sky Cyan', hex: '#A5F3FC' }
    ],
    isTrending: false,
    isBestSeller: false,
    isNewDrop: true,
    inStock: true,
    stockCount: 10,
    rating: 4.9,
    reviewCount: 19
  },

  // ==========================================
  // 6. CASUAL STREETWEAR & WESTERN COORDS
  // ==========================================
  {
    id: 'tb-cloth-streetwear',
    name: 'Oversized Streetwear Boxy Tee - Jet Black',
    slug: 'oversized-streetwear-boxy-tee-jet-black',
    tagline: 'Heavyweight 240 GSM combed cotton with drop-shoulder fit',
    category: 'clothing',
    gender: 'unisex',
    stitchType: 'stitched',
    fabric: '100% Combed Heavy Cotton (240 GSM)',
    price: 1850,
    originalPrice: 2400,
    discountPercentage: 23,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The viral oversized streetwear tee our TikTok fam cannot stop ordering! Made from 240 GSM breathable combed cotton that holds its structure wash after wash without shrinking.',
    details: [
      'Fabric: 100% Combed Heavy Cotton (240 GSM)',
      'Fit: Relaxed, boxy drop shoulder cut',
      'Collar: Ribbed high neck crew that doesn’t sag'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Jet Black', hex: '#1A1A1A' },
      { name: 'Oatmeal Heather', hex: '#D7D2C8' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: false,
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 42
  },

  // ==========================================
  // 7. JEWELLERY & ACCESSORIES
  // ==========================================
  {
    id: 'tb-acc-01',
    name: '18K Anti-Tarnish Gold Plated Croissant Ring',
    slug: 'anti-tarnish-18k-gold-croissant-ring',
    tagline: 'Waterproof & sweatproof stainless steel jewelry that never tarnishes',
    category: 'accessories',
    gender: 'ladies',
    price: 1250,
    originalPrice: 1800,
    discountPercentage: 30,
    images: [
      'https://images.unsplash.com/photo-1655707063513-a08dad26440e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611598935678-c88dca238fce?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The statement ring you never have to take off. Coated with real 18K gold via PVD vacuum plating over surgical stainless steel. Wear it while washing hands, cooking, or showering with zero green marks on your fingers.',
    details: [
      'Base: 316L Surgical Stainless Steel',
      'Plating: PVD 18K Real Gold Coating (Tarnish Resistant)',
      'Features: Hypoallergenic, nickel-free & water-safe',
      'Sizes: Adjustable open back fit (sizes 5-9 comfortably)'
    ],
    sizes: ['Adjustable (Sizes 5-9)'],
    colors: [{ name: 'Warm Gold', hex: '#D4AF37' }],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: false,
    inStock: true,
    stockCount: 22,
    rating: 5.0,
    reviewCount: 64
  },
  {
    id: 'tb-acc-02',
    name: 'Chic Crescent Vegan Leather Shoulder Bag - Warm Caramel',
    slug: 'chic-crescent-vegan-leather-shoulder-bag-warm-caramel',
    tagline: 'Aesthetic everyday baguette bag with smooth gold hardware & zipper closure',
    category: 'accessories',
    gender: 'ladies',
    price: 2450,
    originalPrice: 3200,
    discountPercentage: 23,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The minimalist aesthetic shoulder bag trending all over your Instagram explore page. Crafted from supple scratch-resistant vegan leather with a rounded crescent profile. Fits your iPhone Pro Max, card holder, lip tint, perfume, and keys effortlessly.',
    details: [
      'Material: Scratch-resistant pebbled Vegan PU Leather',
      'Hardware: Anti-tarnish brushed gold zip & buckle',
      'Dimensions: 25cm (W) x 15cm (H) x 7cm (D)',
      'Strap Drop: 24cm (Snug comfortable shoulder drop)'
    ],
    colors: [
      { name: 'Warm Caramel', hex: '#8B5A2B' },
      { name: 'Noir Black', hex: '#111111' },
      { name: 'Cloud Cream', hex: '#FFFDD0' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: false,
    inStock: true,
    stockCount: 6,
    rating: 4.8,
    reviewCount: 38
  },

  // ==========================================
  // 8. GIFTING & LIFESTYLE
  // ==========================================
  {
    id: 'tb-gift-01',
    name: 'Luxury Velvet Keepsake Gift Box - Vanilla Oud & Chai Spice',
    slug: 'luxury-velvet-keepsake-gift-box-vanilla-oud-chai-spice',
    tagline: 'Hand-poured soy candle, match bottle, gold wick trimmer & handwritten card',
    category: 'gifting',
    gender: 'unisex',
    price: 2850,
    originalPrice: 3600,
    discountPercentage: 20,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The ultimate care package curated for birthdays, anniversaries, Eid, or bride-to-be gifts. Presented in a premium magnetic-closure emerald velvet box tied with satin ribbon. We can handwrite your custom Urdu or English note on our textured calligraphy card for free!',
    details: [
      'Box: Rigid reusable magnetic emerald velvet hamper',
      'Candle: 200g 100% natural soy wax (Vanilla Oud aroma, 45hr burn)',
      'Accessories: Glass bottle matches + gold plated metal trimmer',
      'Free Service: Handwritten note on gold foil card'
    ],
    isTrending: false,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 14,
    rating: 5.0,
    reviewCount: 51
  }
];
