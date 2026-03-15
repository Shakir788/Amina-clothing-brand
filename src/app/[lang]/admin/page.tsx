"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Database Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    downloadInvoice: "📄 Download Invoice",
    statusMap: { Pending: "Pending ⏳", Shipped: "Shipped 🚚", Delivered: "Delivered ✅", Cancelled: "Cancelled ❌" }
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
    downloadInvoice: "📄 Télécharger la facture",
    statusMap: { Pending: "En attente ⏳", Shipped: "Expédié 🚚", Delivered: "Livré ✅", Cancelled: "Annulé ❌" }
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
    downloadInvoice: "📄 تحميل الفاتورة",
    statusMap: { Pending: "قيد الانتظار ⏳", Shipped: "تم الشحن 🚚", Delivered: "تم التوصيل ✅", Cancelled: "ملغي ❌" }
  }
};

export default function AdminDashboard({ params }: any) {
  const lang = params?.lang || "en";
  const t = translations[lang as keyof typeof translations] || translations.en;
  const isRtl = lang === "ar";

  // 🔒 SECURITY LOCK
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("M");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  // Invoice State
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "amina2026") {
      setIsAuthenticated(true);
    } else {
      alert("❌ Wrong Password!");
    }
  };

  async function fetchOrders() {
    const { data } = await supabase.from("orders").select("*").order("id", { ascending: false });
    if (data) setOrders(data);
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
    }
    setLoading(false);
  }

  async function updateStatus(id: number, newStatus: string) {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
  }

  // 🖨️ PDF Generation (HD)
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center border border-gray-200">
          <h1 className="text-3xl font-bold tracking-widest mb-6" style={{ fontFamily: "var(--font-playfair)" }}>AMINA</h1>
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider">Restricted Access</p>
          <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Enter Master Password" className="w-full border p-3 rounded text-center tracking-widest focus:outline-none focus:border-black mb-4" />
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

        {/* 📊 QUICK STATS BOXES (Yahi miss ho gaye the!) */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
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
            <h2 className="text-lg font-semibold mb-6 border-b pb-2">{t.recent}</h2>
            {orders.map((order) => (
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
                   <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="text-xs border px-2 py-1 rounded hover:bg-gray-50 transition w-fit outline-none cursor-pointer font-semibold" dir={isRtl ? "rtl" : "ltr"}><option value="Pending">{t.statusMap.Pending}</option><option value="Shipped">{t.statusMap.Shipped}</option><option value="Delivered">{t.statusMap.Delivered}</option><option value="Cancelled">{t.statusMap.Cancelled}</option></select>
                    <button onClick={() => generatePDF(order)} className="text-xs bg-[#c9a871] text-white px-3 py-1 rounded hover:bg-[#b08d55] transition font-medium w-fit shadow-sm">
                      {t.downloadInvoice}
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🧾 PREMIUM LUXURY COLOR INVOICE */}
      {invoiceData && (
        <div className="fixed top-[-9999px] left-[-9999px]">
          <div ref={invoiceRef} className="p-12 w-[800px] text-[#2c2c2c] relative" style={{ backgroundColor: "#f4f1ea" }}>
            
            {/* Elegant Golden Border */}
            <div className="absolute inset-4 border border-[#c9a871] opacity-50 pointer-events-none rounded-sm"></div>
            
            <div className="relative z-10">
              {/* Header with Direct Elegant Gold Text */}
              <div className="text-center mb-10 border-b border-[#c9a871] pb-8">
                <h1 className="text-5xl font-extrabold tracking-[0.2em] mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#c9a871" }}>AMINA</h1>
                <p className="text-[#c9a871] tracking-[0.3em] text-sm uppercase font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>Luxe marocain élégant</p>
              </div>

              {/* Invoice ID & Date section */}
              <div className="flex justify-between items-center mb-10 text-right">
                <div></div>
                <div className="text-right">
                  <h2 className="text-2xl font-light tracking-[0.2em] mb-2 text-gray-500 uppercase">{t.invoiceTitle}</h2>
                  <p className="text-sm font-bold tracking-wider">#{invoiceData.id}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(invoiceData.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-12 bg-white/50 p-6 rounded-sm border border-[#c9a871]/20">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">{t.billedTo}:</p>
                <p className="text-xl font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{invoiceData.customer_name}</p>
                <p className="text-gray-600 text-sm">{invoiceData.city}</p>
                <p className="text-gray-600 text-sm mt-1 tracking-wider">{invoiceData.phone}</p>
              </div>

              {/* Items Table */}
              <table className="w-full mb-16 border-collapse">
                <thead>
                  <tr className="border-b border-[#c9a871] text-left uppercase tracking-widest text-[10px]">
                    <th className="py-4 text-gray-500 w-1/2">{t.itemDesc}</th>
                    <th className="py-4 text-gray-500 text-center">{translations[lang as keyof typeof translations]?.color || "Color"}</th>
                    <th className="py-4 text-gray-500 text-center">{translations[lang as keyof typeof translations]?.size || "Size"}</th>
                    <th className="py-4 text-gray-500 text-right">{translations[lang as keyof typeof translations]?.price || "Price"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200/50">
                    <td className="py-6 font-medium text-lg" style={{ fontFamily: "var(--font-playfair)" }}>{invoiceData.product || "Article de Luxe"}</td>
                    <td className="py-6 text-center text-sm">{invoiceData.color || "-"}</td>
                    <td className="py-6 text-center font-bold text-sm">{invoiceData.size}</td>
                    <td className="py-6 text-right font-semibold text-lg">{invoiceData.price || "-"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Total & Footer */}
              <div className="flex justify-between items-end mb-16">
                <div className="text-gray-500 text-sm italic" style={{ fontFamily: "var(--font-playfair)" }}>
                  Merci pour votre confiance.<br/>Portez votre élégance avec fierté.
                </div>
                <div className="text-right bg-white p-6 shadow-sm border border-[#c9a871]/30 rounded-sm">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{t.totalMAD}</p>
                  <p className="text-3xl font-bold" style={{ color: "#c9a871" }}>{invoiceData.price || "TBD"}</p>
                </div>
              </div>
              
              {/* Bottom Social Strip */}
              <div className="flex justify-center items-center gap-6 pt-6 border-t border-[#c9a871]/40 text-xs text-gray-500 tracking-wider">
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  @aminaclothingbrand
                </span>
                <span>•</span>
                <span>aminaclothing.shop</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}