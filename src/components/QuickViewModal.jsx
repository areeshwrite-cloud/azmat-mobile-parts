import { ImageOff, MessageCircle, ShoppingCart, X } from 'lucide-react';
import { useQuickView } from '../context/QuickViewContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPKR, discountPercent } from '../lib/format.js';
import { buildProductOrderMessage, buildWhatsappLink } from '../lib/whatsapp.js';

export default function QuickViewModal() {
  const { product, closeQuickView } = useQuickView();
  const { addItem } = useCart();

  if (!product) return null;

  const percentOff = discountPercent(product.original_price, product.sale_price);
  const inStock = !!product.in_stock;
  const orderLink = buildWhatsappLink(buildProductOrderMessage(product));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-end">
          <button
            onClick={closeQuickView}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <ImageOff size={40} className="text-slate-300" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            {product.brand && (
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{product.brand}</p>
            )}
            <h2 className="text-lg font-bold text-slate-900">{product.title}</h2>
            {product.compatible_model && (
              <p className="text-xs text-slate-500">Compatible: {product.compatible_model}</p>
            )}

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900">{formatPKR(product.sale_price)}</span>
              {percentOff > 0 && (
                <span className="text-sm text-slate-400 line-through">{formatPKR(product.original_price)}</span>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-500">
              {inStock ? `${product.stock_qty ?? 0} in stock` : 'Out of stock'}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {inStock ? (
                <>
                  <button
                    onClick={() => {
                      addItem(product, 1);
                      closeQuickView();
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <a
                    href={orderLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center rounded-lg bg-emerald-600 p-2.5 text-white hover:bg-emerald-700"
                  >
                    <MessageCircle size={18} />
                  </a>
                </>
              ) : (
                <button disabled className="flex-1 cursor-not-allowed rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-400">
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
