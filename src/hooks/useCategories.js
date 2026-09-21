import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    return () => unsubscribe();
  }, []);

  return categories;
}
