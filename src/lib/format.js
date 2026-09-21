export function formatPKR(amount) {
  const value = Number(amount) || 0;
  return `₨ ${value.toLocaleString('en-PK')}`;
}

export function discountPercent(original, sale) {
  const o = Number(original) || 0;
  const s = Number(sale) || 0;
  if (!o || o <= s) return 0;
  return Math.round(((o - s) / o) * 100);
}

export function stockUrgency(stockQty, baseline) {
  const qty = Number(stockQty) || 0;
  const total = Number(baseline) || 20;
  const soldPercent = Math.min(95, Math.max(5, Math.round(((total - qty) / total) * 100)));
  return { soldPercent, remaining: qty };
}
