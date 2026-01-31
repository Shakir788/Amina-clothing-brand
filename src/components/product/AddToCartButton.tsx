"use client";

import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: any;
  lang: string;
  isArabic: boolean;
}

export default function AddToCartButton({ product, lang, isArabic }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Yahan hum pehle hi sahi language wala naam nikal lenge
    const translatedName = product.name[lang] || product.name.en;
    
    // Ab hum sirf EK object bhejenge, jisme saari details hongi
    addToCart({
      id: product._id,
      name: translatedName,
      price: product.price,
      image: product.image, // Make sure ye URL string ho (mock data mein string hai)
      slug: product.slug.current || product.slug
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="group relative w-full md:w-auto overflow-hidden bg-amina-black text-white px-10 py-5 text-sm uppercase tracking-widest hover:shadow-lg transition-all duration-300 text-center"
    >
      <span className="relative z-10 group-hover:text-amina-sand transition-colors">
        {isArabic ? "أضف إلى الحقيبة" : "Add to Bag"}
      </span>
      <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-amina-clay/20"></div>
    </button>
  );
}