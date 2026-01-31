"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from "@/context/CartContext"; 

export default function Header({ lang, dict }: { lang: string, dict: any }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { toggleCart, items } = useCart(); 

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

  return (
    <>
      {/* 👇 FIX: Logic Change kiya hai readability ke liye */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100 py-0' // Scroll hone par Solid White
            : 'bg-white/40 backdrop-blur-md border-b border-white/20' // Top par: Milky Glass (Transparent + Readable)
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          
          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="text-black p-2 -ml-2 hover:bg-white/40 rounded-full transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>

          {/* DESKTOP NAV - Added drop-shadow for extra readability */}
          <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] text-black font-bold drop-shadow-sm">
            <Link href={`/${lang}/collection`} className="hover:text-[#D4A373] transition-colors font-serif">
              {dict?.collection || 'Collection'}
            </Link>
            <Link href={`/${lang}/about`} className="hover:text-[#D4A373] transition-colors font-serif">
              {dict?.about || 'About'}
            </Link>
          </nav>

          {/* LOGO - Added drop-shadow */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <Link href={`/${lang}`} className="text-3xl font-serif font-bold tracking-widest text-black hover:opacity-80 transition drop-shadow-sm">
              AMINA
            </Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4 md:gap-8">
            
            {/* Lang Switcher - Darker Text */}
            <div className="hidden md:flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-black/80 drop-shadow-sm">
              <Link href={switchLang('en')} className={`hover:text-[#D4A373] transition ${lang === 'en' ? 'text-black underline decoration-[#D4A373]' : ''}`}>EN</Link>
              <span className="text-black/30">|</span>
              <Link href={switchLang('fr')} className={`hover:text-[#D4A373] transition ${lang === 'fr' ? 'text-black underline decoration-[#D4A373]' : ''}`}>FR</Link>
              <span className="text-black/30">|</span>
              <Link href={switchLang('ar')} className={`hover:text-[#D4A373] transition ${lang === 'ar' ? 'text-black underline decoration-[#D4A373] font-arabic text-xs' : 'font-arabic text-xs'}`}>ع</Link>
            </div>

            {/* CART */}
            <button onClick={toggleCart} className="relative p-2 text-black hover:text-[#D4A373] transition transform hover:scale-105 drop-shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4A373] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {items.length}
                </span>
              )}
            </button>
            
          </div>
        </div>
      </header>

      {/* MOBILE MENU (No Change needed here, looks good) */}
      <div className={`fixed inset-0 z-[60] bg-[#FDFBF7] transition-transform duration-700 cubic-bezier(0.77,0,0.175,1) ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={closeMenu} className="absolute top-6 right-6 p-4 text-black hover:rotate-90 transition duration-300">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
          <Link href={`/${lang}`} onClick={closeMenu} className="text-4xl font-serif text-black hover:text-[#D4A373] transition">
            Home
          </Link>
          <Link href={`/${lang}/collection`} onClick={closeMenu} className="text-3xl font-serif text-gray-600 hover:text-[#D4A373] transition">
            {dict?.collection || 'Collection'}
          </Link>
          <Link href={`/${lang}/about`} onClick={closeMenu} className="text-3xl font-serif text-gray-600 hover:text-[#D4A373] transition">
            {dict?.about || 'About'}
          </Link>
          
          <div className="w-16 h-px bg-[#D4A373]/30 my-8"></div>

          <div className="flex gap-8 text-sm font-bold tracking-widest uppercase text-gray-400">
             <Link href={switchLang('en')} onClick={closeMenu} className={lang === 'en' ? 'text-black scale-110' : ''}>EN</Link>
             <Link href={switchLang('fr')} onClick={closeMenu} className={lang === 'fr' ? 'text-black scale-110' : ''}>FR</Link>
             <Link href={switchLang('ar')} onClick={closeMenu} className={`font-arabic ${lang === 'ar' ? 'text-black scale-110' : ''}`}>ع</Link>
          </div>
        </div>
      </div>
    </>
  );
}