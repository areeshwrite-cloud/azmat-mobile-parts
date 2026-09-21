import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

export function useHomeBanners() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const now = new Date();
      const active = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((item) => item.isActive && item.placement === 'Top hero slider')
        .filter((item) => !item.startDate || new Date(item.startDate) <= now)
        .filter((item) => !item.endDate || new Date(item.endDate) >= now)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setBanners(active);
    });
    return () => unsubscribe();
  }, []);

  return banners;
}
