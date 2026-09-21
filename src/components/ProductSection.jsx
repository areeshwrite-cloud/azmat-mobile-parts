import ProductGrid from './ProductGrid.jsx';

export default function ProductSection({ eyebrow, title, subtitle, viewAllLabel, onViewAll, products, loading }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow && (
            <span className="text-xs font-bold uppercase tracking-wide text-orange-500">{eyebrow}</span>
          )}
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {onViewAll && (
          <button onClick={onViewAll} className="text-sm font-semibold text-orange-500 hover:text-orange-600">
            {viewAllLabel}
          </button>
        )}
      </div>

      <ProductGrid products={products} loading={loading} />
    </section>
  );
}
