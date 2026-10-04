// Serves the app's index.html with page-specific SEO for product and category
// pages (rewritten here in vercel.json). Search engines and link previews
// (WhatsApp, Facebook) then see the right title, description, image, price and
// readable content without running JavaScript. The browser app takes over as usual.
// Self-contained on purpose (see api/chat.ts).

const SITE = 'https://www.trendybazaar.site';
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

interface SeoProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
}

const fieldValue = (v: any): any => {
  if (!v) return undefined;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fieldValue);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fieldValue(x)]));
  return undefined;
};

const fetchProducts = async (): Promise<SeoProduct[]> => {
  const project = process.env.VITE_FIREBASE_PROJECT_ID;
  const key = process.env.VITE_FIREBASE_API_KEY;
  if (!project || !key) return [];
  const products: SeoProduct[] = [];
  let pageToken = '';
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/products?key=${key}&pageSize=300${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) break;
    const data: any = await res.json();
    for (const doc of data.documents || []) {
      const f = doc.fields || {};
      products.push({
        id: fieldValue(f.id) || doc.name.split('/').pop(),
        name: fieldValue(f.name) || '',
        slug: fieldValue(f.slug) || '',
        tagline: fieldValue(f.tagline) || '',
        description: fieldValue(f.description) || '',
        category: fieldValue(f.category) || '',
        price: Number(fieldValue(f.price)) || 0,
        originalPrice: Number(fieldValue(f.originalPrice)) || undefined,
        images: fieldValue(f.images) || [],
        inStock: fieldValue(f.inStock) !== false
      });
    }
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return products.filter((p) => p.slug && p.name);
};

// Must match productKeyFor() in src/context/ShopContext.tsx.
const productKey = (p: SeoProduct, all: SeoProduct[]) =>
  all.some((x) => x.slug === p.slug && x.id !== p.id) ? `${p.slug}-${p.id.slice(-5).toLowerCase()}` : p.slug;

const esc = (s: string) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const rs = (n: number) => `Rs. ${Math.round(n).toLocaleString('en-PK')}`;

// Link previews (WhatsApp ignores images over ~300 KB): ask Cloudinary for a compressed JPEG.
const previewImage = (url: string | undefined) => {
  if (!url) return DEFAULT_IMAGE;
  const marker = '/image/upload/';
  const at = url.indexOf(marker);
  if (!url.includes('res.cloudinary.com') || at === -1) return url;
  return `${url.slice(0, at + marker.length)}c_limit,w_1200,q_auto:good,f_jpg/${url.slice(at + marker.length)}`;
};

interface PageSeo {
  title: string;
  description: string;
  path: string;
  image: string;
  type: 'website' | 'product';
  bodyHtml: string;
  jsonLd?: object;
  notFound?: boolean;
}

const productLinks = (list: SeoProduct[], all: SeoProduct[]) =>
  `<ul>${list
    .map((p) => `<li><a href="/product/${encodeURIComponent(productKey(p, all))}">${esc(p.name)}</a> – ${rs(p.price)}</li>`)
    .join('')}</ul>`;

const CATEGORY_PAGES: Record<string, { category?: string; title: string; heading: string; description: string }> = {
  shop: {
    title: 'Shop Earbuds & Watches Online in Pakistan | Trendy Bazaar',
    heading: 'Shop All Products',
    description: 'Browse all wireless earbuds and watches at Trendy Bazaar. Fair prices, Cash on Delivery all over Pakistan and 7-day easy exchange.'
  },
  earbuds: {
    category: 'electronics',
    title: 'Wireless Earbuds in Pakistan – Best Prices | Trendy Bazaar',
    heading: 'Wireless Earbuds',
    description: 'Buy wireless earbuds online in Pakistan at Trendy Bazaar. Great sound and battery life, Cash on Delivery nationwide and fast 2–4 day delivery.'
  },
  watches: {
    category: 'accessories',
    title: 'Watches for Men in Pakistan – Stylish & Affordable | Trendy Bazaar',
    heading: 'Watches',
    description: 'Shop stylish watches online in Pakistan at Trendy Bazaar – chronograph, leather strap, steel and minimalist styles. Cash on Delivery nationwide.'
  },
  about: {
    title: 'About Trendy Bazaar – Earbuds & Watches Store in Pakistan',
    heading: 'About Trendy Bazaar',
    description: 'Trendy Bazaar is a Pakistani online store for wireless earbuds and watches with fair prices, Cash on Delivery and friendly WhatsApp support.'
  },
  contact: {
    title: 'Help & FAQs – Delivery, Exchange & Orders | Trendy Bazaar',
    heading: 'Help & FAQs',
    description: 'Questions about delivery, Cash on Delivery, exchanges or your order? Contact Trendy Bazaar on WhatsApp at +92 336 4300592.'
  }
};

