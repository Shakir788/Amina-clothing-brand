"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

// ✅ Updated Number for Douaa
const PHONE_NUMBER = "212625609551";

export default function CartSidebar() {
  // 👇 updateQuantity yahan destructure kiya hai
  const { items, removeFromCart, updateQuantity, toggleCart, isCartOpen, cartTotal } = useCart();

  if (!isCartOpen) return null;

  // WhatsApp Message Generator
  const checkoutMessage = () => {
    let message = "Hi AMINA (Douaa), I would like to place an order:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - ${item.price}\n`;
    });
    message += `\nTotal Estimate: ${cartTotal} DHS\n\nDo you have these in stock?`;
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
          <h2 className="text-xl font-serif text-amina-black">Shopping Bag ({items.length})</h2>
          <button onClick={toggleCart} className="p-2 hover:rotate-90 transition duration-300 text-amina-black">
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="text-center py-20 text-amina-stone">
              <p>Your bag is empty.</p>
              <button onClick={toggleCart} className="mt-4 underline text-amina-black">Continue Shopping</button>
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
                    <p className="text-sm text-amina-stone font-medium">{item.price}</p>
                  </div>

                  {/* Quantity & Remove Controls */}
                  <div className="flex items-center justify-between mt-4">
                    
                    {/* 👇 NEW PREMIUM QUANTITY SELECTOR */}
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
                      REMOVE
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
              <span>Total</span>
              <span>{cartTotal} DHS</span>
            </div>
            <a 
              href={checkoutMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-amina-black text-white text-center py-4 uppercase tracking-[0.15em] text-xs hover:bg-amina-clay transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Checkout on WhatsApp
            </a>
            <p className="text-[10px] text-center text-amina-stone mt-4 opacity-70">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}