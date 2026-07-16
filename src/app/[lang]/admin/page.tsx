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

// 🔒 Password comes from env, not hardcoded in the bundle logic.
// Add NEXT_PUBLIC_ADMIN_PASSWORD=yourpassword to .env.local
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

// 🌍 Smart Dictionary
const translations = {
  en: {
    title: "ORDER MANAGEMENT PANEL",
    total: "Total Orders",
    pending: "Pending",
    delivered: "Delivered",
    addBtn: "Add New Order",
    name: "Customer Name *",
    wa: "WhatsApp Number",
    prod: "Product Name",
    color: "Color",
    size: "Size",
    city: "City / Address",
    price: "Price (MAD)",
    save: "SAVE ORDER",
    saving: "SAVING...",
    recent: "Recent Orders",
    empty: "No orders yet.",
    invoiceTitle: "INVOICE",
    billedTo: "Billed To",
    itemDesc: "Item Description",
    totalMAD: "Total Amount",
    tagline: "Elegant Moroccan Luxury",
    fallbackProd: "Luxury Apparel",
    footerMsg1: "Thank you for choosing AMINA.",
    footerMsg2: "Wear your elegance with pride.",
    downloadInvoice: "Invoice",
    deleteBtn: "Delete",
    deleteTitle: "Delete Order",
    cancelBtn: "Cancel",
    confirmDelete: "Are you sure you want to delete this order? This action cannot be undone.",
    statusMap: { Pending: "Pending", Shipped: "Shipped", Delivered: "Delivered", Cancelled: "Cancelled" },
    search: "Search orders...",
    allStatus: "All Statuses",
    exportCSV: "Export CSV",
    analytics: "Analytics",
    totalRevenue: "Total Revenue",
    avgOrder: "Avg. Order Value",
    topProduct: "Top Product",
    monthlyRevenue: "Revenue by Month",
    noResults: "No orders match your search.",
    wrongPassword: "Wrong password",
    deleteError: "Error deleting order. Please try again.",
    na: "N/A",
    live: "Live",
    lastUpdated: "Updated",
    justNow: "just now",
    secAgo: "s ago",
    minAgo: "m ago",
    unlock: "Unlock Panel",
    restricted: "Restricted Access",
    masterPass: "Enter Master Password",
  },
  fr: {
    title: "PANNEAU DE GESTION",
    total: "Total",
    pending: "En attente",
    delivered: "Livré",
    addBtn: "Ajouter une Commande",
    name: "Nom du Client *",
    wa: "Numéro WhatsApp",
    prod: "Nom du Produit",
    color: "Couleur",
    size: "Taille",
    city: "Ville / Adresse",
    price: "Prix (MAD)",
    save: "ENREGISTRER",
    saving: "ENREGISTREMENT...",
    recent: "Commandes Récentes",
    empty: "Aucune commande pour le moment.",
    invoiceTitle: "FACTURE",
    billedTo: "Facturé à",
    itemDesc: "Description de l'article",
    totalMAD: "Montant total",
    tagline: "Luxe marocain élégant",
    fallbackProd: "Article de Luxe",
    footerMsg1: "Merci pour votre confiance.",
    footerMsg2: "Portez votre élégance avec fierté.",
    downloadInvoice: "Facture",
    deleteBtn: "Supprimer",
    deleteTitle: "Supprimer la commande",
    cancelBtn: "Annuler",
    confirmDelete: "Voulez-vous vraiment supprimer cette commande ? Cette action est irréversible.",
    statusMap: { Pending: "En attente", Shipped: "Expédié", Delivered: "Livré", Cancelled: "Annulé" },
    search: "Rechercher des commandes...",
    allStatus: "Tous les statuts",
    exportCSV: "Exporter CSV",
    analytics: "Statistiques",
    totalRevenue: "Revenu total",
    avgOrder: "Panier moyen",
    topProduct: "Produit populaire",
    monthlyRevenue: "Revenu par mois",
    noResults: "Aucune commande ne correspond à votre recherche.",
    wrongPassword: "Mot de passe incorrect",
    deleteError: "Erreur lors de la suppression. Réessayez.",
    na: "N/A",
    live: "En direct",
    lastUpdated: "Mis à jour",
    justNow: "à l'instant",
    secAgo: "s",
    minAgo: "min",
    unlock: "Déverrouiller",
    restricted: "Accès restreint",
    masterPass: "Entrez le mot de passe",
  },
  ar: {
    title: "لوحة إدارة الطلبات",
    total: "إجمالي الطلبات",
    pending: "قيد الانتظار",
    delivered: "تم التوصيل",
    addBtn: "إضافة طلب جديد",
    name: "اسم العميل *",
    wa: "رقم الواتساب",
    prod: "اسم المنتج",
    color: "اللون",
    size: "المقاس",
    city: "المدينة / العنوان",
    price: "السعر (درهم مغربي)",
    save: "حفظ الطلب",
    saving: "جاري الحفظ...",
    recent: "الطلبات الأخيرة",
    empty: "لا توجد طلبات بعد.",
    invoiceTitle: "فاتورة",
    billedTo: "فاتورة لـ",
    itemDesc: "وصف الصنف",
    totalMAD: "الإجمالي",
    tagline: "فخامة مغربية أنيقة",
    fallbackProd: "ملابس فاخرة",
    footerMsg1: "شكراً لثقتكم في أمينة.",
    footerMsg2: "ارتدي أناقتك بكل فخر.",
    downloadInvoice: "الفاتورة",
    deleteBtn: "حذف",
    deleteTitle: "حذف الطلب",
    cancelBtn: "إلغاء",
    confirmDelete: "هل أنت متأكد أنك تريد حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.",
    statusMap: { Pending: "قيد الانتظار", Shipped: "تم الشحن", Delivered: "تم التوصيل", Cancelled: "ملغي" },
    search: "البحث في الطلبات...",
    allStatus: "كل الحالات",
    exportCSV: "تصدير CSV",
    analytics: "التحليلات",
    totalRevenue: "إجمالي الإيرادات",
    avgOrder: "متوسط قيمة الطلب",
    topProduct: "المنتج الأكثر مبيعاً",
    monthlyRevenue: "الإيرادات الشهرية",
    noResults: "لا توجد طلبات مطابقة لبحثك.",
    wrongPassword: "كلمة مرور خاطئة",
    deleteError: "خطأ أثناء الحذف. حاول مرة أخرى.",
    na: "غير متوفر",
    live: "مباشر",
    lastUpdated: "آخر تحديث",
    justNow: "الآن",
    secAgo: "ث",
    minAgo: "د",
    unlock: "فتح اللوحة",
    restricted: "وصول مقيد",
    masterPass: "أدخل كلمة المرور الرئيسية",
  },
};

