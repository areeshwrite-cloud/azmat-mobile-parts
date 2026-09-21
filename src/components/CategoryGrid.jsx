import { useMemo, useState } from 'react';
import { getUniqueCategories } from '../lib/categories.js';
import { getCategoryIcon } from '../lib/categoryIcons.js';

const INITIAL_VISIBLE = 4;

export default function CategoryGrid({ products, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const counts = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  const categories = useMemo(() => getUniqueCategories(products), [products]);
  const visibleCategories = expanded ? categories : categories.slice(0, INITIAL_VISIBLE);

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-orange-500">Browse</span>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Browse by Categories</h2>
          <p className="mt-1 text-sm text-slate-500">
            Find tools, stations, parts, and accessories for every repair job
          </p>
        </div>
        {categories.length > INITIAL_VISIBLE && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            {expanded ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibleCategories.map((cat) => {
          const Icon = getCategoryIcon(cat);
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Icon size={26} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-800">{cat}</span>
              <span className="text-xs text-slate-400">{counts[cat] || 0} products</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
