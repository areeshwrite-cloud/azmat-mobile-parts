import { Heart, ImageOff, ShoppingCart, Trash2, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPKR } from '../lib/format.js';

export default function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem } = useWishlist();
  const { addItem } = useCart();

  return (
    <>
      <div
        onClick={closeWishlist}
        className={`fixed inset-0 z-40 bg-slate-900/50 transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-slate-900" />
            <h2 className="text-base font-bold text-slate-900">Your Wishlist</h2>
          </div>
          <button
            onClick={closeWishlist}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-400">
              <Heart size={40} />
              <p className="text-sm font-medium">Your wishlist is empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-xl border border-slate-200 p-2.5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff size={20} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-800">{item.title}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-slate-300 transition-colors hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{formatPKR(item.sale_price)}</span>
                      <button
                        onClick={() => addItem(item, 1)}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        <ShoppingCart size={13} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
