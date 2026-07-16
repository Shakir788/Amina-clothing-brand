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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      {/* Floating pill nav — sits inset from the edges like a boutique storefront */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center px-3 md:px-6 pt-3 md:pt-5">
        <header
          className={`w-full max-w-7xl transition-all duration-700 ease-luxury rounded-full ${
            scrolled || isSearchOpen
              ? 'glass-pill shadow-luxury-sm border border-amina-border/60'
              : 'bg-white/25 backdrop-blur-md border border-white/30'
          }`}
        >
          <div className="px-4 md:px-8 h-16 md:h-[76px] flex items-center justify-between relative">

            {/* MOBILE MENU BUTTON & DESKTOP LINKS */}
            <div className="flex items-center gap-4 w-1/3">
              <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-amina-ink p-2 -ml-2 hover:bg-white/40 rounded-full transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.22em] text-amina-ink font-semibold">
                <Link href={`/${lang}/collection`} className="relative hover:text-amina-gold transition-colors duration-300 font-serif group">
                  {dict?.collection || 'Collection'}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amina-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link href={`/${lang}/about`} className="relative hover:text-amina-gold transition-colors duration-300 font-serif group">
                  {dict?.about || 'About'}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amina-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>
            </div>

            {/* LOGO — solid, high-contrast on both video and glass backgrounds */}
            <div className="absolute left-[35%] md:left-1/2 transform -translate-x-1/2 text-center flex justify-center z-10">
              <Link
                href={`/${lang}`}
                className={`text-xl md:text-2xl font-serif font-bold tracking-[0.15em] transition-all duration-500 hover:text-amina-gold ${
                  scrolled ? 'text-amina-ink' : 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]'
                }`}
              >
                AMINA
              </Link>
            </div>

            {/* ICONS SECTION */}
            <div className="flex items-center justify-end gap-2.5 md:gap-4 w-1/3 relative">

              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold tracking-widest uppercase text-amina-ink hover:text-amina-gold transition bg-white/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-amina-border/70 shadow-sm"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span className="mt-[1px] leading-none">{lang === 'ar' ? 'ع' : lang}</span>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-2 w-20 bg-white/95 backdrop-blur-xl border border-amina-border shadow-luxury rounded-2xl overflow-hidden flex flex-col z-[60] animate-in fade-in zoom-in-95 duration-200">
                    <Link href={switchLang('en')} onClick={() => setIsLangOpen(false)} className={`text-[10px] md:text-xs font-bold tracking-widest uppercase py-2.5 text-center hover:bg-amina-rose/10 transition ${lang === 'en' ? 'text-amina-gold bg-amina-rose/10' : 'text-amina-ink'}`}>EN</Link>
                    <Link href={switchLang('fr')} onClick={() => setIsLangOpen(false)} className={`text-[10px] md:text-xs font-bold tracking-widest uppercase py-2.5 text-center hover:bg-amina-rose/10 transition border-t border-amina-border/70 ${lang === 'fr' ? 'text-amina-gold bg-amina-rose/10' : 'text-amina-ink'}`}>FR</Link>
                    <Link href={switchLang('ar')} onClick={() => setIsLangOpen(false)} className={`text-xs font-bold tracking-widest py-2.5 text-center hover:bg-amina-rose/10 transition font-arabic border-t border-amina-border/70 ${lang === 'ar' ? 'text-amina-gold bg-amina-rose/10' : 'text-amina-ink'}`}>ع</Link>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 md:p-2 text-amina-ink hover:text-amina-gold transition transform hover:scale-110 duration-300"
              >
                <svg width="17" height="17" className="md:w-[19px] md:h-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>

              <button onClick={toggleCart} className="relative p-1.5 md:p-2 text-amina-ink hover:text-amina-gold transition transform hover:scale-110 duration-300">
                <svg width="19" height="19" className="md:w-[21px] md:h-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amina-gold text-white text-[8px] md:text-[9px] font-bold w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center shadow-glow-gold">{items.length}</span>
                )}
              </button>

            </div>
          </div>
        </header>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[60] bg-amina-ivory transition-transform duration-700 ease-luxury ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={closeMenu} className="absolute top-6 right-6 p-4 text-amina-ink hover:rotate-90 transition duration-300">
           <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500">
          <Link href={`/${lang}`} onClick={closeMenu} className="text-4xl font-serif text-amina-ink hover:text-amina-gold transition-colors">Home</Link>
          <Link href={`/${lang}/collection`} onClick={closeMenu} className="text-3xl font-serif text-amina-stone hover:text-amina-gold transition-colors">{dict?.collection || 'Collection'}</Link>
        </div>
      </div>
    </>
  );
}