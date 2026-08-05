"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const content: Record<string, any> = {
  en: {
    springSummer: "SPRING / SUMMER 2026",
    heading: "Elegance Redefined",
    description: "Discover the silence of luxury. A collection inspired by the golden dunes and the modern spirit.",
    button: "View Collection",
    scroll: "Scroll",
  },
  fr: {
    springSummer: "PRINTEMPS / ÉTÉ 2026",
    heading: "L'Élégance Redéfinie",
    description: "Découvrez le silence du luxe. Une collection inspirée par les dunes dorées et l'esprit moderne.",
    button: "Voir la Collection",
    scroll: "Défiler",
  },
  ar: {
    springSummer: "ربيع / صيف ٢٠٢٦",
    heading: "تعريف الأناقة من جديد",
    description: "اكتشف صمت الفخامة. مجموعة مستوحاة من الكثبان الذهبية والروح العصرية.",
    button: "عرض المجموعة",
    scroll: "مرر للأسفل",
  }
};

export default function HeroWrapper({ lang }: { lang: string }) {
  const currentLang = content[lang] ? lang : 'en';
  const t = content[currentLang];
  const isRTL = currentLang === 'ar';

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-amina-sand px-4"
    >
      {/* 🖼️ BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/boutique_interior.png"
          alt="Amina Luxury Boutique Interior"
          fill
          className="object-cover"
          priority
        />

        {/* Flat darken + center-focus radial so text always reads clean */}
        <div className="absolute inset-0 bg-amina-ink/40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(28,21,18,0.55) 0%, rgba(28,21,18,0.25) 45%, rgba(28,21,18,0.15) 100%)",
          }}
        />
      </div>

      {/* ✨ FOREGROUND CONTENT */}
      <div className="relative z-10 text-center flex flex-col items-center max-w-3xl">

        <p className="text-amina-gold text-xs md:text-sm tracking-[0.35em] uppercase font-semibold mb-6 opacity-0 animate-slideUpFadeIn [animation-delay:100ms]">
          {t.springSummer}
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl text-amina-white font-serif mb-8 leading-[1.05] tracking-wide opacity-0 animate-slideUpFadeIn [animation-delay:300ms] drop-shadow-[0_2px_20px_rgba(28,21,18,0.5)]">
          {t.heading}
        </h1>

        <p className="text-amina-white/85 text-sm md:text-base max-w-lg mb-12 leading-relaxed opacity-0 animate-slideUpFadeIn [animation-delay:500ms]">
          {t.description}
        </p>

        <button className="group relative border border-amina-gold text-amina-gold bg-transparent overflow-hidden px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium opacity-0 animate-slideUpFadeIn [animation-delay:700ms] transition-colors duration-500 hover:text-amina-ink">
          <span className="absolute inset-0 bg-amina-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-luxury" />
          <span className="relative">{t.button}</span>
        </button>
      </div>

      {/* ⬇️ Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0 animate-slideUpFadeIn [animation-delay:1000ms]">
        <span className="text-amina-white/70 text-[10px] tracking-[0.3em] uppercase">{t.scroll}</span>
        <span className="w-px h-8 bg-amina-white/50 animate-bounce" />
      </div>

      {/* 🌫️ Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-amina-white z-20 pointer-events-none" />
    </main>
  );
}