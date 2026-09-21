import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'mph_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          sale_price: product.sale_price,
          original_price: product.original_price,
          image_url: product.image_url,
          qty,
        },
      ];
    });
    setIsOpen(true);
  };

  const increment = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const decrement = (id) =>
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setItems([]);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.sale_price || 0) * i.qty, 0),
    [items]
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const openCheckout = () => {
    setIsOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        increment,
        decrement,
        removeItem,
        clearCart,
        totalCount,
        subtotal,
        isOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
