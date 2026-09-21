import { useState } from 'react';
import { doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Trash2, ImageOff, Pencil } from 'lucide-react';
import { db } from '../../lib/firebase.js';
import { formatPKR } from '../../lib/format.js';
import ConfirmModal from '../ConfirmModal.jsx';

export default function InventoryTable({ products, onEdit }) {
  const [pendingDelete, setPendingDelete] = useState(null);

  const savePrice = async (id, field, value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return;
    await updateDoc(doc(db, 'products', id), { [field]: num, updated_at: serverTimestamp() });
  };

  const toggleStock = async (product) => {
    await updateDoc(doc(db, 'products', product.id), {
      in_stock: !product.in_stock,
      updated_at: serverTimestamp(),
    });
  };

  const toggleFlag = async (product, field) => {
    await updateDoc(doc(db, 'products', product.id), {
      [field]: !product[field],
      updated_at: serverTimestamp(),
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteDoc(doc(db, 'products', pendingDelete.id));
    setPendingDelete(null);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Original</th>
              <th className="px-4 py-3">Sale Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff size={16} className="text-slate-300" />
                      )}
                    </div>
                    <span className="font-medium text-slate-800 line-clamp-1">{p.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{p.category}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={p.original_price}
                    onBlur={(e) => savePrice(p.id, 'original_price', e.target.value)}
                    className="w-24 rounded-md border border-transparent px-2 py-1 hover:border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  <input
                    type="number"
                    defaultValue={p.sale_price}
                    onBlur={(e) => savePrice(p.id, 'sale_price', e.target.value)}
                    className="w-24 rounded-md border border-transparent px-2 py-1 hover:border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStock(p)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      p.in_stock ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        p.in_stock ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => toggleFlag(p, 'is_new')}
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        p.is_new ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => toggleFlag(p, 'is_bestseller')}
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        p.is_bestseller ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      Bestseller
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit?.(p)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setPendingDelete(p)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  No products yet. Add your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete product?"
        message={`This will permanently remove "${pendingDelete?.title}" from your catalog.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
