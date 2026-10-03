import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { WATCH_STYLES } from '../data/categories';
import { subscribeToAdminAuth, signInAdmin, signOutAdmin, isAdminUser } from '../lib/adminAuth';
import { uploadImageToCloudinary, isCloudinaryConfigured, isOwnCloudinaryUrl } from '../lib/cloudinary';
import { ProductImageCropModal } from './ProductImageCropModal';
import { subscribeToOrders } from '../lib/ordersService';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminOrders } from './admin/AdminOrders';
import { AdminInventory } from './admin/AdminInventory';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminDiscounts } from './admin/AdminDiscounts';
import { AdminAbandonedCarts } from './admin/AdminAbandonedCarts';
import { AdminRestockRequests } from './admin/AdminRestockRequests';
import {
  deleteAbandonedCartRemote,
  deleteBackInStockRemote,
  subscribeAbandonedCarts,
  subscribeBackInStock,
  updateAbandonedCartRemote,
  updateBackInStockRemote
} from '../lib/customerService';
import { DEFAULT_DISCOUNT, subscribeAllDiscounts } from '../lib/discountsService';
import { AbandonedCart, BackInStockRequest, DiscountCode, PlacedOrder } from '../types';
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
  Loader2,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  Pencil,
  LayoutDashboard,
  Boxes,
  Users,
  ShoppingCart,
  Bell
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
    orders: deviceOrders,
    updateOrder,
    showToast,
    setActiveView,
    localDiscounts,
    saveDiscount,
    deleteDiscount,
    backInStockRequests: localRestockRequests
  } = useShop();

  type AdminTab = 'dashboard' | 'orders' | 'products' | 'inventory' | 'customers' | 'carts' | 'restock' | 'discounts';
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // --- Admin auth (only relevant once Firebase is configured) ---
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((user) => {
      // Any account other than the store's admin account is signed straight out,
      // with the same message as a wrong password (never reveal the admin email).
      if (user && !isAdminUser(user)) {
        void signOutAdmin();
        setAdminUser(null);
        setLoginError('Incorrect email or password.');
      } else {
        setAdminUser(user);
      }
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  // --- Orders: live from Firestore for the signed-in admin, else this browser's orders ---
  const [remoteOrders, setRemoteOrders] = useState<PlacedOrder[] | null>(null);
  const [ordersError, setOrdersError] = useState('');
  const knownOrderIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!isCloudBackendConfigured || !adminUser) {
      setRemoteOrders(null);
      return;
    }
    knownOrderIds.current = null;
    return subscribeToOrders(
      (list) => {
        // Announce orders that arrive while the panel is open.
        if (knownOrderIds.current) {
          list
            .filter((o) => !knownOrderIds.current!.has(o.orderId))
            .forEach((o) => showToast(`🛒 New order ${o.orderId} from ${o.customer.fullName} — Rs. ${o.total.toLocaleString()}`, 'success'));
        }
        knownOrderIds.current = new Set(list.map((o) => o.orderId));
        setRemoteOrders(list);
        setOrdersError('');
      },
      (err) =>
        setOrdersError(
          err.message.includes('permission')
            ? 'Orders could not be loaded: Firestore rules need updating (see firestore.rules).'
            : `Orders could not be loaded: ${err.message}`
        )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCloudBackendConfigured, adminUser]);

  const orders = remoteOrders ?? deviceOrders;

  // --- Discount codes: live from Firestore for the admin, else this browser's list ---
  const [remoteDiscounts, setRemoteDiscounts] = useState<DiscountCode[] | null>(null);
  const seededDiscounts = useRef(false);

  useEffect(() => {
    if (!isCloudBackendConfigured || !adminUser) {
      setRemoteDiscounts(null);
      return;
    }
    return subscribeAllDiscounts(
      (list) => {
        setRemoteDiscounts(list);
        // First run: create the store's long-standing WELCOME5 offer so it keeps working.
        if (list.length === 0 && !seededDiscounts.current) {
          seededDiscounts.current = true;
          saveDiscount({ ...DEFAULT_DISCOUNT, createdAt: new Date().toISOString() }).catch(() => {});
        }
      },
      (err) => console.error('Could not load discount codes:', err)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCloudBackendConfigured, adminUser]);

  const discounts = remoteDiscounts ?? (isCloudBackendConfigured ? [] : localDiscounts);

  // --- Abandoned carts & restock requests (live from Firestore) ---
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [remoteRestock, setRemoteRestock] = useState<BackInStockRequest[] | null>(null);

  useEffect(() => {
    if (!isCloudBackendConfigured || !adminUser) return;
    const stopCarts = subscribeAbandonedCarts(setAbandonedCarts, (err) => console.error('Could not load abandoned carts:', err));
    const stopRestock = subscribeBackInStock(setRemoteRestock, (err) => console.error('Could not load restock requests:', err));
    return () => {
      stopCarts();
      stopRestock();
    };
  }, [isCloudBackendConfigured, adminUser]);

  const restockRequests = remoteRestock ?? (isCloudBackendConfigured ? [] : localRestockRequests);
  const openRestockCount = restockRequests.filter((r) => !r.notified).length;
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  const openOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('orders');
  };

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
  // Images waiting for the editor. `replaceIndex` is set when re-editing an
  // already uploaded image, so the result replaces it instead of being appended.
  const [imageQueue, setImageQueue] = useState<{ file: File; replaceIndex?: number }[]>([]);
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
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

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.images.length) return prev;
      const images = [...prev.images];
      [images[index], images[target]] = [images[target], images[index]];
      return { ...prev, images };
    });
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files?.length) return;
    // Copy the files out first: clearing the input below empties the live FileList.
    const selected = Array.from(files).map((file) => ({ file }));
    setImageQueue((current) => [...current, ...selected]);
    if (multiImageInputRef.current) multiImageInputRef.current.value = '';
  };

  const handleCroppedImage = async (file: File) => {
    setIsUploadingCroppedImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      const replaceIndex = imageQueue[0]?.replaceIndex;
      setForm((prev) => {
        if (replaceIndex === undefined) return { ...prev, images: [...prev.images.filter(Boolean), url] };
        const images = [...prev.images];
        images[replaceIndex] = url;
        return { ...prev, images };
      });
      setImageQueue((current) => current.slice(1));
      showToast('Image uploaded to Cloudinary', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Image upload failed', 'warning');
      throw err; // let the editor show the error inline too
    } finally {
      setIsUploadingCroppedImage(false);
    }
  };

  const handleEditUploadedImage = async (index: number) => {
    const url = form.images[index]?.trim();
    if (!url) return;
    setLoadingImageIndex(index);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const file = new File([blob], `product-image-${index + 1}.jpg`, { type: blob.type || 'image/jpeg' });
      setImageQueue((current) => [...current, { file, replaceIndex: index }]);
    } catch {
      showToast('Could not open this image for editing', 'warning');
    } finally {
      setLoadingImageIndex(null);
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
      showToast('Add at least one image URL or upload an image', 'warning');
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
            Orders, inventory, customers and products — everything to run the store in one place.
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

      {ordersError && (
        <div className="text-xs font-semibold px-3.5 py-2.5 rounded-xl mb-4 bg-red-50 text-red-700 border border-red-200">{ordersError}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        {(
          [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag, badge: pendingCount },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'inventory', label: 'Inventory', icon: Boxes },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'carts', label: 'Abandoned Carts', icon: ShoppingCart },
            { id: 'restock', label: 'Restock Requests', icon: Bell, badge: openRestockCount },
            { id: 'discounts', label: `Discounts (${discounts.length})`, icon: Tag }
          ] as { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === tab.id ? 'bg-[#1A1A1A] text-white' : 'bg-[#F7F3EC] text-gray-600 hover:text-black'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {!!tab.badge && (
              <span className="ml-0.5 min-w-4 h-4 px-1 rounded-full bg-[#F2B705] text-[#1A1A1A] text-[10px] flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <AdminDashboard
          orders={orders}
          products={products}
          onOpenOrder={openOrder}
          onOpenOrdersTab={() => setActiveTab('orders')}
          onOpenInventory={() => setActiveTab('inventory')}
        />
      )}

      {activeTab === 'inventory' && <AdminInventory products={products} saveProduct={saveProduct} showToast={showToast} />}

      {activeTab === 'customers' && <AdminCustomers orders={orders} onOpenOrder={openOrder} />}

      {activeTab === 'carts' && (
        <AdminAbandonedCarts
          carts={abandonedCarts}
          orders={orders}
          isCloud={isCloudBackendConfigured}
          updateCart={updateAbandonedCartRemote}
          deleteCart={deleteAbandonedCartRemote}
          showToast={showToast}
        />
      )}

      {activeTab === 'restock' && (
        <AdminRestockRequests
          requests={restockRequests}
          products={products}
          updateRequest={updateBackInStockRemote}
          deleteRequest={deleteBackInStockRemote}
        />
      )}

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
                    <span className="text-[10px] text-gray-400">Optional: paste image URLs or upload when Cloudinary is configured</span>
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
                <p className="text-[10px] text-gray-400 mb-1.5">
                  Add as many images as you like — customers can browse them all. The first image is the main/cover photo.
                </p>
                <div className="space-y-1.5">
                  {form.images.map((url, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-[#F7F3EC] flex items-center justify-center">
                        {url.trim() ? (
                          <img src={url.trim()} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-300" />
                        )}
                        {i === 0 && url.trim() && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#8A6D1F] text-white text-[8px] font-bold text-center leading-tight">
                            MAIN
                          </span>
                        )}
                      </div>
                      {isOwnCloudinaryUrl(url) ? (
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-2 bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 text-[11px]">
                          <span className="font-semibold text-gray-600 truncate">Uploaded image {i + 1}</span>
                          {isCloudinaryConfigured && (
                            <button
                              type="button"
                              onClick={() => handleEditUploadedImage(i)}
                              disabled={loadingImageIndex !== null}
                              className="flex items-center gap-1 font-bold text-[#8A6D1F] hover:underline disabled:opacity-50 shrink-0"
                            >
                              {loadingImageIndex === i ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Pencil className="w-3 h-3" />
                              )}
                              <span>Edit</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <input
                          type="url"
                          placeholder="https://... (optional)"
                          value={url}
                          onChange={(e) => handleImageUrlChange(i, e.target.value)}
                          className="flex-1 min-w-0 bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none text-[11px]"
                        />
                      )}
                      {form.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            title="Move up"
                            disabled={i === 0}
                            onClick={() => handleMoveImage(i, -1)}
                            className="p-1 text-gray-400 hover:text-[#8A6D1F] disabled:opacity-30 shrink-0"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Move down"
                            disabled={i === form.images.length - 1}
                            onClick={() => handleMoveImage(i, 1)}
                            className="p-1 text-gray-400 hover:text-[#8A6D1F] disabled:opacity-30 shrink-0"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Remove image"
                            onClick={() => handleRemoveImageSlot(i)}
                            className="p-1 text-gray-400 hover:text-red-600 shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
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
        <AdminOrders
          orders={orders}
          products={products}
          updateOrder={updateOrder}
          saveProduct={saveProduct}
          showToast={showToast}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
        />
      )}

      {/* 3. DISCOUNTS TAB */}
      {activeTab === 'discounts' && (
        <AdminDiscounts
          discounts={discounts}
          orders={orders}
          saveDiscount={saveDiscount}
          deleteDiscount={deleteDiscount}
          showToast={showToast}
        />
      )}
      {isCloudinaryConfigured && imageQueue[0] && (
        <ProductImageCropModal
          file={imageQueue[0].file}
          remaining={imageQueue.length - 1}
          onCancel={handleCancelCrop}
          onApply={handleCroppedImage}
        />
      )}
    </div>
  );
};
