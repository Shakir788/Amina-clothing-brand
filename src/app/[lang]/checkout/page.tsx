'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext' 
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation' 

const PHONE_NUMBER = "212723908603"

export default function CheckoutPage() {
  const { items, cartTotal } = useCart()
  const pathname = usePathname()
  
  const currentLang = pathname?.split('/')[1] || 'en'

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Casablanca', 
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    en: {
      title: "Checkout",
      shippingHeader: "Shipping Details 🚚",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number (WhatsApp)",
      cityLabel: "City",
      addressLabel: "Full Address",
      orderHeader: "Your Order 🛍️",
      subtotal: "Subtotal",
      total: "Total",
      confirmBtn: "Confirm Order on WhatsApp",
      processingBtn: "Processing Order...",
      emptyCart: "Your Cart is Empty 😔",
      goShop: "Go Shopping",
      shippingNote: "*Shipping charges may apply based on your city.",
      redirectNote: "You will be redirected to WhatsApp to send the order details."
    },
    fr: {
      title: "Caisse",
      shippingHeader: "Détails de livraison 🚚",
      nameLabel: "Nom complet",
      phoneLabel: "Numéro de téléphone (WhatsApp)",
      cityLabel: "Ville",
      addressLabel: "Adresse complète",
      orderHeader: "Votre commande 🛍️",
      subtotal: "Sous-total",
      total: "Total",
      confirmBtn: "Confirmer sur WhatsApp",
      processingBtn: "Traitement en cours...",
      emptyCart: "Votre panier est vide 😔",
      goShop: "Aller à la boutique",
      shippingNote: "*Des frais de livraison peuvent s'appliquer selon votre ville.",
      redirectNote: "Vous serez redirigé vers WhatsApp pour envoyer les détails."
    },
    ar: {
      title: "الدفع",
      shippingHeader: "تفاصيل الشحن 🚚",
      nameLabel: "الاسم الكامل",
      phoneLabel: "رقم الهاتف (واتساب)",
      cityLabel: "المدينة",
      addressLabel: "العنوان الكامل",
      orderHeader: "طلبك 🛍️",
      subtotal: "المجموع الفرعي",
      total: "المجموع",
      confirmBtn: "تأكيد الطلب عبر واتساب",
      processingBtn: "جاري المعالجة...",
      emptyCart: "عربة التسوق فارغة 😔",
      goShop: "اذهب للتسوق",
      shippingNote: "*قد يتم تطبيق رسوم الشحن حسب مدينتك.",
      redirectNote: "سيتم إعادة توجيهك إلى واتساب لإرسال التفاصيل."
    }
  }

  // @ts-ignore
  const t = translations[currentLang] || translations.en
  const isArabic = currentLang === 'ar'

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleWhatsAppOrder = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert(currentLang === 'fr' ? "Veuillez remplir tous les détails" : (currentLang === 'ar' ? "يرجى ملء جميع التفاصيل" : "Please fill in all details"))
      return
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          cartItems: items,
          totalPrice: cartTotal,
        }),
      });

      const data = await response.json();

      let message = `*Salam AMINA! New Order:* 🛍️%0a%0a`
      
      if (data.success && data.orderNumber) {
        message += `*Order ID:* ${data.orderNumber}%0a%0a`
      }
      
      items.forEach((item: any) => {
        message += `▪️ ${item.name} (x${item.quantity}) - ${item.price * item.quantity} DHS%0a`
      })

      message += `%0a*Total: ${cartTotal} DHS* 💰%0a`
      message += `------------------%0a`
      message += `*Customer:*%0a`
      message += `👤 ${formData.name}%0a`
      message += `📞 ${formData.phone}%0a`
      message += `📍 ${formData.address}, ${formData.city}%0a`
      
      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${message}`
      window.open(whatsappUrl, '_blank')

    } catch (error) {
      console.error("Order process failed:", error);
      alert(currentLang === 'fr' ? "Une erreur s'est produite. Veuillez réessayer." : (currentLang === 'ar' ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Empty Cart View
  if (items.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-amina-ivory text-center px-4 overflow-hidden">
        <div className="glow-orb w-[320px] h-[320px] bg-amina-rose/20 top-1/3 left-1/2 -translate-x-1/2 pointer-events-none" />
        <span className="relative text-5xl text-amina-gold mb-4">❦</span>
        <h2 className="relative text-3xl font-bold mb-6 font-serif text-amina-ink">{t.emptyCart}</h2>
        <Link href={`/${currentLang}/collection`} className="btn-glow relative bg-amina-ink text-white px-10 py-4 rounded-full uppercase tracking-[0.2em] text-xs font-bold hover:bg-amina-gold transition-all duration-500 ease-luxury shadow-luxury-sm">
          {t.goShop}
        </Link>
      </div>
    )
  }

  return (
    <div className={`relative min-h-screen bg-amina-ivory pt-40 pb-20 px-6 overflow-hidden ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>

      {/* Ambient glow layer, consistent with the rest of the site */}
      <div className="glow-orb animate-float-slow w-[380px] h-[380px] bg-amina-rose/15 -top-32 -right-20 pointer-events-none" />
      <div className="glow-orb animate-float w-[280px] h-[280px] bg-amina-gold/15 bottom-0 -left-16 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative">
        
        <div className="text-center mb-14 animate-fade-up">
          <span className="text-3xl text-amina-gold block mb-3">❦</span>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-shimmer animate-shimmer mb-3">{t.title}</h1>
          <div className="w-16 h-[1px] bg-amina-gold/50 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* SHIPPING FORM — glass card */}
          <div className="glass-pill rounded-[2rem] p-6 md:p-10 border border-amina-border/60 shadow-luxury-sm">
            <h2 className="text-xl font-semibold mb-8 font-serif text-amina-ink flex items-center gap-2">
              {t.shippingHeader}
            </h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amina-stone">{t.nameLabel}</label>
                <input 
                  type="text" name="name" 
                  className="w-full p-4 bg-white/80 border border-amina-gold/25 rounded-xl focus:ring-1 focus:ring-amina-gold focus:border-amina-gold outline-none transition-all placeholder-gray-300"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amina-stone">{t.phoneLabel}</label>
                <input 
                  type="tel" name="phone" 
                  className={`w-full p-4 bg-white/80 border border-amina-gold/25 rounded-xl focus:ring-1 focus:ring-amina-gold focus:border-amina-gold outline-none transition-all placeholder-gray-300 ${isArabic ? 'text-right' : 'text-left'}`}
                  placeholder={isArabic ? "06 12..." : "06 12..."}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amina-stone">{t.cityLabel}</label>
                <div className="relative">
                  <select 
                    name="city" 
                    className="w-full p-4 bg-white/80 border border-amina-gold/25 rounded-xl focus:ring-1 focus:ring-amina-gold focus:border-amina-gold outline-none appearance-none"
                    onChange={handleInputChange}
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Fes">Fes</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-amina-stone ${isArabic ? 'left-4' : 'right-4'}`}>▼</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amina-stone">{t.addressLabel}</label>
                <textarea 
                  name="address" rows={3}
                  className="w-full p-4 bg-white/80 border border-amina-gold/25 rounded-xl focus:ring-1 focus:ring-amina-gold focus:border-amina-gold outline-none transition-all placeholder-gray-300 resize-none"
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </form>
          </div>

          {/* ORDER SUMMARY — elevated shadow, gold top accent */}
          <div>
            <h2 className="text-xl font-semibold mb-8 font-serif text-amina-ink">{t.orderHeader}</h2>
            <div className="bg-white/90 backdrop-blur-sm border border-amina-border rounded-[2rem] p-6 md:p-8 shadow-luxury relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-shimmer-gold bg-[length:200%_auto] animate-shimmer"></div>

              <div className="space-y-6 max-h-[400px] overflow-y-auto mb-6 pr-2">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-5 border-b border-amina-ivory pb-6 last:border-0">
                    <div className="w-20 h-24 relative bg-amina-ivory rounded-t-xl rounded-b-md overflow-hidden flex-shrink-0 border border-amina-gold/20">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-medium text-amina-ink font-serif text-lg leading-tight">{item.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-amina-stone text-xs tracking-widest uppercase">Qty: {item.quantity}</p>
                        <p className="font-bold text-amina-gold">{item.price * item.quantity} DHS</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-amina-gold/30 pt-6 space-y-3">
                <div className="flex justify-between text-amina-stone font-light">
                  <span>{t.subtotal}</span>
                  <span>{cartTotal} DHS</span>
                </div>
                <div className="flex justify-between font-serif text-2xl text-amina-ink pt-2">
                  <span>{t.total}</span>
                  <span>{cartTotal} <span className="text-sm font-sans font-bold text-amina-gold">DHS</span></span>
                </div>
                <p className="text-[10px] text-amina-stone text-center mt-2 italic">
                  {t.shippingNote}
                </p>
              </div>

              <button 
                onClick={handleWhatsAppOrder}
                disabled={isSubmitting}
                className={`btn-glow w-full font-bold py-4 px-6 rounded-full mt-8 flex items-center justify-center gap-3 transition-all duration-500 ease-luxury shadow-lg ${
                  isSubmitting 
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-70' 
                    : 'bg-amina-ink hover:bg-amina-gold hover:shadow-glow-gold hover:-translate-y-1 text-white'
                }`}
              >
                <span className="uppercase tracking-widest text-xs">
                  {isSubmitting ? t.processingBtn : t.confirmBtn}
                </span>
                
                {!isSubmitting && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#25D366" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z"/>
                  </svg>
                )}
              </button>
              <p className="text-center text-[10px] text-amina-stone mt-4 opacity-70 uppercase tracking-widest">{t.redirectNote}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}