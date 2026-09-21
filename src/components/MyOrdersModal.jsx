import { Package, X } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { useCustomerOrders } from '../hooks/useCustomerOrders.js';
import { formatPKR } from '../lib/format.js';

const STATUS_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Dispatched: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '—';
  return timestamp.toDate().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function MyOrdersModal({ open, onClose }) {
  const { user } = useCustomerAuth();
  const { orders, loading } = useCustomerOrders(user?.uid);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Package size={18} />
            My Orders
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-slate-400">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">#{order.order_id}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{formatDate(order.created_at)}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'} ·{' '}
                  <span className="font-semibold text-slate-900">{formatPKR(order.total_amount)}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
