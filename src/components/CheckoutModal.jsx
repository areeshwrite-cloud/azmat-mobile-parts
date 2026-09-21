import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  Banknote,
  CheckCircle2,
  Landmark,
  MessageCircle,
  Smartphone,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { db, customerAuth } from '../lib/firebase.js';
import { formatPKR } from '../lib/format.js';
import { DELIVERY_FEE, PAYMENT_ACCOUNT_NUMBER, PAYMENT_ACCOUNT_TITLE } from '../lib/constants.js';
import { generateOrderId } from '../lib/orderId.js';
import { buildOrderWhatsappMessage, buildWhatsappLink } from '../lib/whatsapp.js';

const emptyForm = { name: '', phone: '', city: '', address: '', notes: '' };

export default function CheckoutModal() {
  const { items, subtotal, isCheckoutOpen, closeCheckout, clearCart } = useCart();

  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [trxId, setTrxId] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [submitError, setSubmitError] = useState('');

  if (!isCheckoutOpen) return null;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const isValid = form.name.trim() && form.phone.trim() && form.city.trim() && form.address.trim();
  const total = subtotal + DELIVERY_FEE;

  const handleClose = () => {
    closeCheckout();
    setCompletedOrder(null);
    setForm(emptyForm);
    setTrxId('');
    setTouched(false);
    setPaymentMethod('Cash on Delivery');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || items.length === 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const orderId = generateOrderId();
      const order = {
        order_id: orderId,
        customer_uid: customerAuth.currentUser?.uid || null,
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
        items: items.map((i) => ({
          id: i.id,
          title: i.title,
          price: Number(i.sale_price) || 0,
          qty: i.qty,
        })),
        subtotal,
        shipping_fee: DELIVERY_FEE,
        total_amount: total,
        payment_method: paymentMethod,
        trx_id: paymentMethod === 'Advance Payment' ? trxId.trim() : '',
        status: 'Pending',
        created_at: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), order);
      clearCart();
      setCompletedOrder(order);
    } catch (err) {
      setSubmitError(
        err?.code === 'permission-denied'
          ? 'Order could not be saved: Firestore security rules for the "orders" collection have not been deployed yet.'
          : 'Something went wrong while placing your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const sendWhatsappCopy = () => {
    if (!completedOrder) return;
    const message = buildOrderWhatsappMessage(completedOrder);
    window.open(buildWhatsappLink(message), '_blank', 'noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        {completedOrder ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={30} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Order Placed Successfully!</h2>
            <p className="text-sm text-slate-500">
              Order ID <span className="font-bold text-slate-900">#{completedOrder.order_id}</span>{' '}
              has been received. Our team will confirm shortly.
            </p>

            <div className="mt-2 w-full space-y-1.5 rounded-xl border border-slate-200 p-3 text-left text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatPKR(completedOrder.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-semibold text-slate-900">
                  {formatPKR(completedOrder.shipping_fee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 text-base">
                <span className="font-bold text-slate-900">Grand Total</span>
                <span className="font-extrabold text-slate-900">
                  {formatPKR(completedOrder.total_amount)}
                </span>
              </div>
            </div>

            <button
              onClick={sendWhatsappCopy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
            >
              <MessageCircle size={16} />
              Send Order Copy on WhatsApp
            </button>
            <button
              onClick={handleClose}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Checkout</h2>
              <button
                onClick={handleClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Customer Details
                </p>
                <input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100 ${
                    touched && !form.name.trim() ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp / Mobile Phone Number"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100 ${
                    touched && !form.phone.trim() ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <input
                  placeholder="Delivery City (e.g. Mingora, Peshawar, Lahore)"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100 ${
                    touched && !form.city.trim() ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <textarea
                  placeholder="Complete Street / Shop / House Address"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  rows={2}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100 ${
                    touched && !form.address.trim() ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <textarea
                  placeholder="Order Notes (optional)"
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Order Summary
                </p>
                <div className="space-y-1.5 rounded-xl border border-slate-200 p-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges</span>
                    <span className="font-semibold text-slate-900">{formatPKR(DELIVERY_FEE)}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 text-base">
                    <span className="font-bold text-slate-900">Total Payable</span>
                    <span className="font-extrabold text-slate-900">{formatPKR(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Payment Method
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote size={16} />
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Advance Payment')}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      paymentMethod === 'Advance Payment'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone size={16} />
                    Advance Payment
                  </button>
                </div>

                {paymentMethod === 'Advance Payment' && (
                  <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex items-start gap-2 text-sm text-emerald-900">
                      <Landmark size={16} className="mt-0.5 shrink-0" />
                      <div>
                        <p>Send payment via EasyPaisa / JazzCash / Bank transfer to:</p>
                        <p className="mt-1 font-bold">{PAYMENT_ACCOUNT_TITLE}</p>
                        <p className="font-bold">{PAYMENT_ACCOUNT_NUMBER}</p>
                      </div>
                    </div>
                    <input
                      placeholder="Transaction ID / TRX Number"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                )}
              </div>

              {submitError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:opacity-60"
              >
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
