"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from "@/context/CartContext"; 

// 👇 'dict' prop add kiya hai (Type: any rakha hai taaki error na aaye)
export default function Header({ lang, dict }: { lang: string, dict: any }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart, items } = useCart(); 

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
      <header className="sticky top-0 z-50 w-full bg-amina-sand/95 backdrop-blur-sm border-b border-amina-border/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          
          {/* LEFT: MOBILE MENU BUTTON */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="text-amina-black p-2 -ml-2 hover:bg-amina-border/20 rounded-full transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>

          {/* LEFT: DESKTOP NAV */}
          <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] text-amina-stone font-medium">
            {/* 👇 Dictionary Values Use Kiye Hain */}
            <Link href={`/${lang}/collection`} className="hover:text-amina-black transition-colors">
              {dict?.collection || 'Collection'}
            </Link>
            <Link href={`/${lang}/about`} className="hover:text-amina-black transition-colors">
              {dict?.about || 'About'}
            </Link>
          </nav>

          {/* CENTER: LOGO */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <Link href={`/${lang}`} className="text-3xl font-serif font-bold tracking-widest text-amina-black hover:opacity-80 transition">
              AMINA
            </Link>
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-4 md:gap-8">
            
            {/* Lang Switcher */}
            <div className="hidden md:flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-amina-stone">
              <Link href={switchLang('en')} className={`hover:text-amina-black transition ${lang === 'en' ? 'text-amina-black underline' : ''}`}>EN</Link>
              <span className="text-amina-border">|</span>
              <Link href={switchLang('fr')} className={`hover:text-amina-black transition ${lang === 'fr' ? 'text-amina-black underline' : ''}`}>FR</Link>
              <span className="text-amina-border">|</span>
              <Link href={switchLang('ar')} className={`hover:text-amina-black transition ${lang === 'ar' ? 'text-amina-black underline font-arabic text-xs' : 'font-arabic text-xs'}`}>ع</Link>
            </div>

            {/* CART BUTTON */}
            <button onClick={toggleCart} className="relative p-2 text-amina-black hover:text-amina-clay transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amina-clay text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {items.length}
                </span>
              )}
            </button>
            
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[60] bg-amina-sand transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={closeMenu} className="absolute top-6 right-6 p-4 text-amina-black hover:rotate-90 transition">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <Link href={`/${lang}`} onClick={closeMenu} className="text-3xl font-serif text-amina-black hover:text-amina-clay transition">
            Home
          </Link>
          <Link href={`/${lang}/collection`} onClick={closeMenu} className="text-3xl font-serif text-amina-black hover:text-amina-clay transition">
            {dict?.collection || 'Collection'}
          </Link>
          <Link href={`/${lang}/about`} onClick={closeMenu} className="text-3xl font-serif text-amina-black hover:text-amina-clay transition">
            {dict?.about || 'About'}
          </Link>
          
          <div className="w-12 h-px bg-amina-clay my-6"></div>

          <div className="flex gap-6 text-sm font-bold tracking-widest uppercase text-amina-stone">
             <Link href={switchLang('en')} onClick={closeMenu} className={lang === 'en' ? 'text-amina-black underline' : ''}>EN</Link>
             <Link href={switchLang('fr')} onClick={closeMenu} className={lang === 'fr' ? 'text-amina-black underline' : ''}>FR</Link>
             <Link href={switchLang('ar')} onClick={closeMenu} className={`font-arabic ${lang === 'ar' ? 'text-amina-black underline' : ''}`}>ع</Link>
          </div>
        </div>
      </div>
    </>
  );
}