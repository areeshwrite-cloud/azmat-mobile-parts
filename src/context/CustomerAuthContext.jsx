import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { customerAuth } from '../lib/firebase.js';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(customerAuth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(customerAuth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    setUser({ ...cred.user, displayName: name });
    return cred;
  };

  const login = (email, password) => signInWithEmailAndPassword(customerAuth, email, password);
  const logout = () => signOut(customerAuth);
  const updateName = (name) => updateProfile(customerAuth.currentUser, { displayName: name });

  return (
    <CustomerAuthContext.Provider value={{ user, loading, register, login, logout, updateName }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
