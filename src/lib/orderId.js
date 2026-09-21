export function generateOrderId() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `AMP-${digits}`;
}
