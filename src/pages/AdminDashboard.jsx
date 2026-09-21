import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Package, Plus, Search, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useOrders } from '../hooks/useOrders.js';
import ProductForm from '../components/admin/ProductForm.jsx';
import InventoryTable from '../components/admin/InventoryTable.jsx';
import OrdersTable from '../components/admin/OrdersTable.jsx';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { products, loading } = useProducts();
  const { orders, loading: ordersLoading } = useOrders();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [tab, setTab] = useState('products');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) => p.title?.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term)
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Admin Dashboard</p>
              <p className="text-xs text-slate-500">Manage your product catalog</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              View Store
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === 'products' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Package size={16} />
            Products
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === 'orders' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag size={16} />
            Orders
            {orders.length > 0 && (
              <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {orders.filter((o) => o.status === 'Pending').length}
              </span>
            )}
          </button>
        </div>

        {tab === 'products' ? (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search inventory…"
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm text-slate-400">Loading inventory…</p>
            ) : (
              <InventoryTable
                products={filtered}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setFormOpen(true);
                }}
              />
            )}
          </>
        ) : ordersLoading ? (
          <p className="py-10 text-center text-sm text-slate-400">Loading orders…</p>
        ) : (
          <OrdersTable orders={orders} />
        )}
      </main>

      <ProductForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        products={products}
        editingProduct={editingProduct}
      />
    </div>
  );
}
