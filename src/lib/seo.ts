// Keeps the page's SEO tags in sync while customers move around the app.
// (Product and category pages also get these tags from the server — see api/render.ts.)

export const SITE_URL = 'https://www.trendybazaar.site';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object | null;
}

const setMetaContent = (selector: string, attr: 'name' | 'property', key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

export const applyPageSeo = ({ title, description, path, image, noindex, jsonLd }: PageSeo) => {
  const url = `${SITE_URL}${path}`;
  const img = image || DEFAULT_IMAGE;
  document.title = title;

  setMetaContent('meta[name="description"]', 'name', 'description', description);
  setMetaContent('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
  setMetaContent('meta[property="og:url"]', 'property', 'og:url', url);
  setMetaContent('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaContent('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaContent('meta[property="og:image"]', 'property', 'og:image', img);
  setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaContent('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaContent('meta[name="twitter:image"]', 'name', 'twitter:image', img);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;

  // Page-specific structured data (product details, product lists).
  document.getElementById('ld-page')?.remove();
  if (jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-page';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
};
