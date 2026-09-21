import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileDown,
  FileText,
  Gauge,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Save,
  Settings,
  ShoppingBag,
  Tags,
  Truck,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { useStoreConfig } from "../hooks/useStoreConfig.js";
import ProductForm from "../components/admin/ProductForm.jsx";
import InventoryTable from "../components/admin/InventoryTable.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { db } from "../lib/firebase.js";
import { formatPKR } from "../lib/format.js";
import { buildCustomerChatLink } from "../lib/whatsapp.js";
import { compressImageToDataUrl } from "../lib/image.js";
import BrandManager from "../components/admin/BrandManager.jsx";
import BannerManager from "../components/admin/BannerManager.jsx";

const MENU = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["orders", "Orders", ShoppingBag],
  ["revenue", "Revenue", BarChart3],
  ["products", "Products", Package],
  ["categories", "Categories", Tags],
  ["brands", "Brands", Boxes],
  ["banners", "Banners", Image],
  ["homepage", "Homepage Content", Gauge],
  ["customers", "Customers", Users],
  ["shipping", "Shipping", Truck],
  ["pages", "Pages", FileText],
  ["settings", "Settings", Settings],
];
const STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Ready to Ship",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Failed",
  "Returned",
];
const VALID_STATUSES = new Set([
  "Pending",
  "Confirmed",
  "Processing",
  "Ready to Ship",
  "Shipped",
  "Out for Delivery",
  "Delivered",
]);

function useLiveCollection(name, sortField = "created_at") {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, name), (snapshot) => {
      const next = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      if (sortField)
        next.sort(
          (a, b) => (b[sortField]?.seconds || 0) - (a[sortField]?.seconds || 0),
        );
      setItems(next);
    });
    return () => unsubscribe();
  }, [name, sortField]);
  return items;
}

function useLiveDocument(path) {
  const [data, setData] = useState({});
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, ...path.split("/")), (snapshot) =>
      setData(snapshot.data() || {}),
    );
    return () => unsubscribe();
  }, [path]);
  return data;
}

