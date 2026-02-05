"use client";

import Image from "next/image";
import Link from "next/link"; 
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

// 🌍 Clean Translations Object
const translations = {
  en: {
    title: "Shopping Bag",
    empty: "Your bag is empty.",
    continue: "Continue Shopping",
    remove: "REMOVE",
    total: "Total",
    checkout: "PROCEED TO CHECKOUT",
    shippingNote: "Shipping & taxes calculated at checkout"
  },
  fr: {
    title: "Panier",
    empty: "Votre panier est vide.",
    continue: "Continuer vos achats",
    remove: "RETIRER",
    total: "Total",
    checkout: "PASSER LA COMMANDE",
    shippingNote: "Expédition et taxes calculées à la caisse"
  },
  ar: {
    title: "حقيبة التسوق",
    empty: "حقيبتك فارغة.",
    continue: "تابع التسوق",
    remove: "حذف",
    total: "الإجمالي",
    checkout: "إتمام الطلب",
    shippingNote: "يتم حساب الشحن والضرائب عند الدفع"
  }
};

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, toggleCart, isCartOpen, cartTotal } = useCart();
  const pathname = usePathname();

  if (!isCartOpen) return null;

  // 1. Language Logic
  const currentLang = (pathname?.split('/')[1] || 'en') as keyof typeof translations;
  const t = translations[currentLang] || translations.en;
  const isArabic = currentLang === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      
      {/* Black Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={toggleCart}
      ></div>

      {/* Cart Drawer */}
      <div 
        className={`relative w-full max-w-md bg-[#F4F1EA] h-full shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-[#D4A373]/30 ${isArabic ? 'font-arabic text-right' : 'text-left'}`}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-[#D4A373]/20 flex justify-between items-center bg-[#F4F1EA]">
          <h2 className="text-2xl font-serif text-[#2C2C2C] tracking-wide">
            {t.title} <span className="text-sm font-sans text-gray-500">({items.length})</span>
          </h2>
          <button onClick={toggleCart} className="p-2 hover:rotate-90 transition duration-300 text-[#2C2C2C] hover:text-[#D4A373]">
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-500 flex flex-col items-center">
              <span className="text-4xl text-[#D4A373] mb-4 opacity-50">❦</span>
              <p className="font-serif text-lg">{t.empty}</p>
              <button onClick={toggleCart} className="mt-6 border-b border-black text-black pb-1 hover:text-[#D4A373] hover:border-[#D4A373] transition-colors">
                {t.continue}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-5">
                
                {/* Product Image */}
                <div className="relative w-24 h-32 bg-white rounded-t-[2rem] rounded-b-lg overflow-hidden flex-shrink-0 border border-[#D4A373]/30 shadow-sm">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-serif text-[#2C2C2C] text-lg leading-tight mb-1">{item.name}</h3>
                    
                    {/* Size & Color Labels */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.size && (
                        <span className="text-[9px] uppercase tracking-widest bg-white/60 border border-[#D4A373]/20 px-2 py-0.5 rounded text-gray-600">
                          {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-[9px] uppercase tracking-widest bg-white/60 border border-[#D4A373]/20 px-2 py-0.5 rounded text-gray-600">
                          {item.color}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 font-medium">{item.price} <span className="text-[10px] text-[#D4A373] font-bold">DHS</span></p>
                  </div>

                  {/* Quantity & Remove Controls */}
                  <div className="flex items-center justify-between mt-4">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#D4A373]/30 rounded-full bg-white/50 px-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 text-gray-600 hover:text-[#D4A373] disabled:opacity-30 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-medium text-black min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:text-[#D4A373] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] uppercase tracking-widest text-[#8C6A48] hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500"
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 bg-[#F9F7F2] border-t border-[#D4A373]/20">
            <div className="flex justify-between items-center mb-6 text-[#2C2C2C] font-serif text-2xl">
              <span>{t.total}</span>
              <span>{cartTotal} <span className="text-sm font-sans font-bold text-[#D4A373]">DHS</span></span>
            </div>
            
            <Link 
              href={`/${currentLang}/checkout`}
              onClick={toggleCart} 
              className="block w-full bg-[#1a1a1a] text-white text-center py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#D4A373] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {t.checkout}
            </Link>

            <p className="text-[10px] text-center text-gray-400 mt-4 opacity-70 tracking-wide font-light">
              {t.shippingNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}