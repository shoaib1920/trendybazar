import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { WATCH_STYLES } from '../data/categories';
import { subscribeToAdminAuth, signInAdmin, signOutAdmin } from '../lib/adminAuth';
import { uploadImageToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary';
import { ProductImageCropModal } from './ProductImageCropModal';
import type { User } from 'firebase/auth';
import {
  Plus,
  Settings2,
  Package,
  ShoppingBag,
  Tag,
  Trash2,
  Edit3,
  Phone,
  X,
  UploadCloud,
  CloudOff,
  LogOut,
  Loader2
} from 'lucide-react';

const emptyForm = () => ({
  id: '',
  name: '',
  tagline: '',
  description: '',
  category: 'electronics' as 'electronics' | 'accessories',
  subCategory: '',
  price: 1999,
  originalPrice: 0,
  stockCount: 15,
  rating: 5,
  reviewCount: 1,
  inStock: true,
  isNewDrop: false,
  isBestSeller: false,
  isTrending: false,
  images: [''] as string[],
  details: ''
});

export const AdminManagerModal: React.FC = () => {
  const {
    products,
    saveProduct,
    deleteProduct,
    isCloudBackendConfigured,
    orders,
    showToast,
    setActiveView
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'discounts'>('products');

  // --- Admin auth (only relevant once Firebase is configured) ---
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((user) => {
      setAdminUser(user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSigningIn(true);
    try {
      await signInAdmin(loginEmail, loginPassword);
      showToast('Signed in to admin panel', 'success');
    } catch (err: any) {
      setLoginError(err?.message?.includes('invalid-credential') || err?.code === 'auth/invalid-credential'
        ? 'Incorrect email or password.'
        : 'Sign-in failed. Check your Firebase Authentication setup.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // --- Product form state ---
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageQueue, setImageQueue] = useState<File[]>([]);
  const [isUploadingCroppedImage, setIsUploadingCroppedImage] = useState(false);
  const multiImageInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setImageQueue([]);
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      subCategory: p.subCategory || '',
      price: p.price,
      originalPrice: p.originalPrice || 0,
      stockCount: p.stockCount,
      rating: p.rating,
      reviewCount: p.reviewCount,
      inStock: p.inStock,
      isNewDrop: !!p.isNewDrop,
      isBestSeller: !!p.isBestSeller,
      isTrending: !!p.isTrending,
      images: p.images.length > 0 ? [...p.images] : [''],
      details: p.details.join('\n')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const handleAddImageSlot = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleRemoveImageSlot = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files?.length) return;
    setImageQueue((current) => [...current, ...Array.from(files)]);
    if (multiImageInputRef.current) multiImageInputRef.current.value = '';
  };

  const handleCroppedImage = async (file: File) => {
    setIsUploadingCroppedImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, images: [...prev.images.filter(Boolean), url] }));
      setImageQueue((current) => current.slice(1));
      showToast('Adjusted image uploaded to Cloudinary', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Image upload failed', 'warning');
    } finally {
      setIsUploadingCroppedImage(false);
    }
  };

  const handleCancelCrop = () => {
    if (!isUploadingCroppedImage) setImageQueue((current) => current.slice(1));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const cleanImages = form.images.map((i) => i.trim()).filter(Boolean);
    if (cleanImages.length === 0) {
      showToast('Add at least one image URL', 'warning');
      return;
    }

    const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = editingId || `tb-custom-${Date.now()}`;
    const discountPercentage =
      form.originalPrice && form.originalPrice > form.price
        ? Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)
        : undefined;

    const product: Product = {
      id,
      name: form.name.trim(),
      slug,
      tagline: form.tagline.trim(),
      category: form.category,
      subCategory: form.subCategory.trim() || undefined,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      discountPercentage,
      images: cleanImages,
      description: form.description.trim(),
      details: form.details.split('\n').map((d) => d.trim()).filter(Boolean),
      inStock: form.inStock,
      stockCount: Number(form.stockCount),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      isNewDrop: form.isNewDrop,
      isBestSeller: form.isBestSeller,
      isTrending: form.isTrending
    };

    setIsSaving(true);
    try {
      await saveProduct(product);
      showToast(editingId ? `Updated "${product.name}"` : `Added "${product.name}" to catalog!`, 'success');
      resetForm();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save product', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStock = async (p: Product) => {
    await saveProduct({ ...p, inStock: !p.inStock });
    showToast('Stock availability updated', 'info');
  };

  const handleDeleteProduct = async (productId: string, name: string) => {
    if (confirm(`Remove "${name}" from the store catalog?`)) {
      await deleteProduct(productId);
      showToast('Product removed', 'info');
      if (editingId === productId) resetForm();
    }
  };

  const handleExportOrders = () => {
    const text = orders
      .map(
        (o) =>
          `[${o.orderId}] ${o.customer.fullName} | ${o.customer.phone} | ${o.customer.city} | Rs. ${o.total} (${o.paymentMethod})`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    showToast('Copied orders list to clipboard for courier manifest!', 'success');
  };

  // --- Auth gate: only enforced once Firebase is actually configured ---
  const needsLogin = isCloudBackendConfigured && authChecked && !adminUser;

  if (isCloudBackendConfigured && !authChecked) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#8A6D1F]" />
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A6D1F] mb-2">
            <Settings2 className="w-4 h-4" />
            <span>Admin Sign In</span>
          </div>
          <h1 className="font-heading font-black text-xl text-[#1A1A1A] mb-1">Trendy Bazar Admin</h1>
          <p className="text-xs text-gray-500 mb-5">Sign in with your Firebase admin account to manage the live catalog.</p>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              required
              placeholder="admin@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#8A6D1F]"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-[#8A6D1F]"
            />
            {loginError && <p className="text-xs text-red-600">{loginError}</p>}
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSigningIn && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Sign In</span>
            </button>
          </form>

          <button
            onClick={() => setActiveView('home')}
            className="w-full text-center mt-4 text-xs text-gray-500 hover:text-black"
          >
            ← Back to store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10" id="admin-manager-dashboard">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] mb-1">
            <Settings2 className="w-4 h-4" />
            <span>Store Operations Panel</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A]">
            Trendy Bazar Admin Manager
          </h1>
          <p className="text-xs text-gray-500">
            Manage live inventory, prices, images, and courier booking manifests — no code changes needed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {adminUser && (
            <button
              onClick={() => signOutAdmin()}
              className="text-xs font-bold text-gray-600 hover:text-black py-2 px-3.5 bg-gray-100 rounded-full flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
          <button
            onClick={() => setActiveView('shop')}
            className="text-xs font-bold text-gray-600 hover:text-black py-2 px-3.5 bg-gray-100 rounded-full"
          >
            Back to Customer Store
          </button>
        </div>
      </div>

      {!isCloudBackendConfigured && (
        <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-xl mb-6 bg-amber-50 text-amber-800 border border-amber-200">
          <CloudOff className="w-4 h-4 shrink-0" />
          <span>Local demo mode — changes are saved only in this browser. Set up Firebase to make edits live for everyone.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'products' ? 'bg-[#1A1A1A] text-white' : 'bg-[#F7F3EC] text-gray-600 hover:text-black'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Product Catalog ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-[#1A1A1A] text-white' : 'bg-[#F7F3EC] text-gray-600 hover:text-black'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Customer Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('discounts')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'discounts' ? 'bg-[#1A1A1A] text-white' : 'bg-[#F7F3EC] text-gray-600 hover:text-black'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Discount Rules (WELCOME5)</span>
        </button>
      </div>

      {/* 1. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add / Edit Product Form */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs h-fit">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
                {editingId ? <Edit3 className="w-4 h-4 text-[#F2B705]" /> : <Plus className="w-4 h-4 text-[#F2B705]" />}
                <span>{editingId ? 'Edit Product' : 'Add New Product'}</span>
              </h3>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-[11px] text-gray-500 hover:text-red-600 font-semibold">
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buds Pro 3 True Wireless Earbuds"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Crisp bass, all-day battery"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any, subCategory: '' })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sub-Category</label>
                  {form.category === 'accessories' ? (
                    <select
                      value={form.subCategory}
                      onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                      className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                    >
                      <option value="">None</option>
                      {WATCH_STYLES.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. earbuds"
                      value={form.subCategory}
                      onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                      className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Was (Rs.)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={form.stockCount}
                    onChange={(e) => setForm({ ...form, stockCount: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Review Count</label>
                  <input
                    type="number"
                    min="0"
                    value={form.reviewCount}
                    onChange={(e) => setForm({ ...form, reviewCount: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-700">Product Images</label>
                  {!isCloudinaryConfigured && (
                    <span className="text-[10px] text-gray-400">Paste URLs (Cloudinary not set up)</span>
                  )}
                </div>
                {isCloudinaryConfigured && (
                  <>
                    <input
                      ref={multiImageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFilesSelected(e.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() => multiImageInputRef.current?.click()}
                      className="w-full mb-2 py-2.5 border border-dashed border-gray-300 hover:border-[#8A6D1F] rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload multiple product images</span>
                    </button>
                  </>
                )}
                <div className="space-y-1.5">
                  {form.images.map((url, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <input
                        type="url"
                        required={i === 0}
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => handleImageUrlChange(i, e.target.value)}
                        className="flex-1 min-w-0 bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none text-[11px]"
                      />
                      {form.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageSlot(i)}
                          className="p-2 text-gray-400 hover:text-red-600 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddImageSlot}
                  className="mt-1.5 text-[11px] font-bold text-[#8A6D1F] hover:underline"
                >
                  + Add image URL
                </button>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Bullet Details (one per line)</label>
                <textarea
                  rows={3}
                  placeholder={'Quartz movement\nWater resistant\n1-year warranty'}
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={form.isNewDrop} onChange={(e) => setForm({ ...form, isNewDrop: e.target.checked })} />
                  <span>New Drop</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} />
                  <span>Bestseller</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSaving || imageQueue.length > 0 || isUploadingCroppedImage}
                className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingId ? 'Save Changes' : 'Publish to Store'}</span>
              </button>
            </form>
          </div>

          {/* Existing Products List */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="font-heading font-bold text-sm text-[#1A1A1A]">
              Live Catalog Items ({products.length})
            </h3>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    editingId === p.id ? 'border-[#8A6D1F] ring-1 ring-[#8A6D1F]/30' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#1A1A1A] line-clamp-1">{p.name}</h4>
                      <span className="text-[11px] text-gray-500 capitalize">
                        {p.category}{p.subCategory ? ` • ${p.subCategory}` : ''} • Stock: {p.stockCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-[#1A1A1A] hidden sm:inline">Rs. {p.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleToggleStock(p)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="p-1.5 text-gray-400 hover:text-[#8A6D1F] rounded"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#F7F3EC] p-4 rounded-2xl">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#1A1A1A]">
                Recent Orders ({orders.length})
              </h3>
              <p className="text-xs text-gray-500">
                Incoming orders from Website and WhatsApp checkouts
              </p>
            </div>
            <button
              onClick={handleExportOrders}
              className="py-2 px-3.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold rounded-xl shadow-xs"
            >
              Export Courier Manifest
            </button>
          </div>

          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.orderId}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-sm text-[#1A1A1A]">
                      #{o.orderId}
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {o.status}
                    </span>
                    <span className="text-xs text-gray-400">{o.date}</span>
                  </div>

                  <div className="text-xs text-gray-700">
                    <strong>{o.customer.fullName}</strong> • {o.customer.phone} • {o.customer.city}
                  </div>
                  <div className="text-[11px] text-gray-500 max-w-md line-clamp-1">
                    {o.customer.address}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Items: {o.items.map((it) => `${it.product.name} (x${it.quantity})`).join(', ')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-heading font-black text-base text-[#1A1A1A]">
                    Rs. {o.total.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-gray-500 block">{o.paymentMethod}</span>
                  <a
                    href={`https://wa.me/${o.customer.phone.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum%20${encodeURIComponent(o.customer.fullName)}!%20Trendy%20Bazar%20here%20regarding%20your%20order%20${o.orderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:underline mt-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp Customer</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DISCOUNTS TAB */}
      {activeTab === 'discounts' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs max-w-xl space-y-4 text-xs">
          <h3 className="font-heading font-bold text-sm text-[#1A1A1A]">
            Active Promo Rules & Terms
          </h3>

          <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-heading font-black text-sm text-[#1A1A1A]">CODE: WELCOME5</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-gray-600">
              5% instant discount on any cart value for new visitors.
            </p>
          </div>
        </div>
      )}
      {isCloudinaryConfigured && imageQueue[0] && (
        <ProductImageCropModal
          file={imageQueue[0]}
          onCancel={handleCancelCrop}
          onApply={handleCroppedImage}
        />
      )}
    </div>
  );
};
