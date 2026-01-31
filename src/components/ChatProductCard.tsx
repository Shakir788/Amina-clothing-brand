"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ChatProductCardProps {
  product: {
    name: string;
    price: number | string; // Number ya String dono handle karega
    image: string;
    slug: string;
    id: string;
  };
}

export default function ChatProductCard({ product }: ChatProductCardProps) {
  const { addToCart, toggleCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      // Safe conversion to string
      price: product.price.toString(), 
      image: product.image,
      slug: product.slug,
    });
    toggleCart(); 
  };

  return (
    // 👇 DESIGN UPGRADE: Compact + Moroccan Arch Shape + Gold Border
    <div className="mt-3 bg-white p-2 rounded-t-[1.5rem] rounded-b-lg border border-[#D4A373]/40 shadow-sm max-w-[180px] animate-in fade-in zoom-in-95 duration-500 mx-auto group hover:shadow-md transition-all">
      
      {/* Product Image (Arch Shape) */}
      <div className="relative aspect-[3/4] w-full rounded-t-[1rem] rounded-b-sm overflow-hidden mb-2 border-b border-[#D4A373]/20">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Details - Fonts thode elegant aur chhote kiye */}
      <div className="text-center px-1">
        <h3 className="font-serif text-xs font-medium text-black mb-0.5 line-clamp-1 tracking-wide">
          {product.name}
        </h3>
        <p className="text-[10px] text-[#D4A373] font-bold mb-2 tracking-widest">
          {product.price} DHS
        </p>

        {/* Buttons - Compact & Sleek */}
        <div className="flex gap-1.5 justify-center pb-0.5">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white text-[8px] uppercase font-bold py-1.5 rounded-sm hover:bg-[#D4A373] transition-colors duration-300 tracking-wider"
          >
            Add
          </button>
          <Link 
            href={`/en/product/${product.slug}`}
            className="px-2 py-1.5 border border-[#D4A373]/50 text-black text-[8px] uppercase font-bold rounded-sm hover:bg-[#F9F9F9] transition-colors tracking-wider"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}