function safeDate(value) {
  return value?.toDate?.() || new Date(0);
}
function statusClass(status) {
  return status === "Delivered"
    ? "bg-emerald-100 text-emerald-700"
    : ["Cancelled", "Failed", "Returned"].includes(status)
      ? "bg-red-100 text-red-700"
      : ["Shipped", "Out for Delivery"].includes(status)
        ? "bg-blue-100 text-blue-700"
        : "bg-yellow-100 text-yellow-700";
}
function Metric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <Icon size={17} className="text-orange-500" />
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function OrderModal({ order, close, orders }) {
  const [status, setStatus] = useState(order?.status || "Pending");
  useEffect(() => setStatus(order?.status || "Pending"), [order]);
  if (!order) return null;
  const save = async (value) => {
    setStatus(value);
    try {
      await updateDoc(doc(db, "orders", order.id), { status: value });
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs text-slate-400">Order details</p>
            <h2 className="text-xl font-extrabold">#{order.order_id}</h2>
          </div>
          <button onClick={close}>
            <X />
          </button>
        </div>
        <div className="grid gap-4 border-b border-slate-100 py-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">
              Customer
            </p>
            <p className="font-bold">{order.customer_name}</p>
            <p className="text-sm text-slate-500">{order.phone}</p>
            <p className="text-sm text-slate-500">
              {order.address}, {order.city}
            </p>
            {order.notes && (
              <p className="mt-2 text-xs italic text-slate-400">
                {order.notes}
              </p>
            )}
            <a
              href={buildCustomerChatLink(order.phone)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Status</p>
            <select
              value={status}
              onChange={(e) => save(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {STATUSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <p className="mt-3 text-xs font-bold uppercase text-slate-400">
              Payment
            </p>
            <p className="text-sm">{order.payment_method || "Not specified"}</p>
            <p className="text-xs text-slate-500">
              {order.trx_id ? `TRX: ${order.trx_id}` : ""}
            </p>
          </div>
        </div>
        <div className="space-y-2 py-4">
          <p className="text-xs font-bold uppercase text-slate-400">Items</p>
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <span>
                {item.title} x {item.qty}
              </span>
              <b>{formatPKR(item.price * item.qty)}</b>
            </div>
          ))}
        </div>
        <div className="space-y-1 border-t border-dashed pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <b>{formatPKR(order.subtotal)}</b>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <b>{formatPKR(order.shipping_fee)}</b>
          </div>
          <div className="flex justify-between text-base font-extrabold">
            <span>Total</span>
            <b>{formatPKR(order.total_amount)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ orders, products, categories, brands, goOrders }) {
  const validOrders = orders.filter((item) => VALID_STATUSES.has(item.status));
  const sales = validOrders.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0,
  );
  const customers = new Set(
    orders.map((item) => item.customer_uid || item.phone).filter(Boolean),
  ).size;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Live Firestore overview</p>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Metric label="Total Orders" value={orders.length} icon={ShoppingBag} />
        <Metric
          label="Pending"
          value={orders.filter((o) => o.status === "Pending").length}
          icon={Gauge}
        />
        <Metric
          label="Processing"
          value={orders.filter((o) => o.status === "Processing").length}
          icon={Wrench}
        />
        <Metric
          label="Shipped"
          value={orders.filter((o) => o.status === "Shipped").length}
          icon={Truck}
        />
        <Metric
          label="Delivered"
          value={orders.filter((o) => o.status === "Delivered").length}
          icon={CheckCircle2}
        />
        <Metric
          label="Cancelled"
          value={orders.filter((o) => o.status === "Cancelled").length}
          icon={X}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Total Sales"
          value={formatPKR(sales)}
          icon={CircleDollarSign}
        />
        <Metric label="Unique Customers" value={customers} icon={Users} />
        <Metric label="Categories" value={categories.length} icon={Tags} />
        <Metric label="Brands" value={brands.length} icon={Boxes} />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex justify-between border-b p-4">
          <h2 className="font-bold">Recent 5 Orders</h2>
          <button
            onClick={goOrders}
            className="text-sm font-bold text-orange-600"
          >
            View all <ChevronRight size={15} className="inline" />
          </button>
        </div>
        <div className="divide-y">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm"
            >
              <span className="font-bold">
                #{order.order_id}{" "}
                <small className="font-normal text-slate-400">
                  {order.customer_name}
                </small>
              </span>
              <b>{formatPKR(order.total_amount)}</b>
              <span
                className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass(order.status)}`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Orders({ orders, select }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const filtered = orders.filter(
    (order) =>
      (!search ||
        [order.order_id, order.customer_name, order.phone].some((value) =>
          value?.toLowerCase().includes(search.toLowerCase()),
        )) &&
      (status === "All statuses" || order.status === status),
  );
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Orders</h1>
      <div className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order, customer, phone"
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option>All statuses</option>
          {STATUSES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((order) => (
              <tr
                key={order.id}
                onClick={() => select(order)}
                className="cursor-pointer hover:bg-slate-50"
              >
                <td className="p-3 font-bold">
                  #{order.order_id}
                  <small className="block font-normal text-slate-400">
                    {safeDate(order.created_at).toLocaleDateString()}
                  </small>
                </td>
                <td className="p-3">
                  {order.customer_name}
                  <small className="block text-slate-400">{order.phone}</small>
                </td>
                <td className="p-3">
                  {order.items?.reduce((sum, item) => sum + item.qty, 0) || 0}
                </td>
                <td className="p-3 font-bold">
                  {formatPKR(order.total_amount)}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Revenue({ orders }) {
  const [range, setRange] = useState("All Time");
  const valid = orders.filter((item) => VALID_STATUSES.has(item.status));
  const now = new Date();
  const start = new Date(now);
  if (range === "Today") start.setHours(0, 0, 0, 0);
  if (range === "This Week") start.setDate(now.getDate() - 7);
  if (range === "This Month") start.setDate(1);
  const filtered =
    range === "All Time"
      ? valid
      : valid.filter((item) => safeDate(item.created_at) >= start);
  const total = filtered.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0,
  );
  const exportCsv = () => {
    const rows = [
      ["Order ID", "Customer", "Status", "Total"],
      ...filtered.map((item) => [
        item.order_id,
        item.customer_name,
        item.status,
        item.total_amount,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "azmat-revenue.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Revenue</h1>
        <div className="flex gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white"
          >
            <FileDown size={16} /> Export CSV
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric
          label="Total Revenue"
          value={formatPKR(total)}
          icon={CircleDollarSign}
        />
        <Metric
          label="Today's Revenue"
          value={formatPKR(
            valid
              .filter(
                (item) =>
                  safeDate(item.created_at).toDateString() ===
                  now.toDateString(),
              )
              .reduce((sum, item) => sum + Number(item.total_amount || 0), 0),
          )}
          icon={CircleDollarSign}
        />
        <Metric
          label="AOV"
          value={formatPKR(filtered.length ? total / filtered.length : 0)}
          icon={BarChart3}
        />
      </div>
    </div>
  );
}

function CollectionPanel({ title, collectionName, items, fields = ["name"] }) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const add = async (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, collectionName), {
        [fields[0]]: value.trim(),
        created_at: serverTimestamp(),
      });
      setValue("");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <form onSubmit={add} className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Add ${title.toLowerCase()}…`}
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <button
          disabled={saving}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white"
        >
          <Plus size={16} className="inline" /> Add
        </button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between rounded-xl border bg-white p-4 shadow-sm"
          >
            <span className="font-semibold">{item.name || item.title}</span>
            <button onClick={() => remove(item.id)} className="text-red-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentPanel({ title, path, initial, imageFields = [] }) {
  const live = useLiveDocument(path);
  const [form, setForm] = useState({ ...initial, ...live });
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm((current) => ({ ...current, ...live })), [live]);
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const upload = async (key, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      update(key, await compressImageToDataUrl(file, 500, 0.7));
    } catch (error) {
      alert(error.message);
    }
  };
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const clean = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, value ?? ""]),
      );
      await setDoc(doc(db, ...path.split("/")), clean, { merge: true });
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={save} className="space-y-4">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <div className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:grid-cols-2">
        {Object.entries(initial).map(([key]) =>
          imageFields.includes(key) ? (
            <label key={key} className="text-sm font-semibold">
              {key}
              <input
                type="file"
                accept="image/*"
                onChange={(event) => upload(key, event)}
                className="mt-1 w-full text-xs"
              />
              {form[key] && (
                <img
                  src={form[key]}
                  alt="Preview"
                  className="mt-2 h-20 w-20 rounded object-contain"
                />
              )}
            </label>
          ) : (
            <label key={key} className="text-sm font-semibold">
              {key}
              <textarea
                value={form[key] || ""}
                onChange={(e) => update(key, e.target.value)}
                rows={key.includes("address") || key.includes("text") ? 3 : 1}
                className="mt-1 w-full rounded-lg border px-3 py-2 font-normal"
              />
            </label>
          ),
        )}
      </div>
      <button
        disabled={saving}
        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
      >
        <Save size={16} className="mr-1 inline" />
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Customers({ orders }) {
  const customers = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      const key = order.customer_uid || order.phone;
      if (!key) return;
      map[key] ||= {
        name: order.customer_name,
        phone: order.phone,
        city: order.city,
        count: 0,
        spent: 0,
      };
      map[key].count += 1;
      map[key].spent += Number(order.total_amount || 0);
    });
    return Object.values(map);
  }, [orders]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Customers</h1>
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((customer) => (
              <tr key={customer.phone}>
                <td className="p-3 font-semibold">{customer.name}</td>
                <td className="p-3">
                  <a
                    href={buildCustomerChatLink(customer.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600"
                  >
                    {customer.phone}
                  </a>
                </td>
                <td className="p-3">{customer.city}</td>
                <td className="p-3">{customer.count}</td>
                <td className="p-3 font-bold">{formatPKR(customer.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const orders = useLiveCollection("orders");
  const categories = useLiveCollection("categories");
  const brands = useLiveCollection("brands");
  const banners = useLiveCollection("banners");
  const { config } = useStoreConfig();
  const [section, setSection] = useState("dashboard");
  const [drawer, setDrawer] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const open = (item) => {
    setSection(item);
    setDrawer(false);
  };
  const signOut = async () => {
    await logout();
    navigate("/admin/login");
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawer(true)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Wrench size={18} />
          </div>
          <div>
            <b className="text-sm">Azmat Admin</b>
            <p className="text-xs text-slate-400">PartsForge management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg border px-3 py-2 text-sm font-bold sm:block"
          >
            View Store
          </a>
          <button
            onClick={signOut}
            className="rounded-lg border px-3 py-2 text-sm font-bold"
          >
            <LogOut size={16} className="inline" />{" "}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      <div
        onClick={() => setDrawer(false)}
        className={`fixed inset-0 z-40 bg-slate-900/60 transition-opacity ${drawer ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex max-h-screen w-80 max-w-[88vw] flex-col transform overflow-y-auto bg-[#071426] p-5 text-white shadow-2xl transition-transform duration-300 ${drawer ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-orange-400">
              ADMIN PANEL
            </p>
            <h2 className="mt-2 text-xl font-extrabold">Azmat Mobile Parts</h2>
          </div>
          <button
            onClick={() => setDrawer(false)}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X />
          </button>
        </div>
        <nav className="mt-8 space-y-1">
          {MENU.map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => (key === "logout" ? signOut() : open(key))}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold ${section === key ? "bg-orange-500 text-white" : "text-slate-300 hover:bg-white/10"}`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 p-4 lg:ml-80 lg:p-8">
        {section === "dashboard" && (
          <Dashboard
            orders={orders}
            products={products}
            categories={categories}
            brands={brands}
            goOrders={() => setSection("orders")}
          />
        )}
        {section === "orders" && (
          <Orders orders={orders} select={setSelectedOrder} />
        )}
        {section === "revenue" && <Revenue orders={orders} />}
        {section === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <h1 className="text-2xl font-extrabold">Products</h1>
              <button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white"
              >
                <Plus size={16} className="inline" /> Add Product
              </button>
            </div>
            {loading ? (
              <p>Loading products…</p>
            ) : (
              <InventoryTable
                products={products}
                onEdit={(item) => {
                  setEditing(item);
                  setFormOpen(true);
                }}
              />
            )}
          </div>
        )}
        {section === "categories" && (
          <CollectionPanel
            title="Categories"
            collectionName="categories"
            items={categories}
          />
        )}
        {section === "brands" && <BrandManager brands={brands} />}
        {section === "banners" && <BannerManager banners={banners} />}
        {section === "homepage" && (
          <DocumentPanel
            title="Homepage Content"
            path="settings/homepage_content"
            initial={{
              notice: "Wholesale pricing for repair shops across Pakistan...",
              headline: "Fix Your Mobile with Trusted Spare Parts",
              features: "",
            }}
          />
        )}
        {section === "shipping" && (
          <DocumentPanel
            title="Shipping"
            path="settings/shipping_config"
            initial={{
              flat_rate: "250",
              free_shipping_minimum: "",
              express_charge: "",
            }}
          />
        )}
        {section === "pages" && (
          <DocumentPanel
            title="Pages"
            path="settings/static_pages"
            initial={{
              about_us: "",
              contact_us: "",
              privacy_policy: "",
              terms_conditions: "",
              return_policy: "",
            }}
          />
        )}
        {section === "settings" && (
          <DocumentPanel
            title="Settings"
            path="settings/store_config"
            initial={{
              store_name: config.store_name || "Azmat Mobile Parts",
              tagline: config.tagline || "Azmat Mobile Parts",
              contact_phone: config.contact_phone || "0319-7900202",
              whatsapp: config.whatsapp || "0319-7900202",
              email: config.email || "noreply@azmatmobileparts.com",
              address: config.address || "",
              facebook: config.facebook || "",
              instagram: config.instagram || "",
              youtube: config.youtube || "",
              footer_text: config.footer_text || "",
              logo_url: config.logo_url || "",
              favicon_url: config.favicon_url || "",
            }}
            imageFields={["logo_url", "favicon_url"]}
          />
        )}
        {section === "customers" && <Customers orders={orders} />}
      </main>
      <ProductForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        products={products}
        editingProduct={editing}
      />
      <OrderModal order={selectedOrder} close={() => setSelectedOrder(null)} />
    </div>
  );
}
