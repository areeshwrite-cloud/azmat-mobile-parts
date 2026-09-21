import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'mph_wishlist_v1';

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = (id) => items.some((i) => i.id === id);

  const toggleWishlist = (product) => {
    setItems((prev) =>
      prev.some((i) => i.id === product.id)
        ? prev.filter((i) => i.id !== product.id)
        : [
            ...prev,
            {
              id: product.id,
              title: product.title,
              sale_price: product.sale_price,
              original_price: product.original_price,
              image_url: product.image_url,
            },
          ]
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);

  const totalCount = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isWishlisted,
        toggleWishlist,
        removeItem,
        totalCount,
        isOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
