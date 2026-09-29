export interface WatchStyle {
  id: 'chronograph' | 'dress' | 'leather' | 'minimalist';
  label: string;
}

export const WATCH_STYLES: WatchStyle[] = [
  { id: 'chronograph', label: 'Chronograph' },
  { id: 'dress', label: 'Dress' },
  { id: 'leather', label: 'Leather Strap' },
  { id: 'minimalist', label: 'Minimalist' }
];
