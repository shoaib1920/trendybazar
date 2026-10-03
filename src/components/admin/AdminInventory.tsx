import React, { useMemo, useState } from 'react';
import { Product } from '../../types';
import { downloadCsv, formatRs, isLowStock, isOutOfStock, LOW_STOCK_THRESHOLD } from './adminUtils';
import { Download, Loader2, Minus, Plus, Search } from 'lucide-react';

interface AdminInventoryProps {
  products: Product[];
  saveProduct: (product: Product) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

type Filter = 'all' | 'low' | 'out';

export const AdminInventory: React.FC<AdminInventoryProps> = ({ products, saveProduct, showToast }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  // Unsaved edits per product id.
  const [drafts, setDrafts] = useState<Record<string, { stockCount: number; price: number }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products
      .filter((p) => (filter === 'low' ? isLowStock(p) : filter === 'out' ? isOutOfStock(p) : true))
      .filter((p) => !term || p.name.toLowerCase().includes(term))
      .sort((a, b) => a.stockCount - b.stockCount);
  }, [products, filter, search]);

  const draftFor = (p: Product) => drafts[p.id] || { stockCount: p.stockCount, price: p.price };
  const setDraft = (p: Product, patch: Partial<{ stockCount: number; price: number }>) =>
    setDrafts((prev) => ({ ...prev, [p.id]: { ...draftFor(p), ...patch } }));

  const save = async (p: Product) => {
    const draft = draftFor(p);
    setSavingId(p.id);
    try {
      const stockCount = Math.max(0, Math.round(draft.stockCount));
      await saveProduct({
        ...p,
        stockCount,
        price: Math.max(0, Math.round(draft.price)),
        inStock: stockCount > 0 ? p.inStock || p.stockCount === 0 : false
      });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[p.id];
        return next;
      });
      showToast(`Updated ${p.name}`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Could not save', 'warning');
    } finally {
      setSavingId(null);
    }
  };

  const toggleAvailability = async (p: Product) => {
    setSavingId(p.id);
    try {
      await saveProduct({ ...p, inStock: !p.inStock });
    } finally {
      setSavingId(null);
    }
  };

  const exportCsv = () =>
    downloadCsv(`inventory-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Product', 'Category', 'Price', 'Stock', 'Available'],
      ...products.map((p) => [p.name, p.category === 'electronics' ? 'Earbuds' : 'Watches', p.price, p.stockCount, p.inStock ? 'Yes' : 'No'])
    ]);

  const counts = {
    all: products.length,
    low: products.filter(isLowStock).length,
    out: products.filter(isOutOfStock).length
  };
  const stockValue = products.reduce((sum, p) => sum + p.price * Math.max(0, p.stockCount), 0);

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'low', 'out'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full font-bold ${filter === f ? 'bg-[#1A1A1A] text-white' : 'bg-[#F7F3EC] text-gray-600 hover:text-black'}`}
          >
            {f === 'all' ? 'All' : f === 'low' ? `Low stock (≤${LOW_STOCK_THRESHOLD})` : 'Out of stock'} ({counts[f]})
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="bg-white border border-gray-200 rounded-xl py-2 pl-8 pr-3 outline-none focus:border-[#8A6D1F]"
          />
        </div>
        <button onClick={exportCsv} className="py-2 px-3 bg-white border border-gray-200 rounded-xl font-bold flex items-center gap-1.5 hover:border-[#8A6D1F]">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <p className="text-gray-500">
        Total stock value: <strong className="text-[#1A1A1A]">{formatRs(stockValue)}</strong> • Edit stock or price and press Save.
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {rows.length === 0 && <p className="p-6 text-center text-gray-500">No products in this view.</p>}
        {rows.map((p) => {
          const draft = draftFor(p);
          const dirty = draft.stockCount !== p.stockCount || draft.price !== p.price;
          return (
            <div key={p.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3">
              <img src={p.images[0]} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-100 shrink-0" />
              <div className="flex-1 min-w-[140px]">
                <p className="font-bold text-[#1A1A1A] truncate">{p.name}</p>
                <p className="text-gray-400">
                  {p.category === 'electronics' ? 'Earbuds' : 'Watches'}
                  {isOutOfStock(p) ? (
                    <span className="ml-1.5 text-red-600 font-bold">• Out of stock</span>
                  ) : isLowStock(p) ? (
                    <span className="ml-1.5 text-amber-700 font-bold">• Low stock</span>
                  ) : null}
                </p>
              </div>

              <label className="flex items-center gap-1">
                <span className="text-gray-400">Rs.</span>
                <input
                  type="number"
                  min={0}
                  value={draft.price}
                  onChange={(e) => setDraft(p, { price: Number(e.target.value) })}
                  className="w-20 bg-[#F7F3EC]/50 border border-gray-200 rounded-lg p-1.5 outline-none"
                  aria-label="Price"
                />
              </label>

              <div className="flex items-center gap-1">
                <button onClick={() => setDraft(p, { stockCount: Math.max(0, draft.stockCount - 1) })} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200" aria-label="Decrease stock">
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  min={0}
                  value={draft.stockCount}
                  onChange={(e) => setDraft(p, { stockCount: Number(e.target.value) })}
                  className="w-14 text-center bg-[#F7F3EC]/50 border border-gray-200 rounded-lg p-1.5 outline-none"
                  aria-label="Stock"
                />
                <button onClick={() => setDraft(p, { stockCount: draft.stockCount + 1 })} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200" aria-label="Increase stock">
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => void toggleAvailability(p)}
                disabled={savingId === p.id}
                className={`px-2.5 py-1.5 rounded-lg font-bold w-24 ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}
                title="Mark as available or sold out on the store"
              >
                {p.inStock ? 'Available' : 'Sold out'}
              </button>

              <button
                onClick={() => void save(p)}
                disabled={!dirty || savingId === p.id}
                className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-white font-bold disabled:opacity-30 w-16 flex justify-center"
              >
                {savingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
