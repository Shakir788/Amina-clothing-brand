"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCart } from "@/context/CartContext"; 
import SearchOverlay from './SearchOverlay'; 

export default function Header({ lang, dict }: { lang: string, dict: any }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false); 
  
  const { toggleCart, items } = useCart(); 
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <>
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ${
          scrolled || isSearchOpen
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100 py-0' 
            : 'bg-white/40 backdrop-blur-md border-b border-white/20' 
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between relative">
          
          {/* MOBILE MENU BUTTON & DESKTOP LINKS */}
          <div className="flex items-center gap-4 w-1/3">
            <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-black p-2 -ml-2 hover:bg-white/40 rounded-full transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] text-black font-bold drop-shadow-sm">
              <Link href={`/${lang}/collection`} className="hover:text-[#D4A373] transition-colors font-serif">{dict?.collection || 'Collection'}</Link>
              <Link href={`/${lang}/about`} className="hover:text-[#D4A373] transition-colors font-serif">{dict?.about || 'About'}</Link>
            </nav>
          </div>

          {/* LOGO */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center w-1/3 flex justify-center">
            <Link href={`/${lang}`} className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-black hover:opacity-80 transition drop-shadow-sm">AMINA</Link>
          </div>

          {/* ICONS SECTION (Right Side) */}
          <div className="flex items-center justify-end gap-3 md:gap-5 w-1/3 relative">
            
            {/* 👇 UPDATED LANGUAGE SWITCHER WITH GLOBE ICON */}
            <div className="relative" ref={langDropdownRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase text-black hover:text-[#D4A373] transition bg-white/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-gray-200 shadow-sm"
              >
                {/* 🌐 Clean Globe Icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                
                <span className="mt-[1px] leading-none">{lang === 'ar' ? 'ع' : lang}</span>
                
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-20 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden flex flex-col z-[60] animate-in fade-in zoom-in-95 duration-200">
                  <Link href={switchLang('en')} onClick={() => setIsLangOpen(false)} className={`text-[10px] md:text-xs font-bold tracking-widest uppercase py-2.5 text-center hover:bg-gray-50 transition ${lang === 'en' ? 'text-[#D4A373] bg-gray-50' : 'text-black'}`}>EN</Link>
                  <Link href={switchLang('fr')} onClick={() => setIsLangOpen(false)} className={`text-[10px] md:text-xs font-bold tracking-widest uppercase py-2.5 text-center hover:bg-gray-50 transition border-t border-gray-100 ${lang === 'fr' ? 'text-[#D4A373] bg-gray-50' : 'text-black'}`}>FR</Link>
                  <Link href={switchLang('ar')} onClick={() => setIsLangOpen(false)} className={`text-xs font-bold tracking-widest py-2.5 text-center hover:bg-gray-50 transition font-arabic border-t border-gray-100 ${lang === 'ar' ? 'text-[#D4A373] bg-gray-50' : 'text-black'}`}>ع</Link>
                </div>
              )}
            </div>

            {/* SEARCH BUTTON */}
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="p-1 md:p-2 text-black hover:text-[#D4A373] transition transform hover:scale-105 drop-shadow-sm"
            >
              <svg width="18" height="18" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>

            {/* CART BUTTON */}
            <button onClick={toggleCart} className="relative p-1 md:p-2 text-black hover:text-[#D4A373] transition transform hover:scale-105 drop-shadow-sm">
              <svg width="20" height="20" className="md:w-[22px] md:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4A373] text-white text-[8px] md:text-[9px] font-bold w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center shadow-md">{items.length}</span>
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
        </div>
      </div>
    </>
  );
}