"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Simple Translations
const content = {
  en: {
    subtitle: "SPRING / SUMMER 2025",
    title: "Elegance Redefined",
    description: "Discover the silence of luxury. A collection inspired by the golden dunes and the modern spirit.",
    cta: "View Collection",
    storyTitle: "The Essence",
    storyText: "AMINA is not just a brand; it is a state of mind. Born from the earth, designed for the soul. We believe in fashion that whispers."
  },
  fr: {
    subtitle: "PRINTEMPS / ÉTÉ 2025",
    title: "L'Élégance Redéfinie",
    description: "Découvrez le silence du luxe. Une collection inspirée par les dunes dorées et l'esprit moderne.",
    cta: "Voir la Collection",
    storyTitle: "L'Essence",
    storyText: "AMINA n'est pas seulement une marque; c'est un état d'esprit. Né de la terre, conçu pour l'âme. Nous croyons en une mode qui chuchote."
  },
  ar: {
    subtitle: "ربيع / صيف 2025",
    title: "أناقة بلا حدود",
    description: "اكتشفي صمت الفخامة. تشكيلة مستوحاة من الكثبان الذهبية والروح العصرية.",
    cta: "تصفح المجموعة",
    storyTitle: "الجوهر",
    storyText: "أمينة ليست مجرد علامة تجارية؛ إنها حالة ذهنية. ولدت من الأرض، وصممت للروح. نؤمن بالأزياء التي تهمس بالأناقة."
  }
};

// 👇 UPDATED PLAYLIST (Tumhare latest screenshot ke hisab se)
const videoPlaylist = [
  "/video7.mp4",  // Best wali sabse upar
  "/video1.mov",  // Screenshot me ye .mov hai
  "/video2.mp4",
  "/video3.mp4",
  "/video4.mov",  // Screenshot me ye .mov hai
  "/video5.mp4",
  "/video6.mp4"   // 👈 Note: Ise maine .mp4 kar diya hai kyunki screenshot me yehi dikh raha hai
];

export default function HomePage({ params }: { params: { lang: string } }) {
  // @ts-ignore
  const t = content[params.lang] || content.en;
  const isArabic = params.lang === 'ar';

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoPlaylist.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => console.log("Autoplay blocked:", error));
    }
  }, [currentVideoIndex]);

  return (
    <div className={`min-h-screen bg-[#F4F1EA] ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <video
            ref={videoRef}
            key={videoPlaylist[currentVideoIndex]}
            className="absolute top-0 left-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000"
            autoPlay
            muted
            loop={false}
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src={videoPlaylist[currentVideoIndex]} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/20 bg-gradient-to-b from-white/30 via-transparent to-[#F4F1EA]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mt-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-gray-900 mb-6 uppercase drop-shadow-sm">
            {t.subtitle}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-black mb-8 tracking-tight drop-shadow-md">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-900 font-medium mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {t.description}
          </p>
          <Link 
            href={`/${params.lang}/collection`}
            className="inline-block border border-black px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300 bg-white/40 backdrop-blur-sm shadow-lg"
          >
            {t.cta}
          </Link>
        </div>
      </section>

      {/* 2. THE ESSENCE SECTION */}
      <section className="relative py-24 px-6 bg-[#F4F1EA]">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-b from-white to-[#F9F7F2] rounded-t-[50%] rounded-b-2xl p-12 md:p-20 text-center shadow-[0_20px_50px_-10px_rgba(212,163,115,0.2)] border border-[#D4A373]/30 transform hover:-translate-y-1 transition-transform duration-700">
            <div className="flex justify-center mb-6">
              <span className="text-4xl text-[#D4A373]">❦</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C2C2C] mb-6 tracking-tight">
              {t.storyTitle}
            </h2>
            <div className="w-16 h-[2px] bg-[#D4A373]/50 mx-auto mb-10"></div>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              {t.storyText}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}