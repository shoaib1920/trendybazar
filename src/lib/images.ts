// Asks Cloudinary for a right-sized, automatically compressed version of a
// product photo (WebP/AVIF where the browser supports it). Other image URLs
// are returned unchanged. Big win for mobile page speed (a Google ranking factor).
export const optimizeImage = (url: string | undefined, width: number): string => {
  if (!url) return '';
  const marker = '/image/upload/';
  const at = url.indexOf(marker);
  if (!url.includes('res.cloudinary.com') || at === -1) return url;
  const rest = url.slice(at + marker.length);
  // Already transformed (e.g. "f_auto,..." or "w_400/") — leave as is.
  if (/^[a-z]{1,3}_[^/]+\//.test(rest)) return url;
  return `${url.slice(0, at + marker.length)}f_auto,q_auto,c_limit,w_${width}/${rest}`;
};
