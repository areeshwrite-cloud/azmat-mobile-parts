import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase.js';

export function useCustomerOrders(uid) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'orders'), where('customer_uid', '==', uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
      setOrders(list);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { orders, loading };
}
