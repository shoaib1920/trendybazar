import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { 
  Plus, 
  Settings2, 
  Package, 
  ShoppingBag, 
  Tag, 
  Check, 
  Trash2, 
  Edit3, 
  RefreshCw,
  Phone,
  MapPin,
  X
} from 'lucide-react';

export const AdminManagerModal: React.FC = () => {
  const { 
    products, 
    setProducts, 
    orders, 
    showToast, 
    setActiveView 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'discounts'>('orders');

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'electronics' as 'electronics' | 'accessories',
    price: 1999,
    originalPrice: 2500,
    stockCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1746645297670-80e76130ceca?w=900&auto=format&fit=crop&q=80',
    description: 'Fresh stock item added by Trendy Bazar manager.',
    tagline: 'Genuine stock, quality checked before dispatch'
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created: Product = {
      id: `tb-custom-${Date.now()}`,
      name: newProduct.name,
      slug,
      tagline: newProduct.tagline,
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice),
      discountPercentage: Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100),
      images: [newProduct.imageUrl],
      description: newProduct.description,
      details: ['100% Quality inspected', 'Genuine stock', 'Dispatched from Lahore warehouse'],
      inStock: true,
      stockCount: Number(newProduct.stockCount),
      rating: 5.0,
      reviewCount: 1,
      isNewDrop: true
    };

    setProducts((prev) => [created, ...prev]);
    showToast(`Added "${created.name}" to catalog!`, 'success');
    setNewProduct({
      name: '',
      category: 'electronics',
      price: 1999,
      originalPrice: 2500,
      stockCount: 15,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNQymJdrM9t_5WqKcUnisdV6jhBYDEyV3O9YfXq2pZaA&s=10',
      description: '',
      tagline: ''
    });
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
    showToast('Stock availability updated', 'info');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to remove this product from the store catalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('Product removed', 'info');
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10" id="admin-manager-dashboard">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] mb-1">
            <Settings2 className="w-4 h-4" />
            <span>Store Operations Panel</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1A1A1A]">
            Trendy Bazar Admin Manager
          </h1>
          <p className="text-xs text-gray-500">
            Easily manage live inventory, price updates, discounts, and courier booking manifests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('shop')}
            className="text-xs font-bold text-gray-600 hover:text-black py-2 px-3.5 bg-gray-100 rounded-full"
          >
            Back to Customer Store
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-[#F7F3EC] text-gray-600 hover:text-black'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Customer Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-[#F7F3EC] text-gray-600 hover:text-black'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Product Catalog ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('discounts')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'discounts'
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-[#F7F3EC] text-gray-600 hover:text-black'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Discount Rules (WELCOME5)</span>
        </button>
      </div>

      {/* 1. ORDERS TAB */}
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

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Product Form */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="font-heading font-bold text-sm text-[#1A1A1A] mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#F2B705]" />
              <span>Add New Product to Store</span>
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buds Pro 3 True Wireless Earbuds"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Selling Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Short Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Crisp bass, all-day battery"
                  value={newProduct.tagline}
                  onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })}
                  className="w-full bg-[#F7F3EC]/50 border border-gray-200 rounded-xl p-2 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs rounded-xl transition-all"
              >
                Publish to Store
              </button>
            </form>
          </div>

          {/* Existing Products List */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="font-heading font-bold text-sm text-[#1A1A1A]">
              Live Catalog Items ({products.length})
            </h3>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] line-clamp-1">{p.name}</h4>
                      <span className="text-[11px] text-gray-500 capitalize">{p.category} • Stock: {p.stockCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#1A1A1A]">Rs. {p.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleToggleStock(p.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
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
    </div>
  );
};
