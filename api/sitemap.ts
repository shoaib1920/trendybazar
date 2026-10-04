// /sitemap.xml (rewritten here in vercel.json): every public page plus one
// entry per product, read live from Firestore so new products appear
// automatically. Self-contained on purpose (see api/chat.ts).

const SITE = 'https://www.trendybazaar.site';

interface SitemapProduct {
  id: string;
  slug: string;
  images: string[];
  name: string;
  updateTime: string;
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

const fetchProducts = async (): Promise<SitemapProduct[]> => {
  const project = process.env.VITE_FIREBASE_PROJECT_ID;
  const key = process.env.VITE_FIREBASE_API_KEY;
  if (!project || !key) return [];
  const products: SitemapProduct[] = [];
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
        slug: fieldValue(f.slug) || '',
        name: fieldValue(f.name) || '',
        images: fieldValue(f.images) || [],
        updateTime: doc.updateTime
      });
    }
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return products.filter((p) => p.slug);
};

// Must match productKeyFor() in src/context/ShopContext.tsx.
const productKey = (p: SitemapProduct, all: SitemapProduct[]) =>
  all.some((x) => x.slug === p.slug && x.id !== p.id) ? `${p.slug}-${p.id.slice(-5).toLowerCase()}` : p.slug;

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function handler(_req: any, res: any) {
  let products: SitemapProduct[] = [];
  try {
    products = await fetchProducts();
  } catch (err) {
    console.error('Sitemap: could not load products', err);
  }

  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    { loc: '/', priority: '1.0', freq: 'daily' },
    { loc: '/shop', priority: '0.9', freq: 'daily' },
    { loc: '/earbuds', priority: '0.9', freq: 'daily' },
    { loc: '/watches', priority: '0.9', freq: 'daily' },
    { loc: '/about', priority: '0.5', freq: 'monthly' },
    { loc: '/contact', priority: '0.5', freq: 'monthly' }
  ];

  const urls = [
    ...pages.map(
      (p) => `  <url><loc>${SITE}${p.loc}</loc><lastmod>${today}</lastmod><changefreq>${p.freq}</changefreq><priority>${p.priority}</priority></url>`
    ),
    ...products.map((p) => {
      const images = p.images
        .filter(Boolean)
        .slice(0, 5)
        .map((img) => `<image:image><image:loc>${xml(img)}</image:loc><image:title>${xml(p.name)}</image:title></image:image>`)
        .join('');
      return `  <url><loc>${SITE}/product/${encodeURIComponent(productKey(p, products))}</loc><lastmod>${(p.updateTime || today).slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>${images}</url>`;
    })
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(body);
}
