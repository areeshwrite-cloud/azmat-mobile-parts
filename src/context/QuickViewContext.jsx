import { createContext, useContext, useState } from 'react';

const QuickViewContext = createContext(null);

export function QuickViewProvider({ children }) {
  const [product, setProduct] = useState(null);

  const openQuickView = (p) => setProduct(p);
  const closeQuickView = () => setProduct(null);

  return (
    <QuickViewContext.Provider value={{ product, openQuickView, closeQuickView }}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  return useContext(QuickViewContext);
}
