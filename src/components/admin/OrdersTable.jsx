import { doc, updateDoc } from 'firebase/firestore';
import { ImageOff, MessageCircle } from 'lucide-react';
import { db } from '../../lib/firebase.js';
import { formatPKR } from '../../lib/format.js';
import { buildCustomerChatLink } from '../../lib/whatsapp.js';

const STATUS_OPTIONS = ['Pending', 'Dispatched', 'Delivered', 'Cancelled'];

const STATUS_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Dispatched: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '—';
  return timestamp.toDate().toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function OrdersTable({ orders }) {
  const updateStatus = async (orderId, status) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
  };

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-10 text-center text-slate-400">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <p className="text-sm font-bold text-slate-900">#{order.order_id}</p>
              <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'
                }`}
              >
                {order.status}
              </span>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium outline-none focus:border-emerald-500"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 py-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customer
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{order.customer_name}</p>
              <p className="text-sm text-slate-500">{order.phone}</p>
              <p className="text-sm text-slate-500">
                {order.address}, {order.city}
              </p>
              {order.notes && (
                <p className="mt-1 text-xs italic text-slate-400">Note: {order.notes}</p>
              )}
              <a
                href={buildCustomerChatLink(order.phone)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <MessageCircle size={14} />
                Chat with Customer
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Payment
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{order.payment_method}</p>
              {order.trx_id && (
                <p className="text-xs text-slate-500">TRX: {order.trx_id}</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Items
            </p>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                      <ImageOff size={14} />
                    </div>
                    <span className="text-slate-700">
                      {item.title} <span className="text-slate-400">x {item.qty}</span>
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatPKR(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-1 border-t border-dashed border-slate-200 pt-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span>{formatPKR(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPKR(order.total_amount)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
