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

// 🌍 Translations
const translations = {
  en: { title: "BOUTIQUE ADMIN", ordersTab: "Orders", stockTab: "Stock Tracker", total: "Total Orders", pending: "Pending", delivered: "Delivered", addBtn: "Add New Order", name: "Customer Name *", wa: "WhatsApp Number", prod: "Product Name", color: "Color", size: "Size", city: "City / Address", price: "Price (MAD)", save: "SAVE ORDER", saving: "SAVING...", recent: "Recent Orders", empty: "No data available.", invoiceTitle: "INVOICE", billedTo: "Billed To", itemDesc: "Item Description", totalMAD: "Total Amount", tagline: "Elegant Moroccan Luxury", fallbackProd: "Luxury Apparel", footerMsg1: "Thank you for choosing AMINA.", footerMsg2: "Wear your elegance with pride.", downloadInvoice: "Invoice", deleteBtn: "Delete", deleteTitle: "Delete Entry", cancelBtn: "Cancel", confirmDelete: "Are you sure you want to delete this? This action cannot be undone.", statusMap: { Pending: "Pending", Shipped: "Shipped", Delivered: "Delivered", Cancelled: "Cancelled" }, search: "Search...", allStatus: "All Statuses", exportCSV: "Export CSV", analytics: "Analytics", totalRevenue: "Total Revenue", avgOrder: "Avg. Order Value", topProduct: "Top Product", monthlyRevenue: "Revenue by Month", noResults: "No results match your search.", wrongPassword: "Wrong password", deleteError: "Error deleting.", saveError: "Error saving: ", na: "N/A", live: "Live", lastUpdated: "Updated", justNow: "just now", secAgo: "s ago", minAgo: "m ago", unlock: "Unlock Panel", restricted: "Restricted Access", masterPass: "Enter Master Password", addStockBtn: "Add New Stock", stockName: "Dress / Collection Name *", stockQty: "Total Quantity *", stockCost: "Purchase Cost", stockSell: "Selling Price", stockDate: "Arrival Date", stockNotes: "Notes (Sizes, Supplier)", recentStock: "Current Inventory Logs", },
  fr: { title: "ADMIN BOUTIQUE", ordersTab: "Commandes", stockTab: "Inventaire", total: "Total", pending: "En attente", delivered: "Livré", addBtn: "Ajouter une Commande", name: "Nom du Client *", wa: "Numéro WhatsApp", prod: "Nom du Produit", color: "Couleur", size: "Taille", city: "Ville / Adresse", price: "Prix (MAD)", save: "ENREGISTRER", saving: "ENREGISTREMENT...", recent: "Récentes", empty: "Aucune donnée.", invoiceTitle: "FACTURE", billedTo: "Facturé à", itemDesc: "Description", totalMAD: "Montant total", tagline: "Luxe marocain", fallbackProd: "Article de Luxe", footerMsg1: "Merci pour votre confiance.", footerMsg2: "L'élégance avec fierté.", downloadInvoice: "Facture", deleteBtn: "Supprimer", deleteTitle: "Supprimer", cancelBtn: "Annuler", confirmDelete: "Voulez-vous vraiment supprimer ceci ?", statusMap: { Pending: "En attente", Shipped: "Expédié", Delivered: "Livré", Cancelled: "Annulé" }, search: "Rechercher...", allStatus: "Tous les statuts", exportCSV: "Exporter CSV", analytics: "Statistiques", totalRevenue: "Revenu total", avgOrder: "Panier moyen", topProduct: "Produit populaire", monthlyRevenue: "Revenu par mois", noResults: "Aucun résultat.", wrongPassword: "Mot de passe incorrect", deleteError: "Erreur.", saveError: "Erreur: ", na: "N/A", live: "En direct", lastUpdated: "Mis à jour", justNow: "à l'instant", secAgo: "s", minAgo: "min", unlock: "Entrer", restricted: "Accès restreint", masterPass: "Mot de passe", addStockBtn: "Ajouter au Stock", stockName: "Nom de la Robe *", stockQty: "Quantité *", stockCost: "Coût d'achat", stockSell: "Prix de vente", stockDate: "Date d'arrivée", stockNotes: "Notes", recentStock: "Inventaire Actuel", },
  ar: { title: "إدارة البوتيك", ordersTab: "الطلبات", stockTab: "المخزون", total: "إجمالي الطلبات", pending: "قيد الانتظار", delivered: "تم التوصيل", addBtn: "إضافة طلب", name: "اسم العميل *", wa: "رقم الواتساب", prod: "اسم المنتج", color: "اللون", size: "المقاس", city: "المدينة / العنوان", price: "السعر", save: "حفظ", saving: "جاري الحفظ...", recent: "الأحدث", empty: "لا توجد بيانات.", invoiceTitle: "فاتورة", billedTo: "فاتورة لـ", itemDesc: "الوصف", totalMAD: "الإجمالي", tagline: "فخامة مغربية", fallbackProd: "ملابس فاخرة", footerMsg1: "شكراً لثقتكم.", footerMsg2: "أناقة بفخر.", downloadInvoice: "الفاتورة", deleteBtn: "حذف", deleteTitle: "تأكيد الحذف", cancelBtn: "إلغاء", confirmDelete: "هل أنت متأكد من الحذف؟", statusMap: { Pending: "قيد الانتظار", Shipped: "تم الشحن", Delivered: "تم التوصيل", Cancelled: "ملغي" }, search: "البحث...", allStatus: "الكل", exportCSV: "تصدير CSV", analytics: "التحليلات", totalRevenue: "الإيرادات", avgOrder: "متوسط الطلب", topProduct: "الأكثر مبيعاً", monthlyRevenue: "الإيرادات الشهرية", noResults: "لا توجد نتائج.", wrongPassword: "كلمة مرور خاطئة", deleteError: "خطأ", saveError: "خطأ: ", na: "غير متوفر", live: "مباشر", lastUpdated: "محدث", justNow: "الآن", secAgo: "ث", minAgo: "د", unlock: "دخول", restricted: "وصول مقيد", masterPass: "كلمة المرور", addStockBtn: "إضافة مخزون", stockName: "اسم الفستان *", stockQty: "الكمية *", stockCost: "تكلفة الشراء", stockSell: "سعر البيع", stockDate: "تاريخ الوصول", stockNotes: "ملاحظات", recentStock: "سجل المخزون", }
};

