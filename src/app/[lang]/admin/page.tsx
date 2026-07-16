"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Database Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 🔒 Password now comes from env, not hardcoded in the bundle logic.
// Add NEXT_PUBLIC_ADMIN_PASSWORD=yourpassword to .env.local
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

// 🌍 Smart Dictionary
const translations = {
  en: {
    title: "ORDER MANAGEMENT PANEL",
    total: "Total Orders",
    pending: "Pending",
    delivered: "Delivered",
    addBtn: "➕ Add New Order",
    name: "Customer Name *",
    wa: "WhatsApp Number",
    prod: "Product Name",
    color: "Color",
    size: "Size",
    city: "City / Address",
    price: "Price (MAD)",
    save: "SAVE ORDER",
    saving: "SAVING...",
    recent: "📋 Recent Orders",
    empty: "No orders yet.",
    invoiceTitle: "INVOICE",
    billedTo: "Billed To",
    itemDesc: "Item Description",
    totalMAD: "Total Amount",
    tagline: "Elegant Moroccan Luxury",
    fallbackProd: "Luxury Apparel",
    footerMsg1: "Thank you for choosing AMINA.",
    footerMsg2: "Wear your elegance with pride.",
    downloadInvoice: "📄 Download Invoice",
    deleteBtn: "🗑️ Delete",
    deleteTitle: "Delete Order",
    cancelBtn: "Cancel",
    confirmDelete: "Are you sure you want to delete this order? This action cannot be undone.",
    statusMap: { Pending: "Pending ⏳", Shipped: "Shipped 🚚", Delivered: "Delivered ✅", Cancelled: "Cancelled ❌" },
    search: "🔍 Search orders...",
    allStatus: "All Statuses",
    exportCSV: "⬇️ Export CSV",
    analytics: "📊 Analytics",
    totalRevenue: "Total Revenue",
    avgOrder: "Avg. Order Value",
    topProduct: "Top Product",
    monthlyRevenue: "Revenue by Month",
    noResults: "No orders match your search.",
    wrongPassword: "❌ Wrong Password!",
    deleteError: "⚠️ Error deleting order. Please try again.",
    na: "N/A",
  },
  fr: {
    title: "PANNEAU DE GESTION",
    total: "Total",
    pending: "En attente",
    delivered: "Livré",
    addBtn: "➕ Ajouter une Commande",
    name: "Nom du Client *",
    wa: "Numéro WhatsApp",
    prod: "Nom du Produit",
    color: "Couleur",
    size: "Taille",
    city: "Ville / Adresse",
    price: "Prix (MAD)",
    save: "ENREGISTRER",
    saving: "ENREGISTREMENT...",
    recent: "📋 Commandes Récentes",
    empty: "Aucune commande pour le moment.",
    invoiceTitle: "FACTURE",
    billedTo: "Facturé à",
    itemDesc: "Description de l'article",
    totalMAD: "Montant total",
    tagline: "Luxe marocain élégant",
    fallbackProd: "Article de Luxe",
    footerMsg1: "Merci pour votre confiance.",
    footerMsg2: "Portez votre élégance avec fierté.",
    downloadInvoice: "📄 Télécharger",
    deleteBtn: "🗑️ Supprimer",
    deleteTitle: "Supprimer la commande",
    cancelBtn: "Annuler",
    confirmDelete: "Voulez-vous vraiment supprimer cette commande ? Cette action est irréversible.",
    statusMap: { Pending: "En attente ⏳", Shipped: "Expédié 🚚", Delivered: "Livré ✅", Cancelled: "Annulé ❌" },
    search: "🔍 Rechercher des commandes...",
    allStatus: "Tous les statuts",
    exportCSV: "⬇️ Exporter CSV",
    analytics: "📊 Statistiques",
    totalRevenue: "Revenu total",
    avgOrder: "Panier moyen",
    topProduct: "Produit populaire",
    monthlyRevenue: "Revenu par mois",
    noResults: "Aucune commande ne correspond à votre recherche.",
    wrongPassword: "❌ Mot de passe incorrect !",
    deleteError: "⚠️ Erreur lors de la suppression. Réessayez.",
    na: "N/A",
  },
  ar: {
    title: "لوحة إدارة الطلبات",
    total: "إجمالي الطلبات",
    pending: "قيد الانتظار",
    delivered: "تم التوصيل",
    addBtn: "➕ إضافة طلب جديد",
    name: "اسم العميل *",
    wa: "رقم الواتساب",
    prod: "اسم المنتج",
    color: "اللون",
    size: "المقاس",
    city: "المدينة / العنوان",
    price: "السعر (درهم مغربي)",
    save: "حفظ الطلب",
    saving: "جاري الحفظ...",
    recent: "📋 الطلبات الأخيرة",
    empty: "لا توجد طلبات بعد.",
    invoiceTitle: "فاتورة",
    billedTo: "فاتورة لـ",
    itemDesc: "وصف الصنف",
    totalMAD: "الإجمالي",
    tagline: "فخامة مغربية أنيقة",
    fallbackProd: "ملابس فاخرة",
    footerMsg1: "شكراً لثقتكم في أمينة.",
    footerMsg2: "ارتدي أناقتك بكل فخر.",
    downloadInvoice: "📄 تحميل الفاتورة",
    deleteBtn: "🗑️ حذف",
    deleteTitle: "حذف الطلب",
    cancelBtn: "إلغاء",
    confirmDelete: "هل أنت متأكد أنك تريد حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.",
    statusMap: { Pending: "قيد الانتظار ⏳", Shipped: "تم الشحن 🚚", Delivered: "تم التوصيل ✅", Cancelled: "ملغي ❌" },
    search: "🔍 البحث في الطلبات...",
    allStatus: "كل الحالات",
    exportCSV: "⬇️ تصدير CSV",
    analytics: "📊 التحليلات",
    totalRevenue: "إجمالي الإيرادات",
    avgOrder: "متوسط قيمة الطلب",
    topProduct: "المنتج الأكثر مبيعاً",
    monthlyRevenue: "الإيرادات الشهرية",
    noResults: "لا توجد طلبات مطابقة لبحثك.",
    wrongPassword: "❌ كلمة مرور خاطئة!",
    deleteError: "⚠️ خطأ أثناء الحذف. حاول مرة أخرى.",
    na: "غير متوفر",
  },
};

