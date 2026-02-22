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
      emptyCart: "عربة التسوق فارغة 😔",
      goShop: "اذهب للتسوق",
      shippingNote: "*قد يتم تطبيق رسوم الشحن حسب مدينتك.",
      redirectNote: "سيتم إعادة توجيهك إلى واتساب لإرسال التفاصيل."
    }
  }

  // @ts-ignore
  const t = translations[currentLang] || translations.en
  const isArabic = currentLang === 'ar'

  // Logic Handlers (NO CHANGE)
  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleWhatsAppOrder = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert(currentLang === 'fr' ? "Veuillez remplir tous les détails" : "Please fill in all details")
      return
    }

   
    let message = `*Salam AMINA! New Order:* 🛍️%0a%0a`
    
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
  }

  // Empty Cart View
  if (items.length === 0) {
    return (
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F1EA] text-center px-4">
        <span className="text-5xl text-[#D4A373] mb-4">❦</span>
        <h2 className="text-3xl font-bold mb-4 font-serif text-[#2C2C2C]">{t.emptyCart}</h2>
        <Link href={`/${currentLang}/collection`} className="bg-[#1a1a1a] text-white px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#D4A373] transition-all duration-300">
          {t.goShop}
        </Link>
      </div>
    )
  }

  return (
    
    <div className={`min-h-screen bg-[#F4F1EA] pt-40 pb-20 px-6 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4">
        
        {}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#2C2C2C] mb-2">{t.title}</h1>
          <div className="w-16 h-[2px] bg-[#D4A373]/40 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          
          {}
          <div className="bg-white/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-[#D4A373]/20 shadow-sm">
            <h2 className="text-xl font-semibold mb-8 font-serif text-[#2C2C2C] flex items-center gap-2">
              {t.shippingHeader}
            </h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">{t.nameLabel}</label>
                <input 
                  type="text" name="name" 
                  className="w-full p-4 bg-white border border-[#D4A373]/30 rounded-lg focus:ring-1 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none transition-all placeholder-gray-300"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">{t.phoneLabel}</label>
                <input 
                  type="tel" name="phone" 
                  className={`w-full p-4 bg-white border border-[#D4A373]/30 rounded-lg focus:ring-1 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none transition-all placeholder-gray-300 ${isArabic ? 'text-right' : 'text-left'}`}
                  placeholder={isArabic ? "06 12..." : "06 12..."}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">{t.cityLabel}</label>
                <div className="relative">
                  <select 
                    name="city" 
                    className="w-full p-4 bg-white border border-[#D4A373]/30 rounded-lg focus:ring-1 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none appearance-none"
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
                  {/* Custom Arrow for Select */}
                  <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 ${isArabic ? 'left-4' : 'right-4'}`}>▼</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">{t.addressLabel}</label>
                <textarea 
                  name="address" rows={3}
                  className="w-full p-4 bg-white border border-[#D4A373]/30 rounded-lg focus:ring-1 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none transition-all placeholder-gray-300 resize-none"
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </form>
          </div>

          {}
          <div>
            <h2 className="text-xl font-semibold mb-8 font-serif text-[#2C2C2C]">{t.orderHeader}</h2>
            <div className="bg-white border border-[#D4A373]/20 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              {/* Decorative Top Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#D4A373]"></div>

              <div className="space-y-6 max-h-[400px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-5 border-b border-[#F4F1EA] pb-6 last:border-0">
                    
                    {}
                    <div className="w-20 h-24 relative bg-[#F4F1EA] rounded-t-xl rounded-b-md overflow-hidden flex-shrink-0 border border-[#D4A373]/20">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-medium text-[#2C2C2C] font-serif text-lg leading-tight">{item.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-500 text-xs tracking-widest uppercase">Qty: {item.quantity}</p>
                        <p className="font-bold text-[#D4A373]">{item.price * item.quantity} DHS</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-[#D4A373]/30 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600 font-light">
                  <span>{t.subtotal}</span>
                  <span>{cartTotal} DHS</span>
                </div>
                <div className="flex justify-between font-serif text-2xl text-[#2C2C2C] pt-2">
                  <span>{t.total}</span>
                  <span>{cartTotal} <span className="text-sm font-sans font-bold text-[#D4A373]">DHS</span></span>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2 italic">
                  {t.shippingNote}
                </p>
              </div>

              {}
              <button 
  onClick={handleWhatsAppOrder}
  className="w-full bg-[#1a1a1a] hover:bg-[#D4A373] text-white font-bold py-4 px-6 rounded-xl mt-8 flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
>
  <span className="uppercase tracking-widest text-xs">{t.confirmBtn}</span>
  {}
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#25D366" viewBox="0 0 16 16">
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z"/>
  </svg>
</button>
              <p className="text-center text-[10px] text-gray-400 mt-4 opacity-70 uppercase tracking-widest">{t.redirectNote}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}