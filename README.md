# Mobile Parts Hub — Mobile Shop & Repair Parts E-Commerce

A full-stack e-commerce storefront + admin dashboard for a mobile repair parts business, built with React (Vite), Tailwind CSS, Lucide icons, and Firebase (Firestore + Auth). Product changes made in the admin dashboard sync to the customer storefront instantly via Firestore real-time listeners.

## Features

- **Storefront**: debounced search, category filters, responsive product cards, SALE badges, stock status, one-click WhatsApp ordering with a pre-filled message.
- **Admin dashboard**: Firebase Auth email/password login, add-product form, live inventory table with inline price editing (`onBlur` save), one-click stock toggle, delete with confirmation modal, and in-table search.
- **Real-time sync**: both storefront and admin use Firestore `onSnapshot` listeners — no page refresh needed.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- Lucide React icons
- Firebase Firestore + Firebase Authentication
- React Router

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Firebase project at https://console.firebase.google.com, enable **Firestore Database** and **Authentication → Email/Password**.
3. Create an admin user under Authentication so you can log in to `/admin`.
4. Copy `.env.example` to `.env` and fill in your Firebase config values (Project Settings → General → Your apps) and your WhatsApp business number:
   ```bash
   cp .env.example .env
   ```
5. Deploy the included Firestore security rules (`firestore.rules`) so only authenticated users can write products:
   ```bash
   firebase deploy --only firestore:rules
   ```
6. Run the dev server:
   ```bash
   npm run dev
   ```

## Firestore data model

Collection: `products`

| Field | Type | Notes |
|---|---|---|
| `title` | string | Product name |
| `category` | string | e.g. "Charging Flex", "Mobile ICs", "Tools" |
| `original_price` | number | Pre-discount price (Rs.) |
| `sale_price` | number | Current selling price (Rs.) |
| `in_stock` | boolean | Controls order button + badge |
| `stock_qty` | number | Quantity on hand |
| `image_url` | string | Product image (falls back to placeholder icon if broken/missing) |
| `updated_at` | timestamp | Set via `serverTimestamp()` on every write |

## Deployment

- **Vercel**: push to a Git repo and import into Vercel; `vercel.json` includes the SPA rewrite. Add your `VITE_*` env vars in the Vercel project settings.
- **Firebase Hosting**: `npm run build` then `firebase deploy --only hosting` (uses `firebase.json`, serving the `dist` folder).

## Project structure

```
src/
  components/        Storefront UI (Header, CategoryFilter, ProductCard, ProductGrid, ConfirmModal)
  components/admin/   Admin-only UI (ProductForm, InventoryTable, ProtectedRoute)
  context/AuthContext.jsx   Firebase Auth state + login/logout
  hooks/useProducts.js       Real-time Firestore listener
  lib/firebase.js            Firebase app/init
  lib/whatsapp.js            WhatsApp link builders + price formatting
  lib/categories.js          Category list used by filter + add-product form
  pages/               Storefront, AdminLogin, AdminDashboard
```