// Small helper: parse "450 MAD" / "450" -> 450
function parsePrice(priceStr: string | undefined | null): number {
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

// Smooth count-up for stat numbers — small automatic polish, no extra deps
function useCountUp(value: number, duration = 700) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return display;
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
        "fixed bottom-6 right-6 z-[100] px-5 py-3.5 rounded-xl text-sm font-medium text-white backdrop-blur-xl border animate-toast-in " +
        (type === "error"
          ? "bg-red-500/90 border-red-400/40 shadow-[0_8px_30px_rgba(220,38,38,0.45)]"
          : "bg-gradient-to-br from-[#d4af6a] to-[#a3823f] border-[#e8cd94]/40 shadow-[0_8px_30px_rgba(212,175,106,0.45)]")
      }
    >
      {message}
    </div>
  );
}

function StatusPill({ status, label }: { status: string; label: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-400/10 text-amber-300 border-amber-400/30",
    Shipped: "bg-sky-400/10 text-sky-300 border-sky-400/30",
    Delivered: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
    Cancelled: "bg-red-400/10 text-red-300 border-red-400/30",
  };
  return (
    <span className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border " + (styles[status] || styles.Pending)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
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

  // ⚡ Live sync status (automatic realtime updates)
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  // 📡 Realtime subscription — orders sync automatically across devices, no manual refresh
  useEffect(() => {
    if (!isAuthenticated) return;
    const channel = supabase
      .channel("orders-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        setLastUpdated(new Date());
        if (payload.eventType === "INSERT") {
          setOrders((prev) => (prev.some((o) => o.id === (payload.new as any).id) ? prev : [payload.new, ...prev]));
        } else if (payload.eventType === "UPDATE") {
          setOrders((prev) => prev.map((o) => (o.id === (payload.new as any).id ? payload.new : o)));
        } else if (payload.eventType === "DELETE") {
          setOrders((prev) => prev.filter((o) => o.id !== (payload.old as any).id));
        }
      })
      .subscribe((status) => setIsLive(status === "SUBSCRIBED"));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Relative-time ticker for "Updated Xs ago"
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const relativeUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    const diff = Math.max(0, Math.floor((nowTick - lastUpdated.getTime()) / 1000));
    if (diff < 3) return t.justNow;
    if (diff < 60) return diff + t.secAgo;
    return Math.floor(diff / 60) + t.minAgo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowTick, lastUpdated]);

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
    setLastUpdated(new Date());
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
      setToast({ message: "Order saved", type: "success" });
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

  const totalCount = useCountUp(orders.length);
  const pendingCount = useCountUp(orders.filter((o) => o.status === "Pending").length);
  const deliveredCount = useCountUp(orders.filter((o) => o.status === "Delivered").length);
  const revenueCount = useCountUp(analytics.totalRevenue);
  const avgCount = useCountUp(analytics.avgOrder);

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

  const goldGradText = "bg-gradient-to-r from-[#f3dfa8] via-[#d4af6a] to-[#a3823f] bg-clip-text text-transparent";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0908] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#d4af6a]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#d4af6a]/10 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d4af6a 1px, transparent 0)", backgroundSize: "26px 26px" }}
        />
        <form
          onSubmit={handleLogin}
          className="relative z-10 w-full max-w-sm rounded-2xl border border-[#d4af6a]/20 bg-white/[0.03] backdrop-blur-2xl p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <div className="mx-auto mb-5 w-14 h-14 rounded-full border border-[#d4af6a]/30 flex items-center justify-center bg-gradient-to-b from-white/[0.06] to-transparent">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af6a" strokeWidth="1.5"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 className={"text-3xl font-bold tracking-[0.3em] mb-2 " + goldGradText} style={{ fontFamily: "var(--font-playfair)" }}>AMINA</h1>
          <p className="text-xs text-[#a89e8e] mb-8 uppercase tracking-[0.25em]">{t.restricted}</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder={t.masterPass}
            className="w-full bg-white/[0.04] border border-white/10 text-[#f5efe4] placeholder:text-[#6b6459] p-3.5 rounded-xl text-center tracking-widest focus:outline-none focus:border-[#d4af6a]/60 focus:bg-white/[0.06] transition-all mb-4"
          />
          {loginError && <p className="text-red-400 text-xs mb-4">{loginError}</p>}
          <button
            type="submit"
            className="relative w-full overflow-hidden bg-gradient-to-r from-[#e8cd94] via-[#d4af6a] to-[#a3823f] text-[#1a1410] py-3.5 rounded-xl font-bold tracking-[0.2em] text-sm uppercase shadow-[0_10px_30px_rgba(212,175,106,0.35)] hover:shadow-[0_14px_40px_rgba(212,175,106,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            {t.unlock}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0908] text-[#f5efe4] relative" dir={isRtl ? "rtl" : "ltr"}>
      {/* ambient glow背景 */}
      <div className="pointer-events-none fixed -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-[#d4af6a]/[0.06] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#d4af6a]/[0.05] blur-[140px]" />

      <div className="relative max-w-7xl mx-auto p-4 md:p-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={"text-3xl md:text-4xl font-bold tracking-[0.25em] mb-1.5 " + goldGradText} style={{ fontFamily: "var(--font-playfair)" }}>AMINA</h1>
            <p className="text-xs text-[#a89e8e] tracking-[0.2em] uppercase">{t.title}</p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl text-xs text-[#a89e8e]">
            <span className={"w-2 h-2 rounded-full " + (isLive ? "bg-emerald-400 animate-pulse-dot" : "bg-[#6b6459]")} />
            <span className="font-medium text-[#d8cfc0]">{isLive ? t.live : "…"}</span>
            {relativeUpdated && <span className="opacity-70">· {t.lastUpdated} {relativeUpdated}</span>}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6">
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 md:p-6 text-center overflow-hidden hover:border-[#d4af6a]/30 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af6a]/50 to-transparent" />
            <p className="text-[11px] md:text-xs text-[#a89e8e] uppercase tracking-widest">{t.total}</p>
            <p className="text-2xl md:text-4xl font-bold mt-2 text-[#f5efe4]">{Math.round(totalCount)}</p>
          </div>
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 md:p-6 text-center overflow-hidden hover:border-amber-400/30 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <p className="text-[11px] md:text-xs text-amber-300/80 uppercase tracking-widest">{t.pending}</p>
            <p className="text-2xl md:text-4xl font-bold mt-2 text-amber-300">{Math.round(pendingCount)}</p>
          </div>
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 md:p-6 text-center overflow-hidden hover:border-emerald-400/30 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
            <p className="text-[11px] md:text-xs text-emerald-300/80 uppercase tracking-widest">{t.delivered}</p>
            <p className="text-2xl md:text-4xl font-bold mt-2 text-emerald-300">{Math.round(deliveredCount)}</p>
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-lg font-semibold mb-6 pb-3 border-b border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#e8cd94] to-[#a3823f]" />
            {t.analytics}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl border border-[#d4af6a]/15 bg-gradient-to-br from-[#d4af6a]/[0.08] to-transparent p-4 text-center">
              <p className="text-[11px] text-[#a89e8e] uppercase tracking-widest">{t.totalRevenue}</p>
              <p className={"text-xl md:text-2xl font-bold mt-1.5 " + goldGradText}>{Math.round(revenueCount).toLocaleString()} MAD</p>
            </div>
            <div className="rounded-xl border border-[#d4af6a]/15 bg-gradient-to-br from-[#d4af6a]/[0.08] to-transparent p-4 text-center">
              <p className="text-[11px] text-[#a89e8e] uppercase tracking-widest">{t.avgOrder}</p>
              <p className={"text-xl md:text-2xl font-bold mt-1.5 " + goldGradText}>{Math.round(avgCount).toLocaleString()} MAD</p>
            </div>
            <div className="rounded-xl border border-[#d4af6a]/15 bg-gradient-to-br from-[#d4af6a]/[0.08] to-transparent p-4 text-center">
              <p className="text-[11px] text-[#a89e8e] uppercase tracking-widest">{t.topProduct}</p>
              <p className={"text-lg md:text-xl font-bold mt-1.5 truncate " + goldGradText}>{analytics.topProduct}</p>
            </div>
          </div>

          {analytics.monthlyData.length > 0 && (
            <div>
              <p className="text-[11px] text-[#a89e8e] uppercase tracking-widest mb-3">{t.monthlyRevenue}</p>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={analytics.monthlyData}>
                    <defs>
                      <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e8cd94" />
                        <stop offset="100%" stopColor="#a3823f" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#a89e8e" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#a89e8e" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value) => `${Number(value ?? 0).toLocaleString()} MAD`}
                      contentStyle={{ background: "#171310", border: "1px solid rgba(212,175,106,0.25)", borderRadius: 10, color: "#f5efe4" }}
                      cursor={{ fill: "rgba(212,175,106,0.06)" }}
                    />
                    <Bar dataKey="revenue" fill="url(#goldBar)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* NEW ORDER FORM */}
          <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 h-fit shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <h2 className="text-lg font-semibold mb-6 pb-3 border-b border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#e8cd94] to-[#a3823f]" />
              {t.addBtn}
            </h2>
            <form onSubmit={addOrder} className="space-y-4 text-sm">
              <div>
                <label className="block text-[#a89e8e] mb-1.5 text-xs uppercase tracking-wide">{t.name}</label>
                <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-white/[0.04] border border-white/10 text-[#f5efe4] p-2.5 rounded-lg focus:outline-none focus:border-[#d4af6a]/60 focus:bg-white/[0.06] transition-all" />
              </div>
              <div>
                <label className="block text-[#a89e8e] mb-1.5 text-xs uppercase tracking-wide">{t.wa}</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/[0.04] border border-white/10 text-[#f5efe4] p-2.5 rounded-lg focus:outline-none focus:border-[#d4af6a]/60 focus:bg-white/[0.06] transition-all" dir="ltr" />
              </div>
              <div>
                <label className="block text-[#a89e8e] mb-1.5 text-xs uppercase tracking-wide">{t.prod}</label>
                <input list="products" type="text" value={product} onChange={(e) => setProduct(e.target.value)} className="w-full bg-white/[0.04] border border-white/10 text-[#f5efe4] p-2.5 rounded-lg focus:outline-none focus:border-[#d4af6a]/60 focus:bg-white/[0.06] transition-all" />
                <datalist id="products"><option value="Black Abaya" /><option value="Beige Kaftan" /></datalist>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a89e8e] mb-1.5 text-xs uppercase tracking-wide">{t.color}</label>
                  <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-white/[0.04] border border-white/10 text-[#f5efe4] p-2.5 rounded-lg focus:outline-none focus:border-[#d4af6a]/60 focus:bg-white/[0.06] transition-all" />
                </div>
                <div>
                  <label className="block text-[#a89e8e] mb-1.5 text-xs uppercase tracking-wide">{t.size}</label>
                  <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full bg-white/[0.04] border border-white/10 text-[#f5efe4] p-2.5 rounded-lg focus:outline-none focus:border-[#d4af6a]/60 transition-all" dir="ltr">
                    <option className="bg-[#171310]">S</option><option className="bg-[#171310]">M</option><option className="bg-[#171310]">L</option><option className="bg-[#171310]">XL</option><option className="bg-[#171310]">XXL</option><option className="bg-[#171310]">XXXL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#a89e8e] mb-1.5 text-xs uppercase tracking-wide">{t.price}</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/[0.04] border border-white/10 text-[#f5efe4] p-2.5 rounded-lg focus:outline-none focus:border-[#d4af6a]/60 focus:bg-white/[0.06] transition-all" placeholder="e.g. 450" dir="ltr" />
              </div>
              <div>
                <label className="block text-[#a89e8e] mb-1.5 text-xs uppercase tracking-wide">{t.city}</label>
                <textarea value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-white/[0.04] border border-white/10 text-[#f5efe4] p-2.5 rounded-lg focus:outline-none focus:border-[#d4af6a]/60 focus:bg-white/[0.06] transition-all" rows={2}></textarea>
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-[#e8cd94] via-[#d4af6a] to-[#a3823f] text-[#1a1410] py-3.5 mt-2 rounded-xl font-bold tracking-[0.15em] text-sm uppercase shadow-[0_10px_30px_rgba(212,175,106,0.3)] hover:shadow-[0_14px_38px_rgba(212,175,106,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 transition-all"
              >
                {loading ? t.saving : t.save}
              </button>
            </form>
          </div>

          {/* ORDERS LIST */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#e8cd94] to-[#a3823f]" />
                {t.recent}
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search}
                  className="bg-white/[0.04] border border-white/10 text-[#f5efe4] placeholder:text-[#6b6459] p-2 rounded-lg text-sm focus:outline-none focus:border-[#d4af6a]/60 transition-all w-full sm:w-48"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/[0.04] border border-white/10 text-[#f5efe4] p-2 rounded-lg text-sm focus:outline-none focus:border-[#d4af6a]/60 transition-all"
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <option className="bg-[#171310]" value="All">{t.allStatus}</option>
                  <option className="bg-[#171310]" value="Pending">{t.statusMap.Pending}</option>
                  <option className="bg-[#171310]" value="Shipped">{t.statusMap.Shipped}</option>
                  <option className="bg-[#171310]" value="Delivered">{t.statusMap.Delivered}</option>
                  <option className="bg-[#171310]" value="Cancelled">{t.statusMap.Cancelled}</option>
                </select>
                <button
                  onClick={exportCSV}
                  className="text-sm bg-white/[0.06] border border-white/10 text-[#e8cd94] px-3.5 py-2 rounded-lg hover:bg-white/[0.1] hover:border-[#d4af6a]/40 transition-all font-medium whitespace-nowrap"
                >
                  {t.exportCSV}
                </button>
              </div>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-white/[0.03] animate-shimmer" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="text-[#a89e8e] text-sm text-center py-12">
                {orders.length === 0 ? t.empty : t.noResults}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="group rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.045] hover:border-[#d4af6a]/25 p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all duration-200">
                    <div>
                      <p className="font-semibold text-base text-[#f5efe4]">#{order.id} — {order.customer_name}</p>
                      <p className="text-[#a89e8e] text-sm mt-1">
                        <span className="font-medium text-[#d8cfc0]">{order.product}</span>
                        {order.color ? " • " + order.color : ""}
                        {" • Size " + order.size}
                        {order.city ? " • " + order.city : ""}
                      </p>
                      <p className="text-xs text-[#8c8375] mt-1 font-medium">
                        {order.price ? <span className="text-[#d4af6a]">{order.price}</span> : ""}
                        {order.price ? " • " : ""}
                        <span dir="ltr">{order.phone}</span>
                      </p>
                    </div>

                    <div className={"flex flex-col gap-2 " + (isRtl ? "md:items-start" : "md:items-end")}>
                      <div className="flex items-center gap-2">
                        <StatusPill status={order.status} label={(t.statusMap as any)[order.status] || order.status} />
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-xs bg-white/[0.04] border border-white/10 text-[#a89e8e] px-2 py-1 rounded-md hover:border-[#d4af6a]/40 transition-all outline-none cursor-pointer"
                          dir={isRtl ? "rtl" : "ltr"}
                        >
                          <option className="bg-[#171310]" value="Pending">{t.statusMap.Pending}</option>
                          <option className="bg-[#171310]" value="Shipped">{t.statusMap.Shipped}</option>
                          <option className="bg-[#171310]" value="Delivered">{t.statusMap.Delivered}</option>
                          <option className="bg-[#171310]" value="Cancelled">{t.statusMap.Cancelled}</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => setOrderToDelete(order.id)} className="text-xs bg-red-500/10 text-red-300 border border-red-400/25 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all font-medium">
                          {t.deleteBtn}
                        </button>
                        <button onClick={() => generatePDF(order)} className="text-xs bg-gradient-to-r from-[#e8cd94] to-[#a3823f] text-[#1a1410] px-3 py-1.5 rounded-lg hover:shadow-[0_6px_18px_rgba(212,175,106,0.4)] transition-all font-semibold">
                          {t.downloadInvoice}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔔 TOAST */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* 💎 DELETE CONFIRMATION MODAL */}
      {orderToDelete !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-[#151110] border border-[#d4af6a]/20 p-8 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.6)] max-w-sm w-full text-center relative" dir={isRtl ? "rtl" : "ltr"}>
            <h3 className={"text-2xl font-bold mb-3 tracking-wider " + goldGradText} style={{ fontFamily: "var(--font-playfair)" }}>
              {t.deleteTitle}
            </h3>
            <p className="text-[#a89e8e] text-sm mb-8 leading-relaxed">
              {t.confirmDelete}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-6 py-2.5 text-sm font-medium border border-white/15 text-[#d8cfc0] rounded-xl hover:bg-white/5 transition-all"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={executeDelete}
                className="px-6 py-2.5 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all shadow-[0_8px_24px_rgba(220,38,38,0.35)]"
              >
                {t.deleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧾 INVOICE — kept light & print-elegant, unchanged in structure */}
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

      <style jsx global>{`
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.55); }
          50% { box-shadow: 0 0 0 5px rgba(52, 211, 153, 0); }
        }
        .animate-pulse-dot { animation: pulseDot 2s infinite; }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-toast-in { animation: toastIn 0.25s ease-out; }

        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .animate-shimmer {
          background-image: linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.08) 40px, rgba(255,255,255,0.03) 80px);
          background-size: 800px 100%;
          animation: shimmer 1.6s infinite linear;
        }
      `}</style>
    </div>
  );
}