import { ArrowRight, ImageOff, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatPKR } from '../lib/format.js';
import { DELIVERY_FEE } from '../lib/constants.js';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
    subtotal,
    clearCart,
    openCheckout,
  } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
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
            <ShoppingBag size={20} className="text-slate-900" />
            <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-400">
              <ShoppingBag size={40} />
              <p className="text-sm font-medium">Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-slate-200 p-2.5"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageOff size={20} className="text-slate-300" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-slate-300 transition-colors hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {formatPKR(item.sale_price)}
                      </span>
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 px-1">
                        <button
                          onClick={() => decrement(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-4 text-center text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => increment(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="w-full text-center text-xs font-medium text-slate-400 hover:text-red-600"
              >
                Clear cart
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 px-4 py-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery</span>
                <span className="font-semibold text-slate-900">{formatPKR(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-base">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-extrabold text-slate-900">
                  {formatPKR(subtotal + DELIVERY_FEE)}
                </span>
              </div>
            </div>

            <button
              onClick={openCheckout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
