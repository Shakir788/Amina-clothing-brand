import Link from "next/link";
import Image from "next/image";

// Simple Content Translation logic (Taaki alag file na banani pade)
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

export default function Home({ params }: { params: { lang: string } }) {
  // @ts-ignore
  const t = content[params.lang] || content.en;
  const isArabic = params.lang === 'ar';

  return (
    <div className="w-full min-h-screen bg-amina-sand">
      
      {/* HERO SECTION */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop"
            alt="AMINA Hero"
            fill
            className="object-cover object-top opacity-90"
            priority
          />
          {/* Subtle warm overlay to blend with theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-amina-sand/90 via-amina-sand/20 to-transparent"></div>
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 mt-32">
          
          <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-amina-black mb-6 uppercase animate-fade-in-up">
            {t.subtitle}
          </p>
          
          <h1 className={`text-6xl md:text-8xl text-amina-black mb-8 leading-tight drop-shadow-sm ${isArabic ? 'font-arabic font-bold' : 'font-serif'}`}>
            {t.title}
          </h1>
          
          <p className={`text-lg md:text-xl text-amina-black/80 max-w-2xl mx-auto mb-12 font-medium ${isArabic ? 'font-arabic' : 'font-light'}`}>
            {t.description}
          </p>
          
          <Link 
            href={`/${params.lang}/collection`} 
            className="inline-block border border-amina-black px-10 py-4 text-sm uppercase tracking-widest hover:bg-amina-black hover:text-white transition-all duration-300 bg-white/50 backdrop-blur-md"
          >
            {t.cta}
          </Link>
        </div>
      </section>

      {/* BRAND STORY SECTION (The "About" Teaser) */}
      <section className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto text-center border p-12 border-amina-border rounded-t-[10rem] bg-white shadow-sm">
          <span className="text-4xl text-amina-clay mb-4 block">❦</span>
          <h2 className={`text-3xl font-serif mb-6 text-amina-black ${isArabic ? 'font-arabic' : ''}`}>
            {t.storyTitle}
          </h2>
          <p className={`text-amina-stone leading-loose text-lg ${isArabic ? 'font-arabic' : 'font-light'}`}>
            {t.storyText}
          </p>
        </div>
      </section>

    </div>
  );
}