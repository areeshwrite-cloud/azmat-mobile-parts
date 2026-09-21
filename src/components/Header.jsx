import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  UserCircle2,
  Wrench,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import CustomerAuthModal from './CustomerAuthModal.jsx';
import MyOrdersModal from './MyOrdersModal.jsx';
import ProfileModal from './ProfileModal.jsx';

export default function Header({ search, onSearchChange, onCategorySelect, categories = [] }) {
  const { totalCount, openCart } = useCart();
  const { totalCount: wishlistCount, openWishlist } = useWishlist();
  const { user, logout } = useCustomerAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleCategoryClick = (cat) => {
    setMenuOpen(false);
    onCategorySelect?.(cat);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Wrench size={18} />
            </div>
            <span className="hidden text-sm font-extrabold uppercase tracking-wide text-slate-900 sm:block">
              Azmat Mobile Parts
            </span>
          </Link>

          <div className="hidden flex-1 md:block">
            <div className="flex overflow-hidden rounded-lg border border-slate-200">
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products, models..."
                className="w-full px-4 py-2.5 text-sm outline-none"
              />
              <button className="flex items-center gap-1.5 bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                <Search size={16} />
                Search
              </button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[100px] truncate sm:block">
                    {user.displayName || 'Account'}
                  </span>
                  <ChevronDown size={14} className="hidden sm:block" />
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Login / Register</span>
                </button>
              )}

              {accountMenuOpen && user && (
                <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setOrdersModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Package size={15} />
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <UserCircle2 size={15} />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={openWishlist}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <ShoppingCart size={20} />
              {totalCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 py-2.5 md:hidden">
          <div className="flex overflow-hidden rounded-lg border border-slate-200">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, models..."
              className="w-full px-3 py-2 text-sm outline-none"
            />
            <button className="flex items-center gap-1 bg-slate-900 px-3 text-white">
              <Search size={16} />
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/50 transition-opacity ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Categories</h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              {cat}
            </button>
          ))}
        </nav>
      </aside>

      <CustomerAuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <MyOrdersModal open={ordersModalOpen} onClose={() => setOrdersModalOpen(false)} />
      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
}

