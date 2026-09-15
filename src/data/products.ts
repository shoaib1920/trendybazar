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
      'https://images.unsplash.com/photo-1708534246051-7f47b279e94b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1708534419572-6e6614a53ca1?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597983073750-16f5ded1321f?w=900&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1733209590486-4ed0bfcbc52a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1733209587923-77ff33202f7c?w=900&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1733209589780-ece842d0dcf8?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1733209588000-339b73c36575?w=900&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1708534246055-d7b149acb731?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1604436607823-d721dfe2df46?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1747049559461-560c02b192b2?w=900&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1650301856518-7c6fe081d2f2?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1670320747683-853071613c85?w=900&auto=format&fit=crop&q=80'
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
      'https://www.junaidjamshed.com/cdn/shop/files/50603jjkskp_1_e58677b0-94d0-435d-a18a-63a02b36361c.jpg?v=1778584771&width=880',
      'https://i.etsystatic.com/39698029/r/il/4ed395/5742814712/il_fullxfull.5742814712_tgzp.jpg'
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
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUtjzUvxxcY9aZXlNDxzWrVtyPIeI2U5oGeApgTHMxw5ivcHn1JIB5hsY&s=10'
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
      'https://www.dynastyfabrics.com/cdn/shop/files/DARK_GREY_copy_Percentage_3d426700-8cc3-41da-8e88-77df3009aa8e.jpg?v=1787295144&width=1445',
      'https://www.khasstores.com/cdn/shop/files/luxury-wash-wear-unstitched-fabric-mens-shalwar-kameez-mens-unstitched-suit-katanya-729740.jpg?v=1782813123&width=1000'
    ],
    description: 'The golden standard of Pakistani ethnic luxury. 4.5 meters of original-feel Royal Boski silk blend with an unmatched buttery soft texture and natural liquid fall. Ships in an embossed Trandy Libas presentation box with branded buttons and woven collar tag — ideal for personal wear or premium gifting.',
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
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNHKauNoNWJ2_DfXVeKCgi-gqnV8nsoEdE-Og4zDj__w&s=10',
      'https://sapphire-online.com/dw/image/v2/BKSB_PRD/on/demandware.static/-/Sites-sapphire-master-catalog/default/dw76b0ee03/images/April26/24thApril26/US2P26CTV325_2.jpg?sw=1000&sh=1200'
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
      'https://images.unsplash.com/photo-1654363761792-5a9e1a562104?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1787733998047-9246d7c26aca?w=900&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1685218519480-0407f4546347?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1739650376417-6bd9041c6ed4?w=900&auto=format&fit=crop&q=80'
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
      'https://images.unsplash.com/photo-1651779470878-2a857735e97a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1654363761829-7c9482cb5725?w=900&auto=format&fit=crop&q=80'
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
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNQymJdrM9t_5WqKcUnisdV6jhBYDEyV3O9YfXq2pZaA&s=10',
      'https://www.paperplanestore.com/cdn/shop/files/Kowtow-OversizedBoxyTee-Black-3_2048x2048@2x.jpg?v=1751492214'
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
    subCategory: 'jewelry',
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
    subCategory: 'bags',
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
  },

  // ==========================================
  // 9. MEN'S COMPLETE OUTFIT - WAISTCOAT SETS
  // ==========================================
  {
    id: 'tb-mens-stitched-03',
    name: "Men's Embroidered Velvet Nehru Waistcoat & Kurta Shalwar - Complete Outfit",
    slug: 'mens-embroidered-velvet-nehru-waistcoat-kurta-shalwar-complete-outfit',
    tagline: 'Head-to-toe festive look: hand-embroidered waistcoat, kurta & shalwar in one box',
    category: 'clothing',
    gender: 'mens',
    stitchType: 'stitched',
    suitPieces: '3-piece',
    fabric: 'Velvet Waistcoat over Premium Cotton Kurta & Shalwar',
    price: 5200,
    originalPrice: 6800,
    discountPercentage: 24,
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI1bofn-ECso0t66OyA9IHsQO5YY-4nDepFsmbDrQWrAVXw8iBHe6-HG4a&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXQob2zPUmjCMVokS89PSc6JficQhsAPg_gnYsmqrI3gbPBK0PZh-1onZ9&s=10'
    ],
    description: "The complete festive edit, styled and boxed together so you don't have to piece together separates. A hand-embroidered mandarin-collar velvet waistcoat layers over a breathable cotton kurta with matching straight-cut shalwar — the same silhouette worn for Eid, walima and Nikkah functions across Lahore's finest tailoring houses.",
    details: [
      'Includes: 3-Piece Stitched Set (Waistcoat + Kurta + Shalwar)',
      'Waistcoat: Structured velvet with hand-worked thread embroidery on the front panel',
      'Collar: Stiffened Mandarin band collar with metal-accent buttons',
      'Kurta: Breathable premium cotton with front chest pocket',
      'Shalwar: Traditional Pakistani cut with drawstring waist'
    ],
    fabricCare: [
      'Dry clean the velvet waistcoat only',
      'Machine wash the kurta & shalwar gentle cycle, separately'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Maroon Velvet', hex: '#5C1A24' },
      { name: 'Grey Diamond Weave', hex: '#8A8A8E' },
      { name: 'Navy Nehru Blue', hex: '#1B2A4A' }
    ],
    isTrending: true,
    isBestSeller: true,
    isNewDrop: true,
    inStock: true,
    stockCount: 18,
    rating: 4.9,
    reviewCount: 27,
    reviews: [
      {
        id: 'rev-wc1',
        userName: 'Hamza Tariq',
        userCity: 'Lahore',
        rating: 5,
        date: '6 days ago',
        comment: 'Wore this to my cousin\'s walima, got compliments all night. The waistcoat embroidery looks way more expensive than the price tag.',
        verified: true
      }
    ]
  },

  {
    id: 'tb-mens-stitched-04',
    name: "Men's Embroidered Velvet Groom Sherwani with Kurta",
    slug: 'mens-embroidered-velvet-groom-sherwani-kurta',
    tagline: 'Hand-embroidered velvet sherwani with mirror-trim border, made for Baraat & Nikkah',
    category: 'clothing',
    gender: 'mens',
    stitchType: 'stitched',
    suitPieces: '2-piece',
    fabric: 'Embroidered Velvet Sherwani over Silk-Blend Kurta',
    price: 9500,
    originalPrice: 13000,
    discountPercentage: 27,
    images: [
      'data:image/jpeg;base64,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',
      'data:image/jpeg;base64,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',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvnD1LtAxSgjg6Wjm1pOoe2KgGspnA-zAuevRMLCE1B3dwwLf1VZAcvRnB&s=10'
    ],
    description: "The centrepiece for your Baraat or Nikkah look. A structured black velvet sherwani jacket hand-embroidered with tilla thread and a mirror-trim border, worn open over a matching silk-blend kurta. Comes with a coordinating Jinnah cap so you're ready straight out of the box.",
    details: [
      'Includes: 2-Piece Stitched (Embroidered Sherwani Jacket + Kurta)',
      'Sherwani: Structured velvet with hand-worked tilla thread embroidery & mirror-trim border',
      'Kurta: Silk-blend inner kurta, mandarin collar',
      'Accessory: Matching embroidered Jinnah cap included',
      'Fit: Tailored regular fit, available for custom stitching'
    ],
    fabricCare: [
      'Dry clean only — do not machine wash the velvet sherwani',
      'Store on a padded hanger to preserve embroidery'
    ],
    customStitchingAvailable: true,
    stitchingPrice: 1500,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Onyx Black & Gold', hex: '#111111' },
      { name: 'Maroon & Gold', hex: '#5C1A24' }
    ],
    isTrending: true,
    isBestSeller: false,
    isNewDrop: true,
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewCount: 8,
    reviews: [
      {
        id: 'rev-sw1',
        userName: 'Ahmed Raza',
        userCity: 'Islamabad',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Wore this for my own Baraat. The embroidery is dense and the velvet holds its shape all night. Worth every rupee.',
        verified: true
      }
    ]
  },

  // ==========================================
  // 10. MEN'S WATCHES, SHOES & FRAGRANCE
  // ==========================================
  {
    id: 'tb-acc-03',
    name: "Men's Chronograph Leather Strap Watch",
    slug: 'mens-chronograph-leather-strap-watch',
    tagline: 'Editorial-grade dial with genuine leather strap — the finishing piece for any outfit',
    category: 'accessories',
    subCategory: 'watches',
    gender: 'mens',
    price: 3200,
    originalPrice: 4500,
    discountPercentage: 29,
    images: [
      'https://images.unsplash.com/photo-1786124967103-875dda046e85?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1772949399884-01ec45bc5763?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1717157197005-b851de4abc63?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A minimalist analog watch built to sit under a kurta cuff or a formal shirt sleeve alike. Stainless steel case, scratch-resistant crystal face, and a genuine leather strap that breaks in comfortably over the first week of wear.',
    details: [
      'Case: Stainless steel, scratch-resistant crystal face',
      'Strap: Genuine leather, adjustable pin buckle',
      'Movement: Precision quartz analog',
      'Water Resistance: Splash & sweat resistant (not for swimming)'
    ],
    colors: [
      { name: 'Black Dial / Black Strap', hex: '#111111' },
      { name: 'Rose Gold / Steel Link', hex: '#B76E4C' },
      { name: 'White Dial / Black Leather', hex: '#F5F5F0' }
    ],
    isTrending: true,
    isBestSeller: false,
    isNewDrop: true,
    inStock: true,
    stockCount: 25,
    rating: 4.7,
    reviewCount: 19
  },
  {
    id: 'tb-acc-04',
    name: "Men's Premium Leather Formal Shoes",
    slug: 'mens-premium-leather-formal-shoes',
    tagline: 'Hand-finished genuine leather derbies that pair with kurta shalwar or suits',
    category: 'accessories',
    subCategory: 'shoes',
    gender: 'mens',
    price: 3800,
    originalPrice: 5000,
    discountPercentage: 24,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1668069226492-508742b03147?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563434564528-8fdf5996e622?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Genuine leather formal shoes with a cushioned insole built for long wedding-season days on your feet. The lace-up derby silhouette works equally well under a shalwar kameez or tailored trousers.',
    details: [
      'Upper: Genuine leather, hand-burnished finish',
      'Sole: Flexible TPR sole with cushioned insole',
      'Closure: Classic lace-up derby',
      'Care: Wipe clean with a soft dry cloth, use leather polish monthly'
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Tan Brown', hex: '#8B5A2B' },
      { name: 'Jet Black', hex: '#111111' }
    ],
    isTrending: false,
    isBestSeller: true,
    isNewDrop: false,
    inStock: true,
    stockCount: 20,
    rating: 4.8,
    reviewCount: 33
  },
  {
    id: 'tb-acc-05',
    name: 'Signature Oud Cologne for Men',
    slug: 'signature-oud-cologne-for-men',
    tagline: 'Long-lasting woody oud fragrance in a premium glass bottle, gift-box ready',
    category: 'accessories',
    subCategory: 'cologne',
    gender: 'mens',
    price: 2600,
    originalPrice: 3400,
    discountPercentage: 24,
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615108395437-df128ad79e80?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A warm, woody oud fragrance with notes of amber and musk that lasts from Jummah prayers straight through to the evening. Presented in a heavyweight glass bottle that looks the part on a dresser or in a gift box.',
    details: [
      'Volume: 50ml Eau de Parfum',
      'Notes: Oud, Amber, Musk, Sandalwood base',
      'Longevity: 8+ hours on skin',
      'Packaging: Heavyweight glass bottle in a branded presentation box'
    ],
    isTrending: true,
    isBestSeller: false,
    isNewDrop: true,
    inStock: true,
    stockCount: 30,
    rating: 4.6,
    reviewCount: 12
  },
  {
    id: 'tb-acc-06',
    name: "Men's Aviator Sunglasses",
    slug: 'mens-aviator-sunglasses',
    tagline: 'UV-protected polarized lenses in a matte black frame, boxed with a microfiber pouch',
    category: 'accessories',
    subCategory: 'sunglasses',
    gender: 'mens',
    price: 1950,
    originalPrice: 2600,
    discountPercentage: 25,
    images: [
      'https://images.unsplash.com/photo-1655850106862-b39c99631c0a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1642439048981-8d679ad5f843?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Matte black acetate frame with polarized, UV400-protected lenses that cut glare on Karachi\'s brightest afternoons. Spring hinges keep the fit comfortable over a full day, from the drive to the dawat.',
    details: [
      'Lens: Polarized, UV400 protection, anti-scratch coating',
      'Frame: Matte black acetate with spring hinges',
      'Includes: Hard case + microfiber cleaning pouch',
      'Fit: Unisex medium frame'
    ],
    colors: [{ name: 'Matte Black', hex: '#111111' }],
    isTrending: false,
    isBestSeller: false,
    isNewDrop: true,
    inStock: true,
    stockCount: 40,
    rating: 4.5,
    reviewCount: 9
  },
  {
    id: 'tb-acc-07',
    name: "Men's Handcrafted Leather Strap Sandals",
    slug: 'mens-handcrafted-leather-strap-sandals',
    tagline: 'Peshawari-style leather sandals, hand-stitched with a cushioned footbed',
    category: 'accessories',
    subCategory: 'sandals',
    gender: 'mens',
    price: 2800,
    originalPrice: 3800,
    discountPercentage: 26,
    images: [
      'https://images.unsplash.com/photo-1585120824848-8a5cd41493d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1628375385879-1af64230c2e1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Open, breathable leather sandals in the classic Peshawari silhouette — hand-cut straps, hand-stitched edges, and a cushioned leather footbed that softens with every wear. Pairs naturally with kurta shalwar or rolled-up chinos.',
    details: [
      'Upper: Genuine hand-cut leather straps',
      'Footbed: Cushioned leather sole, hand-stitched edges',
      'Sole: Durable rubber outsole with grip tread',
      'Care: Wipe clean with a damp cloth, air dry away from direct heat'
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Chestnut Brown', hex: '#8B5A2B' },
      { name: 'Jet Black', hex: '#111111' }
    ],
    isTrending: true,
    isBestSeller: false,
    isNewDrop: true,
    inStock: true,
    stockCount: 22,
    rating: 4.7,
    reviewCount: 15
  },
  {
    id: 'tb-acc-08',
    name: "Men's Silver Cufflinks",
    slug: 'mens-silver-cufflinks',
    tagline: 'Presentation-boxed cufflinks that finish off a French-cuff kurta or dress shirt',
    category: 'accessories',
    subCategory: 'cufflinks',
    gender: 'mens',
    price: 2200,
    originalPrice: 2900,
    discountPercentage: 24,
    images: [
      'https://images.unsplash.com/photo-1761110518837-689557b142bf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1685392024138-36e7aade79f7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A refined pair of cufflinks in a brushed metal finish, boxed and ready for gifting. Dresses up a French-cuff wedding kurta, a Nikkah sherwani, or a plain formal shirt in seconds.',
    details: [
      'Material: Brushed stainless steel base, tarnish-resistant',
      'Fitting: Standard bullet-back closure for French cuffs',
      'Packaging: Wooden presentation box included',
      'Occasion: Wedding, formal event, or gifting'
    ],
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Antique Gold', hex: '#B8860B' }
    ],
    isTrending: false,
    isBestSeller: false,
    isNewDrop: true,
    inStock: true,
    stockCount: 28,
    rating: 4.8,
    reviewCount: 6
  }
];
