"use client";
import Link from 'next/link';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export default function HeroUI({ lang }: { lang: string }) {
  const container = useRef(null);

  useEffect(() => {
    gsap.fromTo(container.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 0.2 });
  }, []);

  return (
    // w-[100vw] aur left-1/2 text ko screen-wide banata hai, kisi chote dabbe me nahi fasne deta
    <div ref={container} className="absolute inset-0 z-30 flex flex-col items-center justify-center text-[#f5efe4] w-[100vw] left-1/2 -translate-x-1/2 px-6 pointer-events-none">
      
      <div className="pointer-events-auto flex flex-col items-center">
        <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 opacity-90 text-[#d4af37] font-semibold drop-shadow-md">
          Spring / Summer 2026
        </p>
        
        <h1 className="text-6xl md:text-[7rem] font-serif mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] text-center leading-tight tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
          Elegance <br className="md:hidden" /> Redefined
        </h1>
        
        <p className="max-w-md md:max-w-xl text-center text-sm md:text-base font-medium mb-10 opacity-90 drop-shadow-lg text-white/90">
          Discover the silence of luxury. A collection inspired by the golden dunes and the modern spirit.
        </p>
        
        <Link href={`/${lang}/collection`} className="border border-white/40 bg-black/20 backdrop-blur-md px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-xl rounded-sm">
          View Collection
        </Link>
      </div>
      
    </div>
  );
}