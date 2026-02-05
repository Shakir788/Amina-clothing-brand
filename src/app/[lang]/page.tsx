import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client'; 
import ProductCard from '@/components/product/ProductCard'; 

// 👇 MAGIC LINE: Ye purana cache hata degi aur naya data layegi
export const revalidate = 0;

// 1. Translations Logic
const content = {
  en: {
    subtitle: "SPRING / SUMMER 2026",
    title: "Elegance Redefined",
    description: "Discover the silence of luxury. A collection inspired by the golden dunes and the modern spirit.",
    cta: "View Collection",
    storyTitle: "The Essence",
    storyText: "AMINA is not just a brand; it is a state of mind. Born from the earth, designed for the soul. We believe in fashion that whispers.",
    latestArrivals: "Latest Arrivals",
    viewAll: "View All Products"
  },
  fr: {
    subtitle: "PRINTEMPS / ÉTÉ 2026",
    title: "L'Élégance Redéfinie",
    description: "Découvrez le silence du luxe. Une collection inspirée par les dunes dorées et l'esprit moderne.",
    cta: "Voir la Collection",
    storyTitle: "L'Essence",
    storyText: "AMINA n'est pas seulement une marque; c'est un état d'esprit. Né de la terre, conçu pour l'âme. Nous croyons en une mode qui chuchote.",
    latestArrivals: "Derniers Arrivages",
    viewAll: "Voir Tous les Produits"
  },
  ar: {
    subtitle: "ربيع / صيف 2026",
    title: "أناقة بلا حدود",
    description: "اكتشفي صمت الفخامة. تشكيلة مستوحاة من الكثبان الذهبية والروح العصرية.",
    cta: "تصفح المجموعة",
    storyTitle: "الجوهر",
    storyText: "أمينة ليست مجرد علامة تجارية؛ إنها حالة ذهنية. ولدت من الأرض، وصممت للروح. نؤمن بالأزياء التي تهمس بالأناقة.",
    latestArrivals: "أحدث المنتجات",
    viewAll: "عرض كل المنتجات"
  }
};

// 2. Data Fetching Function (Server Side)
async function getLatestProducts() {
  // 👇 UPDATE: name_fr aur name_ar bhi mangwaya taaki language change ho sake
  const query = `*[_type == "product"] | order(_createdAt desc)[0...8] {
    _id,
    name,       // English
    name_fr,    // French
    name_ar,    // Arabic
    price,
    originalPrice,
    slug,
    image,
    category->
  }`;
  return await client.fetch(query);
}

// 3. Main Page Component
export default async function HomePage({ params }: { params: { lang: string } }) {
  const products = await getLatestProducts(); 
  
  // @ts-ignore
  const t = content[params.lang] || content.en;
  const isArabic = params.lang === 'ar';

  return (
    <div className={`min-h-screen bg-[#F4F1EA] ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/20 bg-gradient-to-b from-white/30 via-transparent to-[#F4F1EA]" />
        </div>

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

      {/* ================= ESSENCE SECTION ================= */}
      <section className="relative py-20 px-6 bg-[#F4F1EA]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <span className="text-4xl text-[#D4A373] block mb-4">❦</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-4 tracking-tight">
              {t.storyTitle}
            </h2>
            <div className="w-12 h-[1px] bg-[#D4A373] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              {t.storyText}
            </p>
          </div>
        </div>
      </section>

      {/* ================= LATEST ARRIVALS GRID ================= */}
      <section className="py-10 px-4 md:px-8 max-w-[1400px] mx-auto bg-[#F4F1EA]">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-10 px-2">
          <h2 className="text-2xl md:text-3xl font-serif text-black">
            {t.latestArrivals}
          </h2>
          <Link href={`/${params.lang}/collection`} className="hidden md:block text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-[#D4A373] transition">
             {t.viewAll} →
          </Link>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((product: any) => {
              
              // 👇 LOGIC FIX: Check karo kaunsi language hai aur sahi naam uthao
              let displayName = product.name; // Default: English

              if (params.lang === 'fr' && product.name_fr) {
                  displayName = product.name_fr; 
              } else if (params.lang === 'ar' && product.name_ar) {
                  displayName = product.name_ar; 
              }

              // Card ko sahi naam bhej rahe hain
              const fixedProduct = { ...product, name: displayName };

              return (
                <ProductCard key={product._id} product={fixedProduct} lang={params.lang} />
              )
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-20">Loading luxury pieces...</p>
        )}

        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
          <Link 
            href={`/${params.lang}/collection`}
            className="inline-block border-b border-black pb-1 text-xs font-bold tracking-[0.2em] uppercase hover:text-[#D4A373] hover:border-[#D4A373] transition-colors"
          >
            {t.viewAll}
          </Link>
        </div>

      </section>

    </div>
  );
}