// Small helper: parse "450 MAD" / "450" -> 450
function parsePrice(priceStr: string | undefined | null): number {
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

// Lightweight toast (replaces alert())
function Toast({ message, type, onClose }: { message: string; type: "error" | "success"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={
        "fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-md shadow-lg text-sm font-medium text-white " +
        (type === "error" ? "bg-red-600" : "bg-green-600")
      }
    >
      {message}
    </div>
  );
}

export default function AdminDashboard({ params }: any) {
  const lang = params?.lang || "en";
  const t = translations[lang as keyof typeof translations] || translations.en;
  const isRtl = lang === "ar";

  // 🔒 SECURITY LOCK
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Form States
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("M");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  // 🔎 Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Invoice State
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // 🗑️ Delete Modal State
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  // 🔔 Toast State
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_PASSWORD && passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError(t.wrongPassword);
    }
  };

  async function fetchOrders() {
    setOrdersLoading(true);
    const { data } = await supabase.from("orders").select("*").order("id", { ascending: false });
    if (data) setOrders(data);
    setOrdersLoading(false);
  }

  async function addOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formattedPrice = price.toLowerCase().includes("mad") ? price : price + " MAD";

    const { error } = await supabase.from("orders").insert([{
      customer_name: customerName, phone, product, color, size, city, price: formattedPrice, status: "Pending",
    }]);

    if (!error) {
      setCustomerName(""); setPhone(""); setProduct(""); setColor(""); setCity(""); setPrice("");
      fetchOrders();
      setToast({ message: "✅ Order saved", type: "success" });
    } else {
      setToast({ message: t.deleteError, type: "error" });
    }
    setLoading(false);
  }

  async function updateStatus(id: number, newStatus: string) {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
  }

  async function executeDelete() {
    if (orderToDelete === null) return;
    const id = orderToDelete;

    setOrderToDelete(null);
    setOrders(orders.filter(o => o.id !== id));

    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      setToast({ message: t.deleteError, type: "error" });
      fetchOrders();
    }
  }

  const generatePDF = async (order: any) => {
    setInvoiceData(order);
    setTimeout(async () => {
      const element = invoiceRef.current;
      if (element) {
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("AMINA_Invoice_" + order.id + ".pdf");
        setInvoiceData(null);
      }
    }, 800);
  };

  // 🔎 Filtered orders (search + status)
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      if (!matchesStatus) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (o.customer_name || "").toLowerCase().includes(q) ||
        (o.phone || "").toLowerCase().includes(q) ||
        (o.product || "").toLowerCase().includes(q) ||
        (o.city || "").toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery, statusFilter]);

  // 📊 Analytics (computed from all orders, not just filtered)
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + parsePrice(o.price), 0);
    const avgOrder = orders.length ? totalRevenue / orders.length : 0;

    const productCounts: Record<string, number> = {};
    orders.forEach((o) => {
      const name = o.product || t.fallbackProd;
      productCounts[name] = (productCounts[name] || 0) + 1;
    });
    const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || t.na;

    const monthlyMap: Record<string, number> = {};
    orders.forEach((o) => {
      if (!o.created_at) return;
      const d = new Date(o.created_at);
      const key = d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
      monthlyMap[key] = (monthlyMap[key] || 0) + parsePrice(o.price);
    });
    const monthlyData = Object.entries(monthlyMap)
      .map(([month, revenue]) => ({ month, revenue }))
      .slice(-6);

    return { totalRevenue, avgOrder, topProduct, monthlyData };
  }, [orders, t.fallbackProd, t.na]);

  // ⬇️ CSV Export
  function exportCSV() {
    const headers = ["ID", "Customer", "Phone", "Product", "Color", "Size", "City", "Price", "Status", "Date"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.customer_name,
      o.phone,
      o.product,
      o.color,
      o.size,
      o.city,
      o.price,
      o.status,
      o.created_at ? new Date(o.created_at).toLocaleDateString() : "",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AMINA_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center border border-gray-200">
          <h1 className="text-3xl font-bold tracking-widest mb-6" style={{ fontFamily: "var(--font-playfair)" }}>AMINA</h1>
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider">Restricted Access</p>
          <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Enter Master Password" className="w-full border p-3 rounded text-center tracking-widest focus:outline-none focus:border-black mb-4" />
          {loginError && <p className="text-red-600 text-xs mb-4">{loginError}</p>}
          <button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition uppercase tracking-widest text-sm">Unlock Panel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-4 md:p-8 font-sans text-black relative" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        <div className={"mb-8 flex flex-col md:flex-row justify-between items-center " + (isRtl ? "md:text-right" : "md:text-left")}>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-widest mb-2" style={{ fontFamily: "var(--font-playfair)" }}>AMINA</h1>
            <p className="text-sm text-gray-600 tracking-wider uppercase">{t.title}</p>
          </div>
        </div>

        {/* 📊 QUICK STATS BOXES */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6">
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 text-center">
            <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">{t.total}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{orders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 text-center">
            <p className="text-xs md:text-sm text-yellow-600 uppercase tracking-wide">{t.pending}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 text-yellow-600">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 text-center">
            <p className="text-xs md:text-sm text-green-600 uppercase tracking-wide">{t.delivered}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 text-green-600">
              {orders.filter((o) => o.status === "Delivered").length}
            </p>
          </div>
        </div>

        {/* 📈 ANALYTICS SECTION */}
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-6 border-b pb-2">{t.analytics}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#f4f1ea] p-4 rounded-md border border-[#c9a871]/30 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t.totalRevenue}</p>
              <p className="text-xl md:text-2xl font-bold mt-1" style={{ color: "#c9a871" }}>
                {analytics.totalRevenue.toLocaleString()} MAD
              </p>
            </div>
            <div className="bg-[#f4f1ea] p-4 rounded-md border border-[#c9a871]/30 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t.avgOrder}</p>
              <p className="text-xl md:text-2xl font-bold mt-1" style={{ color: "#c9a871" }}>
                {analytics.avgOrder.toFixed(0)} MAD
              </p>
            </div>
            <div className="bg-[#f4f1ea] p-4 rounded-md border border-[#c9a871]/30 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t.topProduct}</p>
              <p className="text-lg md:text-xl font-bold mt-1 truncate" style={{ color: "#c9a871" }}>
                {analytics.topProduct}
              </p>
            </div>
          </div>

          {analytics.monthlyData.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{t.monthlyRevenue}</p>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d5" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${Number(value ?? 0).toLocaleString()} MAD`} />
                    <Bar dataKey="revenue" fill="#c9a871" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 bg-white p-6 rounded-md shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-semibold mb-6 border-b pb-2">{t.addBtn}</h2>
            <form onSubmit={addOrder} className="space-y-4 text-sm">
              <div><label className="block text-gray-600 mb-1">{t.name}</label><input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-black" /></div>
              <div><label className="block text-gray-600 mb-1">{t.wa}</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-black" dir="ltr" /></div>
              <div><label className="block text-gray-600 mb-1">{t.prod}</label><input list="products" type="text" value={product} onChange={(e) => setProduct(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-black" /><datalist id="products"><option value="Black Abaya" /><option value="Beige Kaftan" /></datalist></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-gray-600 mb-1">{t.color}</label><input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-black" /></div>
                <div><label className="block text-gray-600 mb-1">{t.size}</label><select value={size} onChange={(e) => setSize(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-black" dir="ltr"><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option><option>XXXL</option></select></div>
              </div>
              <div><label className="block text-gray-600 mb-1">{t.price}</label><input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-black" placeholder="e.g. 450" dir="ltr"/></div>
              <div><label className="block text-gray-600 mb-1">{t.city}</label><textarea value={city} onChange={(e) => setCity(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-black" rows={2}></textarea></div>
              <button disabled={loading} type="submit" className="w-full bg-black text-white py-3 mt-4 rounded-sm font-semibold tracking-wider hover:bg-gray-800 transition uppercase">{loading ? t.saving : t.save}</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-md shadow-sm border border-gray-200 overflow-x-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b pb-4">
              <h2 className="text-lg font-semibold">{t.recent}</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search}
                  className="border p-2 rounded text-sm focus:outline-none focus:border-black w-full sm:w-48"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border p-2 rounded text-sm focus:outline-none focus:border-black"
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <option value="All">{t.allStatus}</option>
                  <option value="Pending">{t.statusMap.Pending}</option>
                  <option value="Shipped">{t.statusMap.Shipped}</option>
                  <option value="Delivered">{t.statusMap.Delivered}</option>
                  <option value="Cancelled">{t.statusMap.Cancelled}</option>
                </select>
                <button
                  onClick={exportCSV}
                  className="text-sm bg-[#c9a871] text-white px-3 py-2 rounded hover:bg-[#b08d55] transition font-medium whitespace-nowrap"
                >
                  {t.exportCSV}
                </button>
              </div>
            </div>

            {ordersLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                {orders.length === 0 ? t.empty : t.noResults}
              </p>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border-b pb-4 mb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="font-semibold text-lg">#{order.id} - {order.customer_name}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      <span className="font-medium text-black">{order.product}</span>
                      {order.color ? " • " + order.color : ""}
                      {" • Size " + order.size}
                      {order.city ? " • " + order.city : ""}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {order.price ? "Price: " + order.price + " • " : ""}
                      <span dir="ltr">{order.phone}</span>
                    </p>
                  </div>

                  <div className={"flex flex-col gap-2 " + (isRtl ? "md:items-start" : "md:items-end")}>
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="text-xs border px-2 py-1 rounded hover:bg-gray-50 transition w-full md:w-fit outline-none cursor-pointer font-semibold" dir={isRtl ? "rtl" : "ltr"}><option value="Pending">{t.statusMap.Pending}</option><option value="Shipped">{t.statusMap.Shipped}</option><option value="Delivered">{t.statusMap.Delivered}</option><option value="Cancelled">{t.statusMap.Cancelled}</option></select>

                      <div className="flex gap-2">
                        <button onClick={() => setOrderToDelete(order.id)} className="text-xs bg-white text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition font-medium shadow-sm">
                          {t.deleteBtn}
                        </button>
                        <button onClick={() => generatePDF(order)} className="text-xs bg-[#c9a871] text-white px-3 py-1 rounded hover:bg-[#b08d55] transition font-medium shadow-sm">
                          {t.downloadInvoice}
                        </button>
                      </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 🔔 TOAST */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* 💎 DELETE CONFIRMATION MODAL */}
      {orderToDelete !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-[#f4f1ea] border border-[#c9a871]/30 p-8 rounded-sm shadow-2xl max-w-sm w-full text-center relative" dir={isRtl ? "rtl" : "ltr"}>
            <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "var(--font-playfair)", color: "#2c2c2c" }}>
              {t.deleteTitle}
            </h3>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              {t.confirmDelete}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-6 py-2 text-sm font-medium border border-gray-400 text-gray-700 rounded-sm hover:bg-gray-100 transition"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={executeDelete}
                className="px-6 py-2 text-sm font-medium bg-red-600 text-white rounded-sm hover:bg-red-700 transition shadow-sm"
              >
                {t.deleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧾 INVOICE (unchanged from original) */}
      {invoiceData && (
        <div className="fixed top-[-9999px] left-[-9999px]">
          <div ref={invoiceRef} className="p-12 w-[800px] text-[#2c2c2c] relative" style={{ backgroundColor: "#f4f1ea" }} dir={isRtl ? "rtl" : "ltr"}>
            <div className="absolute inset-4 border border-[#c9a871] opacity-50 pointer-events-none rounded-sm"></div>
            <div className="relative z-10">
              <div className="text-center mb-10 border-b border-[#c9a871] pb-8">
                <h1 className="text-5xl font-extrabold tracking-[0.2em] mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#c9a871", direction: "ltr" }}>AMINA</h1>
                <p className="text-[#c9a871] tracking-[0.3em] text-sm uppercase font-semibold" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "var(--font-playfair)" }}>
                  {t.tagline}
                </p>
              </div>

              <div className="flex justify-between items-center mb-10">
                <div></div>
                <div className={isRtl ? "text-left" : "text-right"}>
                  <h2 className="text-2xl font-light tracking-[0.2em] mb-2 text-gray-500 uppercase" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "inherit" }}>{t.invoiceTitle}</h2>
                  <p className="text-sm font-bold tracking-wider" dir="ltr">#{invoiceData.id}</p>
                  <p className="text-xs text-gray-500 mt-1" dir="ltr">{new Date(invoiceData.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-12 bg-white/50 p-6 rounded-sm border border-[#c9a871]/20">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "inherit" }}>{t.billedTo}:</p>
                <p className="text-xl font-semibold mb-1" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "var(--font-playfair)" }}>{invoiceData.customer_name}</p>
                <p className="text-gray-600 text-sm" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "inherit" }}>{invoiceData.city}</p>
                <p className="text-gray-600 text-sm mt-1 tracking-wider" dir="ltr">{invoiceData.phone}</p>
              </div>

              <table className="w-full mb-16 border-collapse">
                <thead>
                  <tr className="border-b border-[#c9a871] uppercase tracking-widest text-[10px]" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "inherit" }}>
                    <th className={`py-4 text-gray-500 w-1/2 ${isRtl ? 'text-right' : 'text-left'}`}>{t.itemDesc}</th>
                    <th className="py-4 text-gray-500 text-center">{t.color}</th>
                    <th className="py-4 text-gray-500 text-center">{t.size}</th>
                    <th className={`py-4 text-gray-500 ${isRtl ? 'text-left' : 'text-right'}`}>{t.price}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200/50">
                    <td className={`py-6 font-medium text-lg ${isRtl ? 'text-right' : 'text-left'}`} style={{ fontFamily: isRtl ? "Arial, sans-serif" : "var(--font-playfair)" }}>
                      {invoiceData.product || t.fallbackProd}
                    </td>
                    <td className="py-6 text-center text-sm" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "inherit" }}>{invoiceData.color || "-"}</td>
                    <td className="py-6 text-center font-bold text-sm" dir="ltr">{invoiceData.size}</td>
                    <td className={`py-6 font-semibold text-lg ${isRtl ? 'text-left' : 'text-right'}`} dir="ltr">{invoiceData.price || "-"}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-end mb-16">
                <div className="text-gray-500 text-sm italic" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "var(--font-playfair)" }}>
                  {t.footerMsg1}<br/>{t.footerMsg2}
                </div>
                <div className={`bg-white p-6 shadow-sm border border-[#c9a871]/30 rounded-sm ${isRtl ? 'text-left' : 'text-right'}`}>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "inherit" }}>{t.totalMAD}</p>
                  <p className="text-3xl font-bold" style={{ color: "#c9a871" }} dir="ltr">{invoiceData.price || "TBD"}</p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-6 pt-6 border-t border-[#c9a871]/40 text-xs text-gray-500 tracking-wider">
                <span className="flex items-center gap-2" dir="ltr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  @aminaclothingbrand
                </span>
                <span>•</span>
                <span dir="ltr">aminaclothing.shop</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}