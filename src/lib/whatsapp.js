const RAW_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export function whatsappNumber() {
  return RAW_NUMBER;
}

export function buildWhatsappLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${RAW_NUMBER}?text=${text}`;
}

export function normalizePakistaniNumber(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('92')) return digits;
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  return `92${digits}`;
}

export function buildCustomerChatLink(phone) {
  return `https://wa.me/${normalizePakistaniNumber(phone)}`;
}

export function buildProductOrderMessage(product) {
  return [
    `📦 *Order Inquiry - Azmat Mobile Parts*`,
    ``,
    `Hi, I'd like to order:`,
    `• ${product.title}`,
    `Price: Rs. ${Number(product.sale_price || 0).toLocaleString('en-PK')}`,
    ``,
    `Please confirm availability. Thanks!`,
  ].join('\n');
}

export function buildOrderWhatsappMessage(order) {
  const lines = [];
  lines.push('📦 *NEW ORDER - AZMAT MOBILE PARTS*');
  lines.push(`🆔 Order ID: #${order.order_id}`);
  lines.push(`👤 Customer: ${order.customer_name}`);
  lines.push(`📱 Phone: ${order.phone}`);
  lines.push(`📍 Delivery Address: ${order.address}, ${order.city}`);
  const paymentLine =
    order.payment_method === 'Advance Payment'
      ? `💳 Payment Mode: Advance Payment (TRX: ${order.trx_id || '-'})`
      : `💳 Payment Mode: Cash on Delivery`;
  lines.push(paymentLine);
  lines.push('---------------------------------');
  lines.push('Items:');
  order.items.forEach((item, index) => {
    const lineTotal = Number(item.price || 0) * item.qty;
    lines.push(
      `${index + 1}. ${item.title} x ${item.qty} = Rs. ${lineTotal.toLocaleString('en-PK')}`
    );
  });
  lines.push('---------------------------------');
  lines.push(`Subtotal: Rs. ${order.subtotal.toLocaleString('en-PK')}`);
  lines.push(`Delivery: Rs. ${order.shipping_fee.toLocaleString('en-PK')}`);
  lines.push(`💰 *Grand Total: Rs. ${order.total_amount.toLocaleString('en-PK')}*`);

  return lines.join('\n');
}
