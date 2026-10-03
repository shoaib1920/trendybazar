import React, { useState } from 'react';
import { DiscountCode, PlacedOrder } from '../../types';
import { discountLabel, discountProblem, normalizeCode } from '../../lib/discountsService';
import { formatRs, isCountedSale } from './adminUtils';
import { Edit3, Loader2, Megaphone, Plus, Star, Tag, Trash2, X } from 'lucide-react';

interface AdminDiscountsProps {
  discounts: DiscountCode[];
  orders: PlacedOrder[];
  saveDiscount: (d: DiscountCode) => Promise<void>;
  deleteDiscount: (code: string) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const emptyForm = () => ({
  code: '',
  type: 'percent' as DiscountCode['type'],
  value: 10,
  minSpend: 0,
  description: '',
  expiresOn: '', // yyyy-mm-dd
  usageLimit: '',
  active: true,
  featured: false
});

export const AdminDiscounts: React.FC<AdminDiscountsProps> = ({ discounts, orders, saveDiscount, deleteDiscount, showToast }) => {
  const [form, setForm] = useState(emptyForm());
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const sorted = [...discounts].sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt));

  const statsFor = (code: string) => {
    const used = orders.filter((o) => o.discountCode && normalizeCode(o.discountCode) === code && isCountedSale(o));
    return { orders: used.length, given: used.reduce((s, o) => s + o.discount, 0), sales: used.reduce((s, o) => s + o.total, 0) };
  };

  const startEdit = (d: DiscountCode) => {
    setEditing(d);
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      minSpend: d.minSpend,
      description: d.description,
      expiresOn: d.expiresAt ? d.expiresAt.slice(0, 10) : '',
      usageLimit: d.usageLimit ? String(d.usageLimit) : '',
      active: d.active,
      featured: d.featured
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm());
  };

  // Only one code can be featured; un-feature the others first.
  const unfeatureOthers = async (code: string) => {
    for (const d of discounts.filter((x) => x.featured && x.code !== code)) {
      await saveDiscount({ ...d, featured: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = normalizeCode(form.code);
    if (!/^[A-Z0-9_-]{3,20}$/.test(code)) {
      showToast('Code must be 3–20 letters/numbers (no spaces)', 'warning');
      return;
    }
    const value = Number(form.value);
    if (!(value > 0) || (form.type === 'percent' && value > 90)) {
      showToast(form.type === 'percent' ? 'Percent must be between 1 and 90' : 'Amount must be more than 0', 'warning');
      return;
    }
    if (!editing && discounts.some((d) => d.code === code)) {
      showToast(`${code} already exists — edit it instead`, 'warning');
      return;
    }

    const discount: DiscountCode = {
      code,
      type: form.type,
      value,
      minSpend: Math.max(0, Number(form.minSpend) || 0),
      description: form.description.trim(),
      active: form.active,
      featured: form.featured && form.active,
      expiresAt: form.expiresOn ? new Date(`${form.expiresOn}T23:59:59`).toISOString() : undefined,
      usageLimit: Number(form.usageLimit) > 0 ? Math.round(Number(form.usageLimit)) : undefined,
      usedCount: editing?.usedCount ?? 0,
      createdAt: editing?.createdAt ?? new Date().toISOString()
    };

    setBusy('form');
    try {
      if (editing && editing.code !== code) await deleteDiscount(editing.code);
      if (discount.featured) await unfeatureOthers(code);
      await saveDiscount(discount);
      showToast(editing ? `Updated ${code}` : `Created ${code}`, 'success');
      resetForm();
    } catch (err: any) {
      showToast(err?.message || 'Could not save the code', 'warning');
    } finally {
      setBusy(null);
    }
  };

  const run = async (code: string, action: () => Promise<void>, message: string) => {
    setBusy(code);
    try {
      await action();
      showToast(message, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Something went wrong', 'warning');
    } finally {
      setBusy(null);
    }
  };

  const toggleActive = (d: DiscountCode) =>
    run(d.code, () => saveDiscount({ ...d, active: !d.active, featured: d.active ? false : d.featured }), d.active ? `${d.code} paused` : `${d.code} is live`);

  const makeFeatured = (d: DiscountCode) =>
    run(
      d.code,
      async () => {
        await unfeatureOthers(d.code);
        await saveDiscount({ ...d, featured: true, active: true });
      },
      `${d.code} is now advertised across the store`
    );

  const stopFeaturing = (d: DiscountCode) => run(d.code, () => saveDiscount({ ...d, featured: false }), 'Promotion banner turned off');

  const remove = (d: DiscountCode) => {
    if (!confirm(`Delete code ${d.code}? Customers will no longer be able to use it.`)) return;
    void run(d.code, () => deleteDiscount(d.code), `${d.code} deleted`);
  };

  const featured = discounts.find((d) => d.featured && !discountProblem(d));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start text-xs">
      {/* Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
            {editing ? <Edit3 className="w-4 h-4 text-[#8A6D1F]" /> : <Plus className="w-4 h-4 text-[#8A6D1F]" />}
            {editing ? `Edit ${editing.code}` : 'New discount code'}
          </h3>
          {editing && (
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-black" title="Cancel editing">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <label className="block space-y-1">
          <span className="font-semibold text-gray-700">Code</span>
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
            placeholder="e.g. EID20"
            maxLength={20}
            className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none font-mono font-bold tracking-wider"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block space-y-1">
            <span className="font-semibold text-gray-700">Discount type</span>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as DiscountCode['type'] })}
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
            >
              <option value="percent">Percent (%)</option>
              <option value="fixed">Fixed amount (Rs.)</option>
            </select>
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-gray-700">{form.type === 'percent' ? 'Percent off' : 'Rupees off'}</span>
            <input
              type="number"
              min={1}
              max={form.type === 'percent' ? 90 : undefined}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-gray-700">Minimum order (Rs.)</span>
            <input
              type="number"
              min={0}
              value={form.minSpend}
              onChange={(e) => setForm({ ...form, minSpend: Number(e.target.value) })}
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-gray-700">Usage limit</span>
            <input
              type="number"
              min={0}
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              placeholder="Unlimited"
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
            />
          </label>
          <label className="block space-y-1 col-span-2">
            <span className="font-semibold text-gray-700">Expires on (optional)</span>
            <input
              type="date"
              value={form.expiresOn}
              onChange={(e) => setForm({ ...form, expiresOn: e.target.value })}
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="font-semibold text-gray-700">Short description</span>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Eid sale"
            maxLength={60}
            className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
          />
        </label>

        <div className="space-y-1.5 pt-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-[#8A6D1F]" />
            <span>Active (customers can use it)</span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#8A6D1F] mt-0.5" />
            <span>
              Advertise on the store
              <span className="block text-[10px] text-gray-400">Shows in the top banner, welcome popup, cart and footer. Only one code at a time.</span>
            </span>
          </label>
        </div>

        <div className="p-2.5 rounded-xl bg-[#F7F3EC] text-gray-600">
          Customers see: <strong className="text-[#1A1A1A]">{normalizeCode(form.code) || 'CODE'}</strong> —{' '}
          {discountLabel({ type: form.type, value: Number(form.value) || 0, minSpend: Number(form.minSpend) || 0 })}
        </div>

        <button
          type="submit"
          disabled={busy === 'form'}
          className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy === 'form' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{editing ? 'Save changes' : 'Create code'}</span>
        </button>
      </form>

      {/* List */}
      <div className="lg:col-span-3 space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#F7F3EC]">
          <Megaphone className="w-4 h-4 text-[#8A6D1F] shrink-0" />
          {featured ? (
            <span>
              Advertising <strong className="font-mono">{featured.code}</strong> ({discountLabel(featured)}) across the store.
            </span>
          ) : (
            <span>No code is being advertised right now — promo banners are hidden.</span>
          )}
        </div>

        {sorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
            <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No discount codes yet. Create your first one.
          </div>
        )}

        {sorted.map((d) => {
          const problem = discountProblem(d);
          const stats = statsFor(d.code);
          const statusLabel = !d.active ? 'Paused' : problem ? (problem.includes('expired') ? 'Expired' : 'Limit reached') : 'Live';
          return (
            <div key={d.code} className={`bg-white rounded-2xl border p-4 ${d.featured ? 'border-[#F2B705]' : 'border-gray-200'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-sm text-[#1A1A1A] tracking-wider">{d.code}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        statusLabel === 'Live' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {statusLabel}
                    </span>
                    {d.featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F2B705]/25 text-[#8A6D1F] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Advertised
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{discountLabel(d)}</p>
                  {d.description && <p className="text-gray-400">{d.description}</p>}
                  <p className="text-gray-400 mt-1">
                    Used {d.usedCount}
                    {d.usageLimit ? ` / ${d.usageLimit}` : ''} times
                    {d.expiresAt && ` • expires ${new Date(d.expiresAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </p>
                </div>
                <div className="text-right text-gray-500">
                  <p>
                    <strong className="text-[#1A1A1A]">{stats.orders}</strong> orders
                  </p>
                  <p>{formatRs(stats.sales)} sales</p>
                  <p>{formatRs(stats.given)} given</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => void toggleActive(d)}
                  disabled={busy === d.code}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F3EC] font-bold hover:bg-[#efe7d8] disabled:opacity-50"
                >
                  {d.active ? 'Pause' : 'Activate'}
                </button>
                {d.featured ? (
                  <button onClick={() => void stopFeaturing(d)} disabled={busy === d.code} className="px-3 py-1.5 rounded-lg bg-[#F7F3EC] font-bold hover:bg-[#efe7d8] disabled:opacity-50">
                    Stop advertising
                  </button>
                ) : (
                  <button
                    onClick={() => void makeFeatured(d)}
                    disabled={busy === d.code || Boolean(problem && d.active)}
                    className="px-3 py-1.5 rounded-lg bg-[#F7F3EC] font-bold hover:bg-[#efe7d8] disabled:opacity-50"
                  >
                    Advertise on store
                  </button>
                )}
                <button onClick={() => startEdit(d)} className="px-3 py-1.5 rounded-lg bg-[#F7F3EC] font-bold hover:bg-[#efe7d8] flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => remove(d)}
                  disabled={busy === d.code}
                  className="ml-auto px-3 py-1.5 rounded-lg text-red-600 font-bold hover:bg-red-50 flex items-center gap-1 disabled:opacity-50"
                >
                  {busy === d.code ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
