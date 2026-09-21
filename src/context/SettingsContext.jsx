import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

export const DEFAULT_STORE_CONFIG = {
  store_name: 'Azmat Mobile Parts',
  tagline: 'Azmat Mobile Parts',
  contact_phone: '0319-7900202',
  whatsapp: '0319-7900202',
  email: 'noreply@azmatmobileparts.com',
  address: 'NEW MADYAN ROAD QADRIA MARKET SHOP NO 21 22 AZMAT MOBILE PARTS MINGORA SWAT.',
  facebook: 'https://www.facebook.com/share/1Eoc...',
  instagram: '',
  youtube: '',
  footer_text: '© Azmat Mobile Parts. All rights reserved.',
  logo_url: '',
  favicon_url: '',
};

const SettingsContext = createContext({ config: DEFAULT_STORE_CONFIG, loading: true });

export function SettingsProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_STORE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'store_config'),
      (snapshot) => {
        setConfig({ ...DEFAULT_STORE_CONFIG, ...(snapshot.data() || {}) });
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.title = config.store_name || DEFAULT_STORE_CONFIG.store_name;
    if (!config.favicon_url) return undefined;

    let icon = document.querySelector('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.href = config.favicon_url;
    return undefined;
  }, [config.store_name, config.favicon_url]);

  return (
    <SettingsContext.Provider value={{ config, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
