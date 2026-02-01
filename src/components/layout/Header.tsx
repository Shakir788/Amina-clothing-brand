"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCart } from "@/context/CartContext"; 
import { urlFor } from '@/sanity/lib/image';

export default function Header({ lang, dict }: { lang: string, dict: any }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(""); 
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toggleCart, items } = useCart(); 

  // Auto-focus Input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // 🔥 LIVE SEARCH LOGIC
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await res.json();
        
        // Debugging ke liye (Console me check karna)
        console.log("🔥 API DATA in Header:", data);

        setResults(data?.results || []);
        
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLang = (newLang: string) => {
    if (!pathname) return `/${newLang}`;
    const segments = pathname.split("/");
    if (segments.length > 1) {
      segments[1] = newLang;
      return segments.join("/");
    }
    return `/${newLang}`;
  };

  const closeMenu = () => setIsMenuOpen(false);

  // 🔥 HELPER FIX: Handle String vs Object Name
  const getProductName = (product: any) => {
    if (!product) return "Unknown";
    // Agar direct string hai (API se)
    if (typeof product.name === 'string') return product.name;
    // Agar object hai (Sanity raw se)
    return product.name?.[lang] || product.name?.en || "Unnamed";
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ${
          scrolled || isSearchOpen
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100 py-0' 
            : 'bg-white/40 backdrop-blur-md border-b border-white/20' 
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative">
          
          {/* SEARCH OVERLAY */}
          <div className={`absolute inset-0 bg-white z-[60] flex flex-col items-center pt-6 px-6 transition-all duration-500 ${
            isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}>
             <div className="w-full max-w-2xl flex items-center border-b border-black/20 pb-4">
                {loading ? (
                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-4"></div>
                ) : (
                   <svg className="text-gray-400 mr-4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                )}
                
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder={lang === 'ar' ? "ابحث..." : "Search (e.g. Mint)..."}
                  className="flex-1 bg-transparent border-none outline-none text-xl font-serif placeholder:text-gray-300 text-black"
                />
                
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="ml-4 text-xs font-bold uppercase tracking-widest hover:text-[#D4A373] text-black">
                  CLOSE
                </button>
             </div>

             {/* RESULTS AREA */}
             <div className="w-full max-w-2xl mt-6 max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-xl p-2 border border-gray-100">
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {results.map((product) => {
                      // 🔥 SLUG FIX: Check if slug is string or object
                      const slugValue = typeof product.slug === 'string' ? product.slug : product.slug?.current;

                      return (
                        <Link 
                          key={product._id} 
                          href={`/${lang}/product/${slugValue}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-4 p-3 hover:bg-[#F4F1EA] rounded-lg transition group border-b border-gray-50 last:border-0"
                        >
                          <div className="relative w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                            {product.image && (
                              <Image src={urlFor(product.image).url()} alt={getProductName(product)} fill className="object-cover" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-serif text-sm text-black group-hover:text-[#D4A373] transition font-bold">
                              {getProductName(product)}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {product.price} DHS
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  searchQuery.length >= 2 && !loading && (
                     <div className="text-center py-10 opacity-60">
                        <p className="text-sm text-gray-400">No results found for "{searchQuery}"</p>
                     </div>
                  )
                )}
             </div>
          </div>

          {/* ... BAAKI KA UI CODE SAME (Copy from previous or leave as is) ... */}
          
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="text-black p-2 -ml-2 hover:bg-white/40 rounded-full transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>

          <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] text-black font-bold drop-shadow-sm">
            <Link href={`/${lang}/collection`} className="hover:text-[#D4A373] transition-colors font-serif">{dict?.collection || 'Collection'}</Link>
            <Link href={`/${lang}/about`} className="hover:text-[#D4A373] transition-colors font-serif">{dict?.about || 'About'}</Link>
          </nav>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <Link href={`/${lang}`} className="text-3xl font-serif font-bold tracking-widest text-black hover:opacity-80 transition drop-shadow-sm">AMINA</Link>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-black/80 drop-shadow-sm">
              <Link href={switchLang('en')} className={`hover:text-[#D4A373] transition ${lang === 'en' ? 'text-black underline decoration-[#D4A373]' : ''}`}>EN</Link>
              <span className="text-black/30">|</span>
              <Link href={switchLang('fr')} className={`hover:text-[#D4A373] transition ${lang === 'fr' ? 'text-black underline decoration-[#D4A373]' : ''}`}>FR</Link>
              <span className="text-black/30">|</span>
              <Link href={switchLang('ar')} className={`hover:text-[#D4A373] transition ${lang === 'ar' ? 'text-black underline decoration-[#D4A373] font-arabic text-xs' : 'font-arabic text-xs'}`}>ع</Link>
            </div>

            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-black hover:text-[#D4A373] transition transform hover:scale-105 drop-shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>

            <button onClick={toggleCart} className="relative p-2 text-black hover:text-[#D4A373] transition transform hover:scale-105 drop-shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4A373] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">{items.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[60] bg-[#FDFBF7] transition-transform duration-700 cubic-bezier(0.77,0,0.175,1) ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={closeMenu} className="absolute top-6 right-6 p-4 text-black hover:rotate-90 transition duration-300">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
          <Link href={`/${lang}`} onClick={closeMenu} className="text-4xl font-serif text-black hover:text-[#D4A373]">Home</Link>
          <Link href={`/${lang}/collection`} onClick={closeMenu} className="text-3xl font-serif text-gray-600 hover:text-[#D4A373]">{dict?.collection || 'Collection'}</Link>
          <div className="flex gap-8 text-sm font-bold tracking-widest uppercase text-gray-400 mt-8">
             <Link href={switchLang('en')} onClick={closeMenu} className={lang === 'en' ? 'text-black' : ''}>EN</Link>
             <Link href={switchLang('fr')} onClick={closeMenu} className={lang === 'fr' ? 'text-black' : ''}>FR</Link>
             <Link href={switchLang('ar')} onClick={closeMenu} className={lang === 'ar' ? 'text-black' : ''}>ع</Link>
          </div>
        </div>
      </div>
    </>
  );
}