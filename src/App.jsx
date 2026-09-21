import { Routes, Route } from 'react-router-dom';
import Storefront from './pages/Storefront.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import WishlistDrawer from './components/WishlistDrawer.jsx';
import QuickViewModal from './components/QuickViewModal.jsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <CartDrawer />
      <CheckoutModal />
      <WishlistDrawer />
      <QuickViewModal />
    </>
  );
}
