"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { usePathname } from "next/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  
  // Language Logic
  const lang = pathname?.split('/')[1] || 'en';
  const isArabic = lang === 'ar';

  // Translations
  const t = {
    placeholder: isArabic ? "بحث..." : lang === 'fr' ? "Rechercher..." : "Search...",
    noResults: isArabic ? "لا توجد نتائج" : lang === 'fr' ? "Aucun résultat" : "No results found",
    close: isArabic ? "إغلاق" : "CLOSE"
  };

  // Auto-focus Input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close when path changes (Product clicked)
  useEffect(() => {
    onClose();
  }, [pathname]);

  // 🔍 Search Fetch Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Agar search band hai to kuch mat dikhao
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex flex-col pt-6 px-6 transition-all duration-300 animate-in fade-in ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* 🔎 SEARCH BAR HEADER */}
      <div className="w-full max-w-4xl mx-auto flex items-center border-b border-black/10 pb-6 pt-4">
         {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mx-4"></div>
         ) : (
            <svg className="text-gray-400 mx-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
         )}
         
         <input 
           ref={inputRef}
           type="text" 
           value={query} 
           onChange={(e) => setQuery(e.target.value)} 
           placeholder={t.placeholder}
           className="flex-1 bg-transparent border-none outline-none text-2xl md:text-3xl font-serif placeholder:text-gray-300 text-black"
         />
         
         <button 
           onClick={onClose} 
           className="mx-6 text-xs font-bold uppercase tracking-widest hover:text-[#D4A373] text-black transition-colors"
         >
           {t.close}
         </button>
      </div>

      {/* 🛍️ RESULTS GRID */}
      <div className="w-full max-w-4xl mx-auto mt-8 overflow-y-auto pb-20 h-[calc(100vh-150px)] custom-scrollbar">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((product) => {
               // Logic to pick correct name
               let displayName = product.name;
               if (lang === 'fr' && product.name_fr) displayName = product.name_fr;
               else if (lang === 'ar' && product.name_ar) displayName = product.name_ar;

               return (
                <Link 
                  key={product._id} 
                  href={`/${lang}/product/${product.slug}`}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all group"
                >
                  <div className="relative w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                    {product.image && (
                      <Image 
                        src={urlFor(product.image).url()} 
                        alt={displayName} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>

                  <div>
                    <h4 className="font-serif text-lg text-[#2C2C2C] group-hover:text-[#D4A373] transition-colors">
                      {displayName}
                    </h4>
                    <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">
                      {product.price} DHS
                    </p>
                  </div>
                </Link>
               );
            })}
          </div>
        ) : query.length >= 2 && !loading ? (
          <div className="text-center text-gray-400 mt-20 font-serif text-lg opacity-60">
            {t.noResults} "{query}"
          </div>
        ) : null}
      </div>
    </div>
  );
}