import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import Header from '../components/Header.jsx';
import HeroBanner from '../components/HeroBanner.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import ProductSection from '../components/ProductSection.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import FloatingWhatsAppButton from '../components/FloatingWhatsAppButton.jsx';
import Footer from '../components/Footer.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { getUniqueCategories } from '../lib/categories.js';

export default function Storefront() {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => getUniqueCategories(products), [products]);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesSearch =
        !term ||
        p.title?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const isBrowsing = !search.trim() && category === 'All';
  const newStock = useMemo(() => products.filter((p) => p.is_new), [products]);
  const popular = useMemo(() => products.filter((p) => p.is_bestseller), [products]);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <Header
        search={search}
        onSearchChange={setSearch}
        onCategorySelect={handleCategorySelect}
        categories={categories}
      />
      <HeroBanner />
      <CategoryGrid products={products} onSelect={handleCategorySelect} />

      {isBrowsing && newStock.length > 0 && (
        <ProductSection
          eyebrow="JUST ARRIVED"
          title="New Stock"
          subtitle="Fresh mobile parts added for the latest repair jobs"
          viewAllLabel="View All New Stock"
          onViewAll={() => handleCategorySelect('All')}
          products={newStock}
          loading={loading}
        />
      )}

      {isBrowsing && popular.length > 0 && (
        <ProductSection
          eyebrow="CUSTOMER FAVOURITES"
          title="Most Popular"
          subtitle="Best-selling parts trusted by repair shops and technicians"
          viewAllLabel="View All Popular Products"
          onViewAll={() => handleCategorySelect('All')}
          products={popular}
          loading={loading}
        />
      )}

      <main id="catalog" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            {category === 'All' ? 'All Products' : category}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {filtered.length} product{filtered.length === 1 ? '' : 's'} found
          </p>
        </div>
        <ProductGrid products={filtered} loading={loading} />
      </main>

      <Footer />

      <FloatingWhatsAppButton />
    </div>
  );
}