function parsePrice(priceStr: string | undefined | null): number {
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, "");
  return isNaN(parseFloat(cleaned)) ? 0 : parseFloat(cleaned);
}

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
  }, [value]);
  return display;
}

function Toast({ message, type, onClose }: { message: string; type: "error" | "success"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl text-sm font-semibold backdrop-blur-2xl border animate-toast-in max-w-md shadow-2xl ${type === "error" ? "bg-red-50/90 text-red-700 border-red-200" : "bg-white/90 text-[#1C1917] border-white"}`}>
      <div className="flex items-center gap-4">
        {type === "success" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
        {type === "error" && <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />}
        <span className="tracking-wide">{message}</span>
      </div>
    </div>
  );
}

function StatusPill({ status, label }: { status: string; label: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Shipped: "bg-sky-50 text-sky-700 border-sky-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${styles[status] || styles.Pending}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current shadow-sm" />
      {label}
    </span>
  );
}

export default function AdminDashboard({ params }: any) {
  const lang = params?.lang || "en";
  const t = translations[lang as keyof typeof translations] || translations.en;
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<"orders" | "stock">("orders");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("M");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  const [stockName, setStockName] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [stockCost, setStockCost] = useState("");
  const [stockSell, setStockSell] = useState("");
  const [stockDate, setStockDate] = useState("");
  const [stockNotes, setStockNotes] = useState("");
  const [stocks, setStocks] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [invoiceData, setInvoiceData] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => { if (isAuthenticated) fetchOrders(); }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const channel = supabase.channel("orders-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        setLastUpdated(new Date());
        if (payload.eventType === "INSERT") setOrders((prev) => (prev.some((o) => o.id === (payload.new as any).id) ? prev : [payload.new, ...prev]));
        else if (payload.eventType === "UPDATE") setOrders((prev) => prev.map((o) => (o.id === (payload.new as any).id ? payload.new : o)));
        else if (payload.eventType === "DELETE") setOrders((prev) => prev.filter((o) => o.id !== (payload.old as any).id));
      }).subscribe((status) => setIsLive(status === "SUBSCRIBED"));
    return () => { supabase.removeChannel(channel); };
  }, [isAuthenticated]);

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
  }, [nowTick, lastUpdated, t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/get-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: passwordInput }) });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setIsAuthenticated(true);
      } else { setLoginError(t.wrongPassword); }
    } catch (err) { setLoginError(t.wrongPassword); }
  };

  async function fetchOrders() {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/get-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: passwordInput }) });
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (error) {}
    setLastUpdated(new Date());
    setOrdersLoading(false);
  }

  async function addOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formattedPrice = price.toLowerCase().includes("mad") ? price : price + " MAD";
    try {
      const res = await fetch("/api/add-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_name: customerName, phone, product, color, size, city, price: formattedPrice, status: "Pending" }) });
      if (res.ok) {
        setCustomerName(""); setPhone(""); setProduct(""); setColor(""); setCity(""); setPrice("");
        fetchOrders(); setToast({ message: "Order saved successfully!", type: "success" });
      } else {
        const errorData = await res.json();
        setToast({ message: `${t.saveError} ${errorData.error || "Unknown"}`, type: "error" }); 
      }
    } catch (error: any) { setToast({ message: `${t.saveError} ${error.message}`, type: "error" }); }
    setLoading(false);
  }

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const newStock = { id: Date.now(), name: stockName, qty: stockQty, cost: stockCost, sell: stockSell, date: stockDate || new Date().toLocaleDateString(), notes: stockNotes };
    setStocks([newStock, ...stocks]);
    setToast({ message: "Stock entry saved successfully!", type: "success" });
    setStockName(""); setStockQty(""); setStockCost(""); setStockSell(""); setStockNotes("");
  };

  async function updateStatus(id: number, newStatus: string) {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      const res = await fetch("/api/update-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) });
      if (!res.ok) fetchOrders(); 
      else setToast({ message: "Status updated successfully!", type: "success" });
    } catch (error) { fetchOrders(); }
  }

  async function executeDelete() {
    if (orderToDelete === null) return;
    const id = orderToDelete;
    setOrderToDelete(null);
    setOrders(orders.filter(o => o.id !== id)); 
    try {
      const res = await fetch("/api/delete-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (!res.ok) { setToast({ message: t.deleteError, type: "error" }); fetchOrders(); } 
      else { setToast({ message: "Deleted successfully!", type: "success" }); }
    } catch (error) { fetchOrders(); }
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
        pdf.save(`AMINA_Invoice_${order.id}.pdf`);
        setInvoiceData(null);
      }
    }, 800);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      if (!matchesStatus) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return ((o.customer_name || "").toLowerCase().includes(q) || (o.phone || "").toLowerCase().includes(q) || (o.product || "").toLowerCase().includes(q) || (o.city || "").toLowerCase().includes(q));
    });
  }, [orders, searchQuery, statusFilter]);

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
    const monthlyData = Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue })).slice(-6);
    return { totalRevenue, avgOrder, topProduct, monthlyData };
  }, [orders, t.fallbackProd, t.na]);

  const totalCount = useCountUp(orders.length);
  const pendingCount = useCountUp(orders.filter((o) => o.status === "Pending").length);
  const deliveredCount = useCountUp(orders.filter((o) => o.status === "Delivered").length);
  const revenueCount = useCountUp(analytics.totalRevenue);
  const avgCount = useCountUp(analytics.avgOrder);

  function exportCSV() {
    const headers = ["ID", "Customer", "Phone", "Product", "Color", "Size", "City", "Price", "Status", "Date"];
    const rows = filteredOrders.map((o) => [
      o.id, o.customer_name, o.phone, o.product, o.color, o.size, o.city, o.price, o.status,
      o.created_at ? new Date(o.created_at).toLocaleDateString() : "",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AMINA_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ✨ TRUE LIGHT LUXURY CLASSES
  const textDark = "text-[#2c2621]"; 
  const textMuted = "text-[#8c8273]";
  const accentColor = "text-[#c39b57]";
  
  // Real frosted white glass over pastel ambient glows
  const glassCardClass = "relative rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden";
  const inputClass = "w-full bg-white/60 border border-white/80 text-[#2c2621] placeholder:text-[#2c2621]/40 p-4 rounded-2xl focus:outline-none focus:border-[#c39b57] focus:bg-white/90 transition-all backdrop-blur-md shadow-sm font-medium text-sm";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#Faf9f6] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Soft Ambient Pearl Glows */}
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-[#FCE7F3]/40 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] bg-[#FEF3C7]/40 rounded-full blur-[120px]"></div>
        
        <form
          onSubmit={handleLogin}
          className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-white/80 bg-white/50 backdrop-blur-3xl p-10 md:p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
        >
          <div className="mx-auto mb-6 w-16 h-16 rounded-full border border-white flex items-center justify-center bg-white/80 shadow-sm">
            <span className={`text-2xl font-semibold ${accentColor}`} style={{ fontFamily: "var(--font-playfair)" }}>A</span>
          </div>
          <h1 className={`text-3xl font-light tracking-[0.25em] mb-2 ${textDark}`} style={{ fontFamily: "var(--font-playfair)" }}>AMINA</h1>
          <p className={`text-[10px] ${textMuted} mb-10 uppercase tracking-[0.3em] font-semibold`}>{t.restricted}</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder={t.masterPass}
            className={`${inputClass} text-center tracking-[0.3em] mb-8 text-base`}
          />
          {loginError && <p className="text-red-600 text-xs mb-6 font-semibold bg-red-50/80 py-2 rounded-xl border border-red-100">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-[#2c2621] text-white py-4 rounded-2xl font-bold tracking-[0.15em] text-[11px] uppercase shadow-[0_10px_20px_rgba(44,38,33,0.15)] hover:shadow-[0_15px_30px_rgba(44,38,33,0.25)] hover:-translate-y-1 transition-all duration-300"
          >
            {t.unlock}
          </button>
        </form>
      </div>
    );
  }

  return (
    // ✨ FIX: pt-32 adds padding top so the global navbar doesn't cover our header!
    <div className="min-h-screen bg-[#Faf9f6] text-[#2c2621] relative font-sans selection:bg-[#c39b57]/20 pt-32 pb-12" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* 🔮 LIGHT EDITORIAL MESH BACKGROUNDS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[50vw] h-[50vw] bg-[#FCE7F3]/30 rounded-full blur-[140px]" /> 
        <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] bg-[#FEF3C7]/40 rounded-full blur-[150px]" /> 
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-[#F3F4F6]/60 rounded-full blur-[160px]" /> 
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        
        {/* TOP NAVIGATION BAR FOR ADMIN */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/40 border border-white/60 p-4 px-6 md:p-5 md:px-8 rounded-full backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
               <span className={`font-semibold text-lg ${accentColor}`} style={{ fontFamily: "var(--font-playfair)" }}>A</span>
            </div>
            <div>
              <h1 className={`text-xl font-medium tracking-[0.2em] ${textDark}`} style={{ fontFamily: "var(--font-playfair)" }}>AMINA</h1>
              <p className={`text-[8px] ${textMuted} tracking-[0.25em] uppercase font-bold mt-0.5`}>Boutique Admin</p>
            </div>
          </div>

          {/* Minimalist Pill Tabs */}
          <div className="flex bg-white/50 backdrop-blur-xl border border-white/50 rounded-full p-1 shadow-sm">
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${activeTab === "orders" ? "bg-[#2c2621] text-white shadow-md" : `text-[#8c8273] hover:${textDark}`}`}
            >
              {t.ordersTab}
            </button>
            <button 
              onClick={() => setActiveTab("stock")}
              className={`px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${activeTab === "stock" ? "bg-[#2c2621] text-white shadow-md" : `text-[#8c8273] hover:${textDark}`}`}
            >
              {t.stockTab}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl text-[10px] text-[#8c8273] shadow-sm">
            <span className={"w-2 h-2 rounded-full " + (isLive ? "bg-emerald-500 animate-pulse-dot" : "bg-gray-300")} />
            <span className="font-bold tracking-wider uppercase">{isLive ? t.live : "..."}</span>
          </div>
        </div>

        {/* -------------------- ORDERS TAB -------------------- */}
        {activeTab === "orders" && (
          <div className="animate-fade-in">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: t.total, val: Math.round(totalCount), color: textDark },
                { label: t.pending, val: Math.round(pendingCount), color: "text-amber-600" },
                { label: t.delivered, val: Math.round(deliveredCount), color: "text-emerald-600" }
              ].map((kpi, idx) => (
                <div key={idx} className={`${glassCardClass} text-center flex flex-col justify-center items-center py-10 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500`}>
                  <p className={`text-[10px] ${textMuted} uppercase tracking-[0.25em] font-bold mb-3`}>{kpi.label}</p>
                  <p className={`text-5xl font-light tracking-wide ${kpi.color}`} style={{ fontFamily: "var(--font-playfair)" }}>{kpi.val}</p>
                </div>
              ))}
            </div>

            {/* ANALYTICS */}
            <div className={`${glassCardClass} mb-8`}>
              <div className="flex items-center gap-3 mb-6">
                <span className={`w-1.5 h-1.5 rounded-full bg-[#c39b57]`} />
                <h2 className={`text-[11px] font-bold tracking-[0.25em] uppercase ${textDark}`}>{t.analytics}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: t.totalRevenue, val: `${Math.round(revenueCount).toLocaleString()} MAD` },
                  { label: t.avgOrder, val: `${Math.round(avgCount).toLocaleString()} MAD` },
                  { label: t.topProduct, val: analytics.topProduct }
                ].map((stat, idx) => (
                  <div key={idx} className="rounded-2xl bg-white/60 p-5 shadow-sm border border-white/40">
                    <p className={`text-[9px] ${textMuted} uppercase tracking-[0.2em] font-bold mb-1.5`}>{stat.label}</p>
                    <p className={`text-2xl font-medium ${accentColor} truncate`} style={{ fontFamily: "var(--font-playfair)" }}>{stat.val}</p>
                  </div>
                ))}
              </div>

              {analytics.monthlyData.length > 0 && (
                <div>
                  <p className={`text-[9px] ${textMuted} uppercase tracking-[0.2em] font-bold mb-4`}>{t.monthlyRevenue}</p>
                  <div style={{ width: "100%", height: 220 }}>
                    <ResponsiveContainer>
                      <BarChart data={analytics.monthlyData}>
                        <defs>
                          <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d4af37" />
                            <stop offset="100%" stopColor="#AA8222" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8c8273", fontWeight: 600 }} axisLine={{ stroke: "rgba(0,0,0,0.05)" }} tickLine={false} dy={10} />
                        <YAxis tick={{ fontSize: 11, fill: "#8c8273", fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip
                          formatter={(value) => `${Number(value ?? 0).toLocaleString()} MAD`}
                          contentStyle={{ background: "#ffffff", border: "1px solid #f3f4f6", borderRadius: "12px", color: "#2c2621", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", padding: "10px 16px", fontSize: "12px", fontWeight: "600" }}
                          cursor={{ fill: "rgba(0,0,0,0.02)" }}
                        />
                        <Bar dataKey="revenue" fill="url(#goldBar)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* NEW ORDER FORM */}
              <div className={`lg:col-span-1 h-fit ${glassCardClass}`}>
                 <div className="flex items-center gap-3 mb-8">
                  <span className={`w-1.5 h-1.5 rounded-full bg-[#c39b57]`} />
                  <h2 className={`text-[11px] font-bold tracking-[0.25em] uppercase ${textDark}`}>{t.addBtn}</h2>
                </div>
                <form onSubmit={addOrder} className="space-y-5">
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.name}</label>
                    <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.wa}</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} dir="ltr" />
                  </div>
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.prod}</label>
                    <input list="products" type="text" value={product} onChange={(e) => setProduct(e.target.value)} className={inputClass} />
                    <datalist id="products"><option value="Black Abaya" /><option value="Beige Kaftan" /><option value="Emerald Silk Dress" /></datalist>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.color}</label>
                      <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.size}</label>
                      <select value={size} onChange={(e) => setSize(e.target.value)} className={inputClass + " cursor-pointer"} dir="ltr">
                        <option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.price}</label>
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="e.g. 450" dir="ltr" />
                  </div>
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.city}</label>
                    <textarea value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} rows={2}></textarea>
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#2c2621] text-white py-3.5 mt-2 rounded-xl font-bold tracking-[0.2em] text-[10px] uppercase shadow-[0_8px_20px_rgba(44,38,33,0.15)] hover:shadow-[0_12px_25px_rgba(44,38,33,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70"
                  >
                    {loading ? t.saving : t.save}
                  </button>
                </form>
              </div>

              {/* ORDERS LIST */}
              <div className={`lg:col-span-2 ${glassCardClass} !p-0`}>
                <div className="p-6 md:p-8 border-b border-white/50 bg-white/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2c2621]" />
                      <h2 className={`text-[11px] font-bold tracking-[0.25em] uppercase ${textDark}`}>{t.recent}</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.search}
                        className="bg-white/80 border border-white text-[#2c2621] placeholder:text-[#8c8273] px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#c39b57] transition-all w-full sm:w-48 shadow-sm"
                      />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/80 border border-white text-[#2c2621] px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-[#c39b57] transition-all cursor-pointer shadow-sm appearance-none"
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
                        className={`text-[10px] bg-white border border-gray-200 ${textDark} hover:bg-gray-50 px-5 py-2.5 rounded-xl transition-all font-bold tracking-widest uppercase shadow-sm`}
                      >
                        CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 rounded-2xl bg-white/40 animate-shimmer border border-white/50" />
                      ))}
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8c8273" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      </div>
                      <p className={`text-[10px] ${textMuted} tracking-[0.25em] uppercase font-bold`}>{orders.length === 0 ? t.empty : t.noResults}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pr-2 custom-scrollbar max-h-[700px] overflow-y-auto">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="group relative rounded-2xl border border-white/80 bg-white/60 hover:bg-white p-5 flex flex-col md:flex-row justify-between md:items-center gap-5 transition-all duration-300 shadow-sm hover:shadow-md">
                          <div>
                            <p className={`font-bold text-sm ${textDark} tracking-wide`}>#{order.id} <span className="opacity-20 mx-2">|</span> {order.customer_name}</p>
                            <p className={`text-[11px] mt-1.5 tracking-wide font-medium ${textMuted}`}>
                              <span className={textDark}>{order.product}</span>
                              {order.color ? " • " + order.color : ""}
                              {" • Sz " + order.size}
                              {order.city ? " • " + order.city : ""}
                            </p>
                            <p className="text-[10px] mt-2 font-bold tracking-widest uppercase">
                              {order.price ? <span className={accentColor}>{order.price}</span> : ""}
                              {order.price ? " • " : ""}
                              <span className={textMuted} dir="ltr">{order.phone}</span>
                            </p>
                          </div>

                          <div className={"flex flex-col gap-3 " + (isRtl ? "md:items-start" : "md:items-end")}>
                            <div className="flex items-center gap-3">
                              <StatusPill status={order.status} label={(t.statusMap as any)[order.status] || order.status} />
                              <select
                                value={order.status}
                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                className={`text-[9px] tracking-[0.15em] uppercase font-bold bg-white border border-gray-200 ${textDark} px-3 py-1.5 rounded-lg hover:border-[#c39b57] transition-all outline-none cursor-pointer appearance-none text-center shadow-sm`}
                                dir={isRtl ? "rtl" : "ltr"}
                              >
                                <option value="Pending">{t.statusMap.Pending}</option>
                                <option value="Shipped">{t.statusMap.Shipped}</option>
                                <option value="Delivered">{t.statusMap.Delivered}</option>
                                <option value="Cancelled">{t.statusMap.Cancelled}</option>
                              </select>
                            </div>

                            <div className="flex gap-2">
                              <button onClick={() => setOrderToDelete(order.id)} className="text-[9px] uppercase tracking-widest font-bold bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-100 transition-all">
                                {t.deleteBtn}
                              </button>
                              <button onClick={() => generatePDF(order)} className={`text-[9px] uppercase tracking-widest font-bold bg-gray-50 ${textDark} border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all`}>
                                PDF
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
          </div>
        )}

        {/* -------------------- STOCK TRACKER TAB -------------------- */}
        {activeTab === "stock" && (
          <div className="animate-fade-in grid lg:grid-cols-3 gap-8">
            
            <div className={`lg:col-span-1 h-fit ${glassCardClass}`}>
              <div className="flex items-center gap-3 mb-8">
                <span className={`w-1.5 h-1.5 rounded-full bg-[#c39b57]`} />
                <h2 className={`text-[11px] font-bold tracking-[0.25em] uppercase ${textDark}`}>{t.addStockBtn}</h2>
              </div>
              <form onSubmit={handleAddStock} className="space-y-5">
                <div>
                  <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.stockName}</label>
                  <input required type="text" value={stockName} onChange={(e) => setStockName(e.target.value)} className={inputClass} placeholder="e.g. Emerald Silk Kaftan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.stockQty}</label>
                    <input required type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} className={inputClass} placeholder="e.g. 50" />
                  </div>
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.stockDate}</label>
                    <input type="date" value={stockDate} onChange={(e) => setStockDate(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.stockCost}</label>
                    <input type="number" value={stockCost} onChange={(e) => setStockCost(e.target.value)} className={inputClass} placeholder="Cost" />
                  </div>
                  <div>
                    <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.stockSell}</label>
                    <input type="number" value={stockSell} onChange={(e) => setStockSell(e.target.value)} className={inputClass} placeholder="Sell" />
                  </div>
                </div>
                <div>
                  <label className={`block ${textMuted} mb-2 text-[9px] uppercase tracking-[0.2em] font-bold`}>{t.stockNotes}</label>
                  <textarea value={stockNotes} onChange={(e) => setStockNotes(e.target.value)} className={inputClass} rows={2} placeholder="Sizes, Supplier info, etc."></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2c2621] text-white py-3.5 mt-2 rounded-xl font-bold tracking-[0.2em] text-[10px] uppercase shadow-[0_8px_20px_rgba(44,38,33,0.15)] hover:shadow-[0_12px_25px_rgba(44,38,33,0.2)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {t.save}
                </button>
              </form>
            </div>

            <div className={`lg:col-span-2 ${glassCardClass} !p-0`}>
              <div className="p-6 md:p-8 border-b border-white/50 bg-white/20">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2c2621]" />
                  <h2 className={`text-[11px] font-bold tracking-[0.25em] uppercase ${textDark}`}>{t.recentStock}</h2>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {stocks.length === 0 ? (
                  <div className="py-20 text-center rounded-[1.5rem] bg-white/30 border border-dashed border-gray-300">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8c8273" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <p className={`text-[10px] ${textMuted} tracking-[0.25em] uppercase font-bold`}>{t.empty}</p>
                  </div>
                ) : (
                  <div className="space-y-4 pr-2 custom-scrollbar max-h-[600px] overflow-y-auto">
                    {stocks.map((stock) => (
                      <div key={stock.id} className="relative rounded-2xl border border-white/80 bg-white/60 p-5 flex flex-col md:flex-row justify-between gap-5 transition-all duration-300 hover:bg-white hover:shadow-md shadow-sm">
                        <div>
                          <p className={`font-bold text-sm ${textDark} tracking-wide`}>{stock.name}</p>
                          <p className={`text-[11px] mt-1.5 tracking-wider font-medium ${textMuted}`}>
                            Qty: <span className={`${accentColor} font-bold text-sm`}>{stock.qty}</span> 
                            <span className="mx-2 opacity-30">|</span> 
                            Added: {stock.date}
                          </p>
                          {stock.notes && <p className={`text-[10px] ${textMuted} mt-2 italic font-medium`}>"{stock.notes}"</p>}
                        </div>
                        <div className="flex flex-col gap-1.5 text-right">
                          <p className={`text-[9px] ${textMuted} uppercase tracking-[0.2em] font-bold`}>Cost: <span className={textDark}>{stock.cost || "-"}</span> MAD</p>
                          <p className={`text-[9px] ${accentColor} uppercase tracking-[0.2em] font-extrabold mt-0.5`}>Sell: {stock.sell || "-"} MAD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Modal */}
      {orderToDelete !== null && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity animate-fade-in">
          <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] max-w-sm w-full text-center relative overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </div>
            <h3 className={`text-xl font-medium mb-3 tracking-[0.1em] ${textDark}`} style={{ fontFamily: "var(--font-playfair)" }}>
              {t.deleteTitle}
            </h3>
            <p className={`text-[11px] mb-8 leading-relaxed tracking-wide font-medium ${textMuted}`}>
              {t.confirmDelete}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setOrderToDelete(null)}
                className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest border border-gray-200 ${textDark} rounded-xl hover:bg-gray-50 transition-all`}
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={executeDelete}
                className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all shadow-md"
              >
                {t.deleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE SYSTEM */}
      {invoiceData && (
        <div className="fixed top-[-9999px] left-[-9999px]">
          <div ref={invoiceRef} className="p-12 w-[800px] text-[#2c2c2c] relative" style={{ backgroundColor: "#f4f1ea" }} dir={isRtl ? "rtl" : "ltr"}>
            <div className="absolute inset-4 border border-[#c9a871] opacity-50 pointer-events-none rounded-sm"></div>
            <div className="relative z-10">
              <div className="text-center mb-10 border-b border-[#c9a871] pb-8">
                <h1 className="text-5xl font-extrabold tracking-[0.2em] mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#c9a871", direction: "ltr" }}>AMINA</h1>
                <p className="text-[#c9a871] tracking-[0.3em] text-sm uppercase font-semibold" style={{ fontFamily: isRtl ? "Arial, sans-serif" : "var(--font-playfair)" }}>{t.tagline}</p>
              </div>
              <div className="flex justify-between items-center mb-10">
                <div></div>
                <div className={isRtl ? "text-left" : "text-right"}>
                  <h2 className="text-2xl font-light tracking-[0.2em] mb-2 text-gray-500 uppercase">{t.invoiceTitle}</h2>
                  <p className="text-sm font-bold tracking-wider" dir="ltr">#{invoiceData.id}</p>
                  <p className="text-xs text-gray-500 mt-1" dir="ltr">{new Date(invoiceData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mb-12 bg-white/50 p-6 rounded-sm border border-[#c9a871]/20">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">{t.billedTo}:</p>
                <p className="text-xl font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{invoiceData.customer_name}</p>
                <p className="text-gray-600 text-sm">{invoiceData.city}</p>
                <p className="text-gray-600 text-sm mt-1 tracking-wider" dir="ltr">{invoiceData.phone}</p>
              </div>
              <table className="w-full mb-16 border-collapse">
                <thead>
                  <tr className="border-b border-[#c9a871] uppercase tracking-widest text-[10px]">
                    <th className={`py-4 text-gray-500 w-1/2 ${isRtl ? 'text-right' : 'text-left'}`}>{t.itemDesc}</th>
                    <th className="py-4 text-gray-500 text-center">{t.color}</th>
                    <th className="py-4 text-gray-500 text-center">{t.size}</th>
                    <th className={`py-4 text-gray-500 ${isRtl ? 'text-left' : 'text-right'}`}>{t.price}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200/50">
                    <td className={`py-6 font-medium text-lg ${isRtl ? 'text-right' : 'text-left'}`} style={{ fontFamily: "var(--font-playfair)" }}>{invoiceData.product || t.fallbackProd}</td>
                    <td className="py-6 text-center text-sm">{invoiceData.color || "-"}</td>
                    <td className="py-6 text-center font-bold text-sm" dir="ltr">{invoiceData.size}</td>
                    <td className={`py-6 font-semibold text-lg ${isRtl ? 'text-left' : 'text-right'}`} dir="ltr">{invoiceData.price || "-"}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-between items-end mb-16">
                <div className="text-gray-500 text-sm italic" style={{ fontFamily: "var(--font-playfair)" }}>{t.footerMsg1}<br/>{t.footerMsg2}</div>
                <div className={`bg-white p-6 shadow-sm border border-[#c9a871]/30 rounded-sm ${isRtl ? 'text-left' : 'text-right'}`}>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{t.totalMAD}</p>
                  <p className="text-3xl font-bold" style={{ color: "#c9a871" }} dir="ltr">{invoiceData.price || "TBD"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulseDot { 0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); } }
        .animate-pulse-dot { animation: pulseDot 2s infinite; }
        
        @keyframes pulseSlow { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
        .animate-pulse-slow { animation: pulseSlow 8s ease-in-out infinite; }

        @keyframes toastIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-toast-in { animation: toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }

        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .animate-shimmer { background-image: linear-gradient(90deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%); background-size: 800px 100%; animation: shimmer 2s infinite linear; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(195, 155, 87, 0.5); }

        .autofill-fix:-webkit-autofill, .autofill-fix:-webkit-autofill:hover, .autofill-fix:-webkit-autofill:focus, .autofill-fix:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #ffffff inset !important; -webkit-text-fill-color: #2c2621 !important; transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}