const buildSeo = (page: string, key: string, products: SeoProduct[]): PageSeo => {
  if (page === 'product') {
    const product = products.find((p) => productKey(p, products) === key) || products.find((p) => p.slug === key);
    if (!product) {
      return {
        title: 'Product not found | Trendy Bazaar',
        description: 'This product is no longer available. Browse earbuds and watches at Trendy Bazaar.',
        path: `/product/${key}`,
        image: DEFAULT_IMAGE,
        type: 'website',
        bodyHtml: `<h1>Product not found</h1><p><a href="/shop">Browse all products</a></p>`,
        notFound: true
      };
    }
    const path = `/product/${encodeURIComponent(productKey(product, products))}`;
    const kind = product.category === 'electronics' ? 'Earbuds' : 'Watch';
    const description = clip(
      `${product.name} – ${rs(product.price)}${product.originalPrice && product.originalPrice > product.price ? ` (was ${rs(product.originalPrice)})` : ''}. ${
        product.tagline || product.description
      } Cash on Delivery all over Pakistan from Trendy Bazaar.`,
      160
    );
    const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 8);
    return {
      title: clip(`${product.name} Price in Pakistan – ${rs(product.price)} | Trendy Bazaar`, 70),
      description,
      path,
      image: previewImage(product.images[0]),
      type: 'product',
      bodyHtml: `<h1>${esc(product.name)}</h1>
        ${product.images[0] ? `<img src="${esc(product.images[0])}" alt="${esc(product.name)}" width="400" />` : ''}
        <p><strong>${rs(product.price)}</strong>${product.inStock ? ' – In stock' : ' – Out of stock'} • Cash on Delivery nationwide</p>
        ${product.tagline ? `<p>${esc(product.tagline)}</p>` : ''}
        ${product.description ? `<p>${esc(product.description)}</p>` : ''}
        ${related.length ? `<h2>More ${kind === 'Watch' ? 'watches' : 'earbuds'} from Trendy Bazaar</h2>${productLinks(related, products)}` : ''}
        <p><a href="/shop">Shop all products</a></p>`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || product.tagline,
        image: product.images.slice(0, 5),
        sku: product.id,
        category: kind,
        brand: { '@type': 'Brand', name: 'Trendy Bazaar' },
        url: `${SITE}${path}`,
        offers: {
          '@type': 'Offer',
          url: `${SITE}${path}`,
          priceCurrency: 'PKR',
          price: product.price,
          availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'Trendy Bazaar' },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: { '@type': 'MonetaryAmount', value: product.price >= 3500 ? 0 : 150, currency: 'PKR' },
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PK' },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
              transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 4, unitCode: 'DAY' }
            }
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'PK',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 7
          }
        }
      }
    };
  }

  const info = CATEGORY_PAGES[page] || CATEGORY_PAGES.shop;
  const list = info.category ? products.filter((p) => p.category === info.category) : ['shop'].includes(page) ? products : [];
  return {
    title: info.title,
    description: info.description,
    path: `/${page}`,
    image: list[0]?.images[0] ? previewImage(list[0].images[0]) : DEFAULT_IMAGE,
    type: 'website',
    bodyHtml: `<h1>${esc(info.heading)}</h1><p>${esc(info.description)}</p>${list.length ? productLinks(list, products) : ''}
      <nav><a href="/shop">Shop</a> · <a href="/earbuds">Earbuds</a> · <a href="/watches">Watches</a> · <a href="/contact">Help &amp; FAQs</a></nav>`,
    jsonLd: list.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: info.heading,
          itemListElement: list.slice(0, 50).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE}/product/${encodeURIComponent(productKey(p, products))}`,
            name: p.name
          }))
        }
      : undefined
  };
};

const setMeta = (html: string, pattern: RegExp, replacement: string) => (pattern.test(html) ? html.replace(pattern, replacement) : html);

export const injectSeo = (html: string, seo: PageSeo) => {
  const url = `${SITE}${seo.path}`;
  let out = html;
  out = setMeta(out, /<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  out = setMeta(out, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(seo.description)}" />`);
  out = setMeta(out, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}" />`);
  out = setMeta(out, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${seo.type}" />`);
  out = setMeta(out, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(url)}" />`);
  out = setMeta(out, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(seo.title)}" />`);
  out = setMeta(out, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(seo.description)}" />`);
  out = setMeta(out, /<meta property="og:image" [^>]*>/, `<meta property="og:image" content="${esc(seo.image)}" />`);
  out = setMeta(out, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(seo.title)}" />`);
  out = setMeta(out, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(seo.description)}" />`);
  out = setMeta(out, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(seo.image)}" />`);
  if (seo.image !== DEFAULT_IMAGE) {
    // Product photos have their own size; drop the share-image dimensions.
    out = out.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '');
  }
  if (seo.notFound) {
    out = setMeta(out, /<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />');
  }
  if (seo.jsonLd) {
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c');
    out = out.replace('</head>', `    <script type="application/ld+json" id="ld-page">${json}</script>\n  </head>`);
  }
  out = setMeta(
    out,
    /<div id="seo-fallback"([^>]*)>[\s\S]*?<\/div>\s*<\/div>/,
    `<div id="seo-fallback"$1>${seo.bodyHtml}</div>\n    </div>`
  );
  return out;
};

export default async function handler(req: any, res: any) {
  const page = String(req.query?.page || 'shop').toLowerCase();
  const key = String(req.query?.key || '');
  const host = req.headers?.['x-forwarded-host'] || req.headers?.host || 'www.trendybazaar.site';

  let html = '';
  try {
    const indexRes = await fetch(`https://${host}/index.html`);
    html = await indexRes.text();
  } catch (err) {
    console.error('SEO render: could not load index.html', err);
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
    return;
  }

  let status = 200;
  try {
    const products = await fetchProducts();
    const seo = buildSeo(page, key, products);
    if (seo.notFound && products.length > 0) status = 404;
    html = injectSeo(html, seo);
  } catch (err) {
    // Never break the page: fall back to the plain app shell.
    console.error('SEO render failed', err);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.status(status).send(html);
}
