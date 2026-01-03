"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product, lang, isArabic }: any) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product, lang)}
      className="group relative w-full md:w-auto overflow-hidden bg-amina-black text-white px-10 py-5 text-sm uppercase tracking-widest hover:shadow-lg transition-all duration-300 text-center"
    >
      <span className="relative z-10 group-hover:text-amina-sand transition-colors">
        {isArabic ? "أضف إلى السلة" : "Add to Cart"}
      </span>
      <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-[3] group-hover:bg-amina-clay"></div>
    </button>
  );
}