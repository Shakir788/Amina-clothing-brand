"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation"; // 👈 URL se language pakdne ke liye

// ✅ Updated Number for Douaa
const PHONE_NUMBER = "212625609551";

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, toggleCart, isCartOpen, cartTotal } = useCart();
  const pathname = usePathname(); // Current URL pata karne ke liye

  if (!isCartOpen) return null;

  // 1. Language Detect Karo (URL ke pehle hisse se: /ar/..., /fr/...)
  const currentLang = pathname?.split('/')[1] || 'en'; // Default English

  // 2. Translations Dictionary (Message Templates)
  const translations = {
    en: {
      greeting: "Hi AMINA (Douaa), I would like to place an order:",
      itemLine: "x", // quantity separator
      total: "Total Estimate:",
      question: "Do you have these in stock?"
    },
    fr: {
      greeting: "Bonjour AMINA (Douaa), je voudrais passer une commande :",
      itemLine: "x",
      total: "Estimation Total :",
      question: "Avez-vous ces articles en stock ?"
    },
    ar: {
      greeting: "مرحباً أمينة (دعاء)، أود تقديم طلب:",
      itemLine: "عدد",
      total: "الإجمالي التقديري:",
      question: "هل هذه القطع متوفرة؟"
    }
  };

  // 3. Sahi Language ka Text Uthao
  // @ts-ignore
  const t = translations[currentLang] || translations.en;

  // WhatsApp Message Generator
  const checkoutMessage = () => {
    let message = `${t.greeting}\n\n`;
    
    items.forEach((item, index) => {
      // Format: 1. Name x2 - 1200 DHS
      message += `${index + 1}. ${item.name} (${t.itemLine} ${item.quantity}) - ${item.price} DHS\n`;
    });
    
    message += `\n${t.total} ${cartTotal} DHS\n\n${t.question}`;
    
    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Black overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={toggleCart}
      ></div>

      {/* Cart Drawer */}
      <div className="relative w-full max-w-md bg-amina-sand h-full shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-amina-border">
        
        {/* Header */}
        <div className="p-6 border-b border-amina-border flex justify-between items-center bg-white">
          <h2 className="text-xl font-serif text-amina-black">
            {currentLang === 'ar' ? `حقيبة التسوق (${items.length})` : 
             currentLang === 'fr' ? `Panier (${items.length})` : 
             `Shopping Bag (${items.length})`}
          </h2>
          <button onClick={toggleCart} className="p-2 hover:rotate-90 transition duration-300 text-amina-black">
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="text-center py-20 text-amina-stone">
              <p>
                {currentLang === 'ar' ? "حقيبتك فارغة." : 
                 currentLang === 'fr' ? "Votre panier est vide." : 
                 "Your bag is empty."}
              </p>
              <button onClick={toggleCart} className="mt-4 underline text-amina-black">
                {currentLang === 'ar' ? "تابع التسوق" : 
                 currentLang === 'fr' ? "Continuer vos achats" : 
                 "Continue Shopping"}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                
                {/* Product Image */}
                <div className="relative w-24 h-32 bg-white rounded-sm overflow-hidden flex-shrink-0 border border-amina-border/50">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-serif text-amina-black text-lg leading-tight mb-1">{item.name}</h3>
                    <p className="text-sm text-amina-stone font-medium">{item.price} DHS</p>
                  </div>

                  {/* Quantity & Remove Controls */}
                  <div className="flex items-center justify-between mt-4">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-amina-border rounded-sm bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 text-amina-stone hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-medium text-amina-black min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-amina-stone hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Link */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-400 hover:text-red-600 underline tracking-wide"
                    >
                      {currentLang === 'ar' ? "حذف" : 
                       currentLang === 'fr' ? "RETIRER" : "REMOVE"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-amina-border">
            <div className="flex justify-between items-center mb-6 text-amina-black font-serif text-xl">
              <span>
                 {currentLang === 'ar' ? "الإجمالي" : 
                  currentLang === 'fr' ? "Total" : "Total"}
              </span>
              <span>{cartTotal} DHS</span>
            </div>
            <a 
              href={checkoutMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-amina-black text-white text-center py-4 uppercase tracking-[0.15em] text-xs hover:bg-amina-clay transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {currentLang === 'ar' ? "إتمام الطلب عبر واتساب" : 
               currentLang === 'fr' ? "COMMANDER SUR WHATSAPP" : 
               "CHECKOUT ON WHATSAPP"}
            </a>
            <p className="text-[10px] text-center text-amina-stone mt-4 opacity-70">
              {currentLang === 'ar' ? "يتم حساب الشحن والضرائب عند الدفع" : 
               currentLang === 'fr' ? "Expédition et taxes calculées à la caisse" : 
               "Shipping & taxes calculated at checkout"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}