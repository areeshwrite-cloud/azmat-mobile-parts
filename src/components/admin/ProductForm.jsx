import { useEffect, useState } from 'react';
import { ImageOff, Plus, Upload, X } from 'lucide-react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import { getUniqueCategories } from '../../lib/categories.js';
import { compressImageToDataUrl } from '../../lib/image.js';

const NEW_CATEGORY_VALUE = '__new__';

const emptyForm = {
  title: '',
  category: '',
  brand: '',
  compatible_model: '',
  tier: '',
  original_price: '',
  sale_price: '',
  stock_qty: '',
  in_stock: true,
  is_new: false,
  is_bestseller: false,
  image_url: '',
};

export default function ProductForm({ open, onClose, products = [], editingProduct = null }) {
  const [form, setForm] = useState(emptyForm);
  const [customCategory, setCustomCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState('');

  const categories = getUniqueCategories(products);
  const isEditing = !!editingProduct;

  useEffect(() => {
    if (!open) return;
    if (editingProduct) {
      setForm({
        title: editingProduct.title || '',
        category: editingProduct.category || '',
        brand: editingProduct.brand || '',
        compatible_model: editingProduct.compatible_model || '',
        tier: editingProduct.tier || '',
        original_price: editingProduct.original_price ?? '',
        sale_price: editingProduct.sale_price ?? '',
        stock_qty: editingProduct.stock_qty ?? '',
        in_stock: editingProduct.in_stock ?? true,
        is_new: editingProduct.is_new ?? false,
        is_bestseller: editingProduct.is_bestseller ?? false,
        image_url: editingProduct.image_url || '',
      });
    } else {
      setForm({ ...emptyForm, category: categories[0] || '' });
    }
    setCustomCategory('');
    setImageError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingProduct]);

  if (!open) return null;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');
    try {
      const dataUrl = await compressImageToDataUrl(file);
      update('image_url', dataUrl);
    } catch (err) {
      setImageError('Could not process that image. Please try a different file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resolvedCategory =
      form.category === NEW_CATEGORY_VALUE ? customCategory.trim() : form.category;
    if (!resolvedCategory) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: resolvedCategory,
        brand: form.brand.trim(),
        compatible_model: form.compatible_model.trim(),
        tier: form.tier.trim(),
        original_price: Number(form.original_price) || 0,
        sale_price: Number(form.sale_price) || 0,
        stock_qty: Number(form.stock_qty) || 0,
        in_stock: !!form.in_stock,
        is_new: !!form.is_new,
        is_bestseller: !!form.is_bestseller,
        image_url: form.image_url.trim(),
        updated_at: serverTimestamp(),
      };

      if (isEditing) {
        await updateDoc(doc(db, 'products', editingProduct.id), payload);
      } else {
        await addDoc(collection(db, 'products'), payload);
      }
      setForm(emptyForm);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Product title"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={NEW_CATEGORY_VALUE}>+ Add New Category</option>
          </select>

          {form.category === NEW_CATEGORY_VALUE && (
            <input
              required
              placeholder="New category name"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full rounded-lg border border-emerald-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Brand (e.g. MECHANIC)"
              value={form.brand}
              onChange={(e) => update('brand', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <input
              placeholder="Compatible model (optional)"
              value={form.compatible_model}
              onChange={(e) => update('compatible_model', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              min="0"
              placeholder="Original price (Rs.)"
              value={form.original_price}
              onChange={(e) => update('original_price', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Sale price (Rs.)"
              value={form.sale_price}
              onChange={(e) => update('sale_price', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min="0"
              placeholder="Stock quantity"
              value={form.stock_qty}
              onChange={(e) => update('stock_qty', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <select
              value={form.tier}
              onChange={(e) => update('tier', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">No tier badge</option>
              <option value="Premium">Premium</option>
              <option value="Compatible">Compatible</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={form.in_stock}
                onChange={(e) => update('in_stock', e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              In stock
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_new}
                onChange={(e) => update('is_new', e.target.checked)}
                className="h-4 w-4 accent-orange-500"
              />
              New arrival
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_bestseller}
                onChange={(e) => update('is_bestseller', e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              Best seller
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {form.image_url ? (
                <img src={form.image_url} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <ImageOff size={20} className="text-slate-300" />
              )}
            </div>
            <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-600 hover:border-emerald-400 hover:text-emerald-700">
              <Upload size={16} />
              {form.image_url ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          {imageError && <p className="text-xs font-medium text-red-600">{imageError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus size={16} />
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
