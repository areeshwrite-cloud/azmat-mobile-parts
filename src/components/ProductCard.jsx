import { useState } from 'react';
import { Eye, Heart, ImageOff, MessageCircle, ShoppingCart } from 'lucide-react';
import { formatPKR, discountPercent, stockUrgency } from '../lib/format.js';
import { buildProductOrderMessage, buildWhatsappLink } from '../lib/whatsapp.js';
import { ASSUMED_INITIAL_STOCK } from '../lib/constants.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useQuickView } from '../context/QuickViewContext.jsx';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { openQuickView } = useQuickView();

  const percentOff = discountPercent(product.original_price, product.sale_price);
  const inStock = !!product.in_stock;
  const wishlisted = isWishlisted(product.id);
  const { soldPercent, remaining } = stockUrgency(product.stock_qty, ASSUMED_INITIAL_STOCK);

  const orderLink = buildWhatsappLink(buildProductOrderMessage(product));

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5">
          {percentOff > 0 && (
            <span className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
              SALE {percentOff}%
            </span>
          )}
          {product.is_new && (
            <span className="rounded-md bg-orange-500 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
              NEW ARRIVAL
            </span>
          )}
          {!product.is_new && product.is_bestseller && (
            <span className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
              BEST SELLER
            </span>
          )}
        </div>

        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors ${
              wishlisted ? 'text-red-600' : 'text-slate-400 hover:text-red-600'
            }`}
          >
            <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => openQuickView(product)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm transition-colors hover:text-slate-900"
          >
            <Eye size={15} />
          </button>
        </div>

        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff size={40} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            {product.brand || product.category}
          </span>
          {product.tier && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              {product.tier}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-slate-800">
          {product.title}
        </h3>

        {product.compatible_model && (
          <p className="text-xs text-slate-400">Compatible: {product.compatible_model}</p>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-slate-900">
            {formatPKR(product.sale_price)}
          </span>
          {percentOff > 0 && (
            <span className="text-xs text-slate-400 line-through">
              {formatPKR(product.original_price)}
            </span>
          )}
        </div>

        {inStock && (
          <div className="space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-orange-600">Only {remaining} left in stock</span>
              <span className="text-slate-400">{soldPercent}% sold</span>
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          {inStock ? (
            <>
              <button
                onClick={() => addItem(product, 1)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-slate-800"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>
              <a
                href={orderLink}
                target="_blank"
                rel="noreferrer"
                title="Order on WhatsApp"
                className="flex items-center justify-center rounded-lg bg-emerald-600 p-2 text-white transition-all hover:bg-emerald-700"
              >
                <MessageCircle size={16} />
              </a>
            </>
          ) : (
            <button
              disabled
              className="flex-1 cursor-not-allowed rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-500"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

