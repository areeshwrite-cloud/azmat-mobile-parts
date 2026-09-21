import { PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-square rounded-t-2xl bg-slate-100" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-1/3 rounded bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center text-slate-400">
        <PackageSearch size={48} />
        <p className="text-sm font-medium">No products found. Try a different search or